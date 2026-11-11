const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')

async function main() {
    const built = await build({ entryPoints: [path.join(__dirname, 'login-harness.tsx')], bundle: true, write: false, jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"test"', 'import.meta.env.APP_BASE_URL': '""' }, logLevel: 'silent' })
    const server = http.createServer((req, res) => {
        res.setHeader('Content-Type', req.url === '/app.js' ? 'text/javascript' : 'text/html')
        res.end(req.url === '/app.js' ? built.outputFiles[0].text : '<html><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const cases = [
            ['/sanctum/csrf-cookie', 500, 'preparar la sesión (HTTP 500)'],
            ['/login', 419, 'HTTP 419'],
            ['/login', 422, 'Verifica el correo'],
            ['/login', 429, 'Demasiados intentos'],
            ['/api/user', 401, 'cargar el perfil (HTTP 401)'],
            ['/api/user', 500, 'cargar el perfil (HTTP 500)'],
            ['/api/user', 200, 'perfil válido'],
            [null, 200, null],
        ]
        for (const [failure, status, message] of cases) {
            const context = await browser.newContext()
            const page = await context.newPage()
            const errors = []
            const calls = []
            page.on('pageerror', error => errors.push(error.message))
            for (const endpoint of ['/sanctum/csrf-cookie', '/login', '/api/user']) {
                await page.route(`**${endpoint}`, async route => {
                    calls.push(endpoint)
                    assert.equal(route.request().headers().accept, 'application/json')
                    await route.fulfill({ status: endpoint === failure ? status : 200, json: endpoint === failure ? {} :
                        endpoint === '/api/user' ? { id: 'test-user', name: 'Test', roles: [], permissions: [] } : {} })
                })
            }
            await page.goto(`http://127.0.0.1:${server.address().port}`)
            await page.locator('#email').fill('test@example.test')
            await page.locator('#password').fill('synthetic-password')
            await page.locator('#password').press('Enter')
            if (message) await page.getByText(message, { exact: false }).waitFor()
            else await page.waitForFunction(() => document.querySelector('[data-testid=user]').textContent === 'test-user')
            await page.waitForFunction(() => !document.querySelector('button[type=submit]').disabled)
            assert.equal(calls.filter(endpoint => endpoint === '/login').length, failure === '/sanctum/csrf-cookie' ? 0 : 1)
            if (message) assert.equal(await page.getByTestId('user').textContent(), 'guest')
            assert.deepEqual(errors, [])
            await context.close()
        }
        console.log('PASS: CSRF errors, 419/422/429, profile 401/500, invalid profile, successful login, Enter single submission, loading recovery')
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
