const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const http = require('node:http')

async function main() {
    const bundle = await build({ entryPoints: ['tests/browser/preappraisal-delete-harness.tsx'], bundle: true, write: false, jsx: 'automatic', define: { 'process.env.NODE_ENV': '"test"' } })
    const assets = await fs.readdir('dist/assets')
    const css = await fs.readFile(`dist/assets/${assets.find(file => file.endsWith('.css'))}`)
    const server = http.createServer((req, res) => {
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(bundle.outputFiles[0].text) }
        if (req.url === '/app.css') { res.setHeader('Content-Type', 'text/css'); return res.end(css) }
        res.end('<html><head><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage()
        await page.goto(`http://127.0.0.1:${server.address().port}`)
        const remove = page.getByTestId('allowed').getByRole('button', { name: 'Eliminar', exact: true })
        await remove.waitFor()
        assert.equal(await page.getByTestId('denied').getByRole('button', { name: 'Eliminar' }).count(), 0)
        await remove.click()
        await page.getByRole('dialog').getByText(/PRE-TEST/).waitFor()
        await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
        assert.equal(await page.locator('body').getAttribute('data-requests'), null)
        await remove.click()
        await page.getByRole('dialog').getByRole('button', { name: 'Eliminar', exact: true }).click()
        await page.getByTestId('allowed').getByText('Eliminado', { exact: true }).waitFor()
        assert.equal(await page.locator('body').getAttribute('data-requests'), '1')
        console.log('PASS: permission visibility, shared confirmation, reference, cancel without mutation, confirm once and refresh callback. No real backend requests.')
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
