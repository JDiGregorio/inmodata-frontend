const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const http = require('node:http')

async function main() {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'inmodata-bank-workflow-'))
    const result = await build({ entryPoints: [path.join(__dirname, 'bank-workflow-harness.tsx')], bundle: true, write: false, jsx: 'automatic',
        loader: { '.png': 'dataurl' }, define: { 'process.env.NODE_ENV': '"test"', 'import.meta.env.APP_BASE_URL': '""' }, logLevel: 'silent',
        plugins: [{ name: 'map-stub', setup(builder) {
            builder.onResolve({ filter: /InmuebleMapPreview$/ }, () => ({ path: 'map', namespace: 'test-map' }))
            builder.onLoad({ filter: /.*/, namespace: 'test-map' }, () => ({ contents: 'export const InmuebleMapPreview = ({onLatLngChange}) => <button type="button" onClick={() => onLatLngChange(14.1, -87.2)}>Seleccionar punto de prueba</button>', loader: 'jsx', resolveDir: process.cwd() }))
        } }] })
    const assets = await fs.readdir('dist/assets')
    const css = await fs.readFile(path.join('dist/assets', assets.find(file => file.endsWith('.css'))))
    const server = http.createServer((req, res) => {
        if (req.url === '/app.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(result.outputFiles[0].text) }
        if (req.url === '/app.css') { res.setHeader('Content-Type', 'text/css'); return res.end(css) }
        res.setHeader('Content-Type', 'text/html')
        res.end('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>')
    })
    let browser
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
        browser = await chromium.launch({ channel: 'chrome', headless: true })
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
        const errors = []
        page.on('pageerror', error => errors.push(error.message))
        const base = `http://127.0.0.1:${server.address().port}`
        await page.goto(base)
        await page.getByText('PROPIA', { exact: true }).waitFor()
        assert.equal(await page.getByRole('button', { name: /Añadir|Guardar|Eliminar|Actualizar/ }).count(), 0)
        await page.getByRole('button', { name: 'Ver valuación' }).click()
        await page.getByRole('heading', { name: 'Detalle de valuación' }).waitFor()
        await page.getByRole('button', { name: 'Cerrar detalle' }).click()
        await page.getByRole('button', { name: /Variación del valor/ }).click()
        const chart = page.getByRole('img', { name: 'Gráfica histórica' })
        await chart.waitFor()
        assert.equal(await chart.locator('text').filter({ hasText: /^L 750.00\/v²$/ }).count(), 1)
        assert.equal(await chart.locator('title').filter({ hasText: 'Control' }).count(), 2)
        const labels = await chart.locator('g[pointer-events=none] rect').evaluateAll(nodes => nodes.map(node => ({ x: +node.getAttribute('x'), width: +node.getAttribute('width') })))
        assert.ok(labels[0].x >= Number(await chart.locator('line').first().getAttribute('x1')))
        for (let i = 1; i < labels.length; i++) assert.ok(labels[i].x > labels[i - 1].x + labels[i - 1].width)
        await page.screenshot({ path: path.join(tmp, 'value-desktop.png') })
        await page.getByRole('button', { name: /Evolución del riesgo/ }).click()
        assert.equal(await chart.locator('text').filter({ hasText: 'R1 → R2' }).count(), 1)
        const circles = await chart.locator('circle').evaluateAll(nodes => nodes.map(node => +node.getAttribute('cy')))
        assert.ok(circles[0] < circles.at(-1))
        for (const width of [390, 768]) {
            await page.setViewportSize({ width, height: 844 })
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
            await page.screenshot({ path: path.join(tmp, `risk-${width}.png`) })
        }
        assert.equal(await page.evaluate(() => window.workflowRequests.some(request => /Create|Update|Delete|Mutation/.test(request.name))), false)
        await page.goto(`${base}/?valuation=999`)
        await page.getByText('La valuación no está disponible o no tiene permiso para consultarla.').waitFor()
        await page.goto(`${base}/?propertyOnly=1`)
        await page.getByText('CAD-A', { exact: true }).waitFor()
        assert.equal(await page.getByText('Valuaciones', { exact: true }).count(), 0)
        assert.equal(await page.evaluate(() => window.workflowRequests[0].variables.includeValuations), false)
        const cases = { small: [0.5, 1.25, 2.75], thousands: [500, 1250, 1500, 2069.5], large: [10000.25, 12500.75, 20690.5], negative: [2069.5, 1500, 500], zero: [1250, 1250], repeated: [500, 1250, 2069.5] }
        const currency = value => `L ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/v²`
        for (const [scenario, values] of Object.entries(cases)) {
            await page.goto(`${base}/?prices=${scenario}`)
            await page.getByRole('button', { name: /Variación del valor/ }).click()
            await chart.waitFor()
            assert.deepEqual(await chart.locator('g[pointer-events=none] text').allTextContents(), values.map(currency))
            const delta = values.at(-1) - values[0]
            await page.getByText(`Variación absoluta: ${delta > 0 ? '+' : ''}${currency(delta)}`, { exact: true }).waitFor()
            assert.equal(await chart.locator('circle').count(), values.length)
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
            if (scenario === 'thousands') {
                assert.ok((await chart.locator('text').allTextContents()).some(label => label.includes('1,000.00')))
                await page.screenshot({ path: path.join(tmp, 'prices-mobile.png') })
                await page.setViewportSize({ width: 1280, height: 900 })
                await page.waitForTimeout(250)
                await page.screenshot({ path: path.join(tmp, 'prices-desktop.png') })
            }
        }
        await page.goto(`${base}/?prices=single`)
        await page.getByRole('button', { name: /Variación del valor/ }).click()
        await page.getByText('No hay suficientes datos para graficar.').waitFor()
        assert.equal(await chart.count(), 0)
        await page.goto(`${base}/?preview=1`)
        await page.waitForFunction(() => document.querySelector('[data-testid=preview]').textContent === '500')
        await page.getByRole('button', { name: 'Radio 600' }).click()
        assert.equal(await page.getByTestId('samples').textContent(), '')
        await page.waitForFunction(() => window.workflowRequests.some(request => request.variables.input?.radiusMeters === 600))
        await page.getByRole('button', { name: 'Radio 700' }).click()
        await page.waitForFunction(() => document.querySelector('[data-testid=preview]').textContent === '700')
        await page.waitForTimeout(1800)
        assert.equal(await page.getByTestId('samples').textContent(), '700')
        await page.goto(`${base}/?create=1`)
        await page.getByRole('button', { name: 'Seleccionar punto de prueba' }).click()
        await page.getByRole('button', { name: 'Crear', exact: true }).click()
        await page.getByRole('heading', { name: 'Agregar Valuación', exact: true }).waitFor()
        assert.equal(await page.getByRole('button', { name: /Eliminar|Actualizar/ }).count(), 0)
        assert.equal(await page.evaluate(() => window.workflowRequests.filter(request => request.name === 'CreateProperty').length), 1)
        assert.deepEqual(errors, [])
        console.log(`PASS: readonly View, deep links, private operation boundary, unit labels, risk orientation/transitions, responsive, stale preview rejection. Screenshots: ${tmp}`)
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
