const { chromium } = require('playwright')
const { build } = require('esbuild')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const os = require('node:os')
const http = require('node:http')

async function main() {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'inmodata-expanded-'))
    const sdk = `
        import {useEffect,useRef} from 'react';
        const map = { getBounds: () => ({ getNorthEast: () => ({lat:()=>15,lng:()=>-86}), getSouthWest:()=>({lat:()=>14,lng:()=>-88}) }),
            addListener: () => ({remove(){}}), panTo(){}, panBy(){}, setZoom(){}, fitBounds(){}, getDiv:()=>({clientWidth:1200}) };
        export const useMap = () => map;
        export const Map = ({children,style}) => <div style={style}><div data-testid="google-pane" style={{position:'absolute',inset:0,zIndex:100,background:'#cbd5d1'}}>{children}</div></div>;
        export const AdvancedMarker = ({onClick,children,position}) => {
            const ref=useRef(null);
            useEffect(()=>{ const click=e=>{if(ref.current?.contains(e.target)) onClick?.(e)}; document.addEventListener('click',click); return ()=>document.removeEventListener('click',click); },[onClick]);
            return <div ref={ref} role="button" tabIndex={0} aria-label="Seleccionar inmueble" style={{position:'absolute',left:position.lat===14.1?'20%':'35%',top:'50%',width:40,height:50,background:'#ffe500'}}>{children}</div>;
        };
    `
    const result = await build({ entryPoints: [path.join(__dirname, 'dashboard-expanded-harness.tsx')], bundle: true, write: false, jsx: 'automatic',
        loader: { '.png': 'dataurl' }, define: { 'process.env.NODE_ENV': '"test"', 'import.meta.env.APP_BASE_URL': '""' }, logLevel: 'silent',
        plugins: [{ name: 'maps-boundary', setup(builder) {
            builder.onResolve({ filter: /^@vis.gl\/react-google-maps$/ }, () => ({ path: 'sdk', namespace: 'stub' }))
            builder.onResolve({ filter: /\/PlacesSearch$/ }, () => ({ path: 'search', namespace: 'stub' }))
            builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'sdk' ? sdk : 'export const PlacesSearch = () => <input aria-label="Buscar dirección" />', loader: 'jsx', resolveDir: process.cwd() }))
            if (process.env.MAP_LAYER_BASELINE || process.env.MARKER_EVENT_BASELINE) builder.onLoad({ filter: /MapCanvas\.tsx$/ }, async args => {
                let contents = await fs.readFile(args.path, 'utf8')
                if (process.env.MAP_LAYER_BASELINE) contents = contents.replace(", position: 'relative', zIndex: 0", '')
                if (process.env.MARKER_EVENT_BASELINE) contents = contents.replace('onClickCapture={selectPoint}', '')
                return { contents, loader: 'tsx' }
            })
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
        page.setDefaultTimeout(10000)
        const errors = []
        page.on('pageerror', error => { errors.push(error.message); console.error(error.message) })
        await page.goto(`http://127.0.0.1:${server.address().port}`)
        await page.locator('[title="Ver detalle de INMO000693"]').click()
        await page.getByRole('link', { name: 'INMO000693' }).waitFor()
        await page.getByRole('button', { name: 'Expandir mapa' }).click()
        const dialog = page.getByRole('dialog')
        await dialog.getByRole('link', { name: 'INMO000693' }).waitFor()
        const close = dialog.getByRole('button', { name: 'Cerrar detalle' })
        await page.waitForTimeout(300)
        const onTop = await close.evaluate(node => { const r = node.getBoundingClientRect(); return node.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) })
        assert.equal(onTop, true, 'Expanded panel must be above Google panes, not merely present in DOM')
        for (const width of [1280, 900, 640]) {
            await page.setViewportSize({ width, height: 900 })
            await page.waitForTimeout(350)
            const toolbar = await dialog.getByTestId('expanded-map-toolbar').boundingBox()
            const panel = await dialog.getByTestId('map-right-panel').boundingBox()
            assert.ok(Math.abs(panel.y - (toolbar.y + toolbar.height) - 16) <= 1, 'Panel needs a 16px toolbar gap')
            assert.ok(Math.abs(panel.x + panel.width - toolbar.x - toolbar.width) <= 1, 'Right edges must align')
        }
        await page.setViewportSize({ width: 1280, height: 900 })
        await page.waitForTimeout(350)
        await close.click()
        await dialog.locator('[title="Ver detalle de INMO000694"]').click()
        await dialog.getByRole('link', { name: 'INMO000694' }).waitFor()
        await dialog.getByRole('button', { name: 'Más detalles' }).click()
        await dialog.getByText('Coordenadas:', { exact: true }).waitFor()
        await page.screenshot({ path: path.join(tmp, 'expanded-panel.png') })
        await dialog.getByRole('button', { name: 'Contraer mapa' }).click()
        await page.getByRole('link', { name: 'INMO000694' }).waitFor()
        await page.getByRole('button', { name: 'Cerrar detalle' }).click()
        await page.getByRole('button', { name: 'Expandir mapa' }).click()
        await dialog.locator('[title="Ver detalle de INMO000693"]').click()
        await dialog.getByRole('link', { name: 'INMO000693' }).waitFor()
        await page.keyboard.press('Escape')
        await page.getByRole('button', { name: 'Expandir mapa' }).waitFor()
        assert.deepEqual(errors, [])
        console.log(`PASS: normal/expanded selection, panel hit-testing above Google layers, details, close, collapse, Escape and retained selection. SDK mocked. Screenshot: ${tmp}`)
    } finally {
        await browser?.close()
        await new Promise(resolve => server.close(resolve))
    }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
