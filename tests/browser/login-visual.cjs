const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const http = require('node:http')

async function main() {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'inmodata-login-'))
    const built = await build({ entryPoints: [path.join(__dirname, 'login-visual-harness.tsx')], bundle: true, write: false, jsx: 'automatic',
        loader: { '.png': 'dataurl', '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"test"', 'import.meta.env.APP_BASE_URL': '""' }, logLevel: 'silent' })
    const assets = await fs.readdir('dist/assets')
    const css = (await Promise.all(assets.filter(file => file.endsWith('.css')).map(file => fs.readFile(path.join('dist/assets', file))))).join('\n')
    const server = http.createServer((req, res) => {
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(built.outputFiles[0].text) }
        if (req.url === '/app.css') { res.setHeader('Content-Type', 'text/css'); return res.end(css) }
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage()
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        await page.route('**/api/user', route => route.fulfill({ status: 401, json: {} }))
        await page.addInitScript(() => { localStorage.setItem('isRemembered', 'true'); localStorage.setItem('email', 'usuario@example.test') })
        await page.goto(`http://127.0.0.1:${server.address().port}`)
        await page.getByRole('heading', { name: 'Bienvenido de nuevo' }).waitFor()
        await page.evaluate(() => Promise.all(Array.from(document.images).map(img => img.decode())))
        for (const [width, height] of [[1440, 900], [1440, 782], [1366, 768], [1280, 720], [1024, 600], [1024, 900], [768, 1024], [390, 844], [375, 667], [320, 568]]) {
            await page.setViewportSize({ width, height })
            await page.waitForTimeout(200)
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
            assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true, `Vertical overflow at ${width}x${height}`)
            assert.equal(await page.locator('button[type=submit]').isVisible(), true)
            assert.equal(await page.locator('.login-benefits').isVisible(), width >= 768)
            await page.screenshot({ path: path.join(tmp, `login-${width}-${height}.png`), fullPage: true })
        }
        assert.equal(await page.locator('button[type=submit]').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(170, 57, 51)')
        assert.equal(await page.locator('#remember-me').evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(170, 57, 51)')
        await page.setViewportSize({ width: 1440, height: 900 })
        const circle = await page.locator('.login-map-radius').evaluate(node => { const css = getComputedStyle(node); return { background: css.backgroundColor, shadow: css.boxShadow, image: css.backgroundImage } })
        assert.deepEqual(circle, { background: 'rgba(0, 0, 0, 0)', shadow: 'none', image: 'none' })
        assert.equal(await page.locator('.login-map-pin').evaluate(node => node.getBoundingClientRect().width), 30)
        assert.equal(await page.locator('#email').inputValue(), 'usuario@example.test')
        await page.locator('#password').fill('only-a-test-password')
        await page.getByRole('button', { name: 'Mostrar contraseña' }).click()
        assert.equal(await page.locator('#password').getAttribute('type'), 'text')
        await page.getByRole('button', { name: 'Ocultar contraseña' }).click()
        assert.equal(await page.locator('#password').getAttribute('type'), 'password')
        await page.getByRole('checkbox').click()
        assert.equal(await page.getByRole('checkbox').isChecked(), false)
        await page.getByRole('checkbox').focus()
        await page.keyboard.press('Space')
        assert.equal(await page.getByRole('checkbox').isChecked(), true)
        assert.deepEqual(errors, [])
        console.log(`PASS: login assets, layout 320/390/768/1024/1440, terracotta CTA/checkbox, clean radius, small pin, remembered email, password toggle and keyboard checkbox. Screenshots: ${tmp}`)
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
