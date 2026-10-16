const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')

async function main() {
    const built = await build({ entryPoints: [path.join(__dirname, 'session-harness.tsx')], bundle: true, write: false, jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"development"', 'import.meta.env.APP_BASE_URL': '""', 'import.meta.env.APP_ENV': '"test"', 'import.meta.env.DEV': 'false' }, logLevel: 'silent' })
    const server = http.createServer((req, res) => {
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(built.outputFiles[0].text) }
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage()
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.goto(`http://127.0.0.1:${server.address().port}`)
        const user = id => page.waitForFunction(id => document.querySelector('[data-testid=user]')?.textContent === id, id)
        await user('guest')
        await page.evaluate(() => window.sessionTest.login('A'))
        await user('A')
        await page.evaluate(() => { window.sessionTest.seed(); localStorage.setItem('email', 'remember@example.test') })
        assert.equal(await page.evaluate(() => window.sessionTest.cache().secret), 'private-A')
        await page.evaluate(() => window.sessionTest.logout())
        await user('guest')
        assert.equal(await page.evaluate(() => window.sessionTest.cache()), null)
        await page.evaluate(() => window.sessionTest.login('B'))
        await user('B')
        assert.equal(await page.evaluate(() => window.sessionTest.cache()), null)

        for (const status of [403, 401, 419]) {
            await page.route('**/probe', route => route.fulfill({ status, contentType: 'application/json', body: '{}' }))
            await page.evaluate(() => window.sessionTest.http('/probe'))
            await user(status === 403 ? 'B' : 'guest')
            assert.equal(await page.evaluate(() => localStorage.getItem('email')), 'remember@example.test')
            await page.unroute('**/probe')
            await page.evaluate(() => window.sessionTest.login('B'))
            await user('B')
        }
        await page.route('**/graphql', route => route.fulfill({ json: { errors: [{ message: 'Unauthenticated.', extensions: { guards: ['web'] } }] } }))
        await page.evaluate(() => window.sessionTest.request())
        await user('guest')
        await page.unroute('**/graphql')
        await page.evaluate(() => window.sessionTest.login('A'))
        await user('A')
        let pending
        await page.route('**/probe', route => { pending = route })
        await page.evaluate(() => { void window.sessionTest.http('/probe') })
        while (!pending) await new Promise(resolve => setTimeout(resolve, 10))
        await page.evaluate(() => window.sessionTest.login('B'))
        await user('B')
        await pending.fulfill({ status: 401, body: '{}' })
        await page.waitForTimeout(100)
        await user('B')
        let pendingGraphql
        await page.route('**/graphql', route => { pendingGraphql = route })
        await page.evaluate(() => { void window.sessionTest.request() })
        while (!pendingGraphql) await new Promise(resolve => setTimeout(resolve, 10))
        await page.evaluate(() => window.sessionTest.login('C'))
        await user('C')
        await pendingGraphql.fulfill({ json: { data: { secret: 'late-private-B' } } })
        await page.waitForTimeout(100)
        assert.equal(await page.evaluate(() => window.sessionTest.cache()), null)
        await page.evaluate(() => { localStorage.setItem('user', '{invalid'); document.cookie = 'XSRF-TOKEN=test; path=/' })
        await page.reload()
        await user('guest')
        assert.equal(await page.evaluate(() => localStorage.getItem('user')), null)
        assert.deepEqual(errors, [])
        console.log('PASS: session cache isolation, logout, account switch, 401/419, 403 preservation, Lighthouse auth error, stale HTTP/GraphQL responses, malformed profile, remembered email, StrictMode')
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
