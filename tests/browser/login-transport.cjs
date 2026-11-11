const { build } = require('esbuild')
const assert = require('node:assert/strict')
const vm = require('node:vm')
const path = require('node:path')
const axios = require('axios').default

async function main() {
    const built = await build({ entryPoints: [path.join(__dirname, '../../src/interceptors.ts')],
        bundle: true, write: false, platform: 'node', format: 'cjs', external: ['axios'] })
    const window = { location: { protocol: 'https:' } }
    const moduleObject = { exports: {} }
    vm.runInNewContext(built.outputFiles[0].text, { module: moduleObject, require, window })
    moduleObject.exports.default()
    const cases = [
        ['https:', 'http://app.example.test/login', undefined, 'https://app.example.test/login', undefined],
        ['https:', '/login', 'http://app.example.test', '/login', 'https://app.example.test'],
        ['https:', 'https://app.example.test/login', undefined, 'https://app.example.test/login', undefined],
        ['http:', 'http://localhost:8000/login', undefined, 'http://localhost:8000/login', undefined],
    ]
    for (const [protocol, url, baseURL, expectedUrl, expectedBase] of cases) {
        window.location.protocol = protocol
        const response = await axios.request({ url, baseURL, adapter: async config => ({
            data: null, status: 204, statusText: 'No Content', headers: {}, config,
        }) })
        assert.equal(response.config.url, expectedUrl)
        assert.equal(response.config.baseURL, expectedBase)
        assert.equal(response.config.withCredentials, true)
        assert.equal(response.config.withXSRFToken, true)
    }
    console.log('PASS: HTTPS page upgrades HTTP URL/baseURL, HTTPS remains unchanged, local HTTP preserved; no network requests')
}
main().catch(error => { console.error(error); process.exitCode = 1 })
