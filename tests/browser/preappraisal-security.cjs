const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs/promises')
const os = require('node:os')

async function main() {
    const built = await build({ entryPoints: [path.join(__dirname, 'preappraisal-security-harness.tsx')], bundle: true, write: false,
        jsx: 'automatic', define: { 'process.env.NODE_ENV': '"test"' }, logLevel: 'silent' })
    const assets = await fs.readdir('dist/assets')
    const css = await fs.readFile(path.join('dist/assets', assets.find(name => name.endsWith('.css'))))
    const screenshots = await fs.mkdtemp(path.join(os.tmpdir(), 'inmodata-preappraisal-'))
    const server = http.createServer((req, res) => {
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(built.outputFiles[0].text) }
        if (req.url === '/app.css') { res.setHeader('Content-Type', 'text/css'); return res.end(css) }
        res.setHeader('Content-Type', 'text/html')
        res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        const base = `http://127.0.0.1:${server.address().port}`
        for (const [scenario, expected] of [['single', '1'], ['multi', 'unset'], ['global', 'none'], ['legacy', 'none'], ['error', 'unset']]) {
            await page.goto(`${base}/?scenario=${scenario}`)
            await page.waitForFunction(expected => document.querySelector('[data-testid=selection]')?.textContent === expected, expected)
            assert.equal(await page.getByRole('button', { name: 'Editar', exact: true }).count(), scenario === 'single' ? 1 : 0)
            assert.deepEqual(JSON.parse(await page.getByTestId('passwords').textContent()), [false, true, true, false, true, false])
            if (scenario === 'multi') {
                await page.getByRole('combobox').click()
                assert.equal(await page.getByRole('option', { name: 'Sin institución' }).count(), 0)
                await page.getByRole('option', { name: 'Banco B' }).click()
                assert.equal(await page.getByTestId('selection').textContent(), '2')
            }
            if (scenario === 'error') await page.getByRole('button', { name: 'Reintentar cargar instituciones' }).waitFor()
        }
        await page.goto(`${base}/?scenario=multi`)
        await page.getByRole('combobox').click()
        await page.screenshot({ path: path.join(screenshots, 'desktop.png') })
        await page.setViewportSize({ width: 390, height: 844 })
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
        await page.screenshot({ path: path.join(screenshots, 'mobile.png') })
        assert.deepEqual(errors, [])
        console.log(`PASS: institutional defaults/selection/legacy/error, row authorization, password boundaries, responsive layout. Screenshots: ${screenshots}`)
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
