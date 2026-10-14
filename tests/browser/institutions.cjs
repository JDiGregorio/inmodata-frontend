// Run with Playwright available through NODE_PATH; no production dependency is required.
const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const http = require('node:http')

async function main() {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'inmodata-institutions-'))
    let browser
    let server
    try {
        await build({ entryPoints: [path.join(__dirname, 'institution-harness.tsx')], bundle: true, outfile: path.join(tmp, 'app.js'), jsx: 'automatic', define: { 'process.env.NODE_ENV': '"test"', 'import.meta.env.APP_BASE_URL': '""' }, logLevel: 'silent' })
        const assets = await fs.readdir('dist/assets')
        const css = await fs.readFile(path.join('dist/assets', assets.find((name) => name.endsWith('.css'))))
        const js = await fs.readFile(path.join(tmp, 'app.js'))
        server = http.createServer((req, res) => {
            if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(js) }
            if (req.url === '/app.css') { res.setHeader('Content-Type', 'text/css'); return res.end(css) }
            res.setHeader('Content-Type', 'text/html')
            res.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><div id="modal-container"></div><script src="/app.js"></script></body></html>')
        })
        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
        const url = `http://127.0.0.1:${server.address().port}`
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
        const errors = []
        page.on('pageerror', (error) => errors.push(error.message))
        const requests = (name) => page.evaluate((name) => window.institutionTestRequests.filter((request) => request.name === name), name)

        await page.goto(url)
        const toggle = page.getByRole('button', { name: /Otras valuaciones disponibles/ })
        await toggle.waitFor()
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
        assert.equal((await requests('PropertyExternalValuations')).length, 0)
        await toggle.click()
        await page.getByText('Solo lectura', { exact: true }).waitFor()
        assert.equal(await page.getByText('1,234.40', { exact: true }).count(), 1)
        assert.equal(await page.getByRole('button', { name: /Editar|Eliminar|Guardar/ }).count(), 0)
        await page.getByRole('button', { name: 'Página siguiente' }).click()
        await page.getByText('Banco C', { exact: true }).waitFor()
        await toggle.click()
        assert.equal(await page.getByText('Solo lectura', { exact: true }).count(), 0)
        await page.screenshot({ path: path.join(tmp, 'panel-desktop.png') })
        await page.setViewportSize({ width: 390, height: 844 })
        await toggle.click()
        await page.getByText('Solo lectura', { exact: true }).waitFor()
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
        await page.screenshot({ path: path.join(tmp, 'panel-mobile.png') })
        console.log('PASS: panel collapsed by default, explicit loading, pagination, readonly actions, mobile width')

        await page.goto(`${url}/?screen=edit`)
        await page.getByText('Banco A', { exact: false }).first().waitFor()
        await page.getByRole('button', { name: 'Seleccionar opciones' }).click()
        await page.getByRole('option', { name: 'Banco B' }).click()
        await page.getByRole('button', { name: 'Guardar', exact: true }).click()
        await page.waitForFunction(() => window.institutionTestRequests.some((request) => request.name === 'UpdateUser'))
        assert.deepEqual((await requests('UpdateUser'))[0].variables.input.institutionIds, ['1', '2'])
        console.log('PASS: edit preloads institutions and saves multiple assignments')

        await page.goto(`${url}/?screen=edit`)
        await page.getByRole('button', { name: 'Remove', exact: true }).click()
        await page.getByRole('button', { name: 'Guardar', exact: true }).click()
        await page.getByRole('button', { name: 'Confirmar', exact: true }).waitFor()
        assert.equal((await requests('UpdateUser')).length, 0)
        await page.getByRole('button', { name: 'Confirmar', exact: true }).click()
        await page.waitForFunction(() => window.institutionTestRequests.some((request) => request.name === 'UpdateUser'))
        assert.deepEqual((await requests('UpdateUser'))[0].variables.input.institutionIds, [])
        console.log('PASS: removing the last institution requires confirmation and sends an empty list')

        for (const selected of [[], ['Banco A', 'Banco B']]) {
            await page.goto(`${url}/?screen=create`)
            await page.locator('#name').fill('Nuevo usuario')
            await page.locator('#email').fill('nuevo@example.test')
            await page.locator('#password').fill('Password123!')
            await page.locator('#confirm-password').fill('Password123!')
            await page.locator('#role').fill('Analista')
            await page.getByRole('option', { name: 'Analista' }).click()
            for (const institution of selected) {
                await page.getByRole('button', { name: 'Seleccionar opciones' }).click()
                await page.getByRole('option', { name: institution }).click()
            }
            await page.getByRole('button', { name: 'Crear', exact: true }).click()
            await page.waitForFunction(() => window.institutionTestRequests.some((request) => request.name === 'CreateUser'))
            assert.equal((await requests('CreateUser'))[0].variables.input.institutionIds.length, selected.length)
        }
        console.log('PASS: creating users with zero and multiple institutions')

        await page.goto(`${url}/?screen=valuations`)
        const ownRow = page.getByRole('row').filter({ hasText: 'PROPIA' })
        const externalRow = page.getByRole('row').filter({ hasText: 'EXTERNA' })
        assert.equal(await ownRow.getByRole('button').count(), 1)
        assert.equal(await externalRow.getByRole('button').count(), 0)
        assert.equal(await externalRow.getByText('Solo lectura').count(), 1)
        console.log('PASS: authorized valuation keeps edit action, external valuation has none')
        assert.deepEqual(errors, [])
        console.log(`Screenshots: ${tmp}`)
    } finally {
        if (browser) await browser.close()
        if (server) await new Promise((resolve) => server.close(resolve))
    }
}

main().catch((error) => { console.error(error); process.exitCode = 1 })
