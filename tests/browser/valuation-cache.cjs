const assert = require('node:assert/strict')
const { buildSync } = require('esbuild')
const { gql, InMemoryCache } = require('@apollo/client/core')

const compiled = buildSync({ entryPoints: ['src/lib/apolloCache.ts'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['@apollo/client'] })
const moduleResult = { exports: {} }
new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, moduleResult, moduleResult.exports)
const { createApolloCache } = moduleResult.exports
const query = gql`query { history { valueChange valueChangePercent valuePoints { id date sector value } riskPoints { id date sector value } } }`
const point = (value, index) => ({ __typename: 'ValuationHistoryPoint', id: String(index + 1), date: '2025-01-01', sector: index % 2 ? 'control' : 'financiero', value })
const prices = [500, 1250, 1500, 2069.5]
const data = { history: { valueChange: 1569.5, valueChangePercent: 313.9, valuePoints: prices.map(point), riskPoints: [1, 2, 2, 2].map(point) } }
const original = new InMemoryCache()
original.writeQuery({ query, data })
assert.deepEqual(original.readQuery({ query }).history.valuePoints.map(p => p.value), [1, 2, 2, 2], 'Reproduce the original collision')
const cache = createApolloCache()
cache.writeQuery({ query, data })
const result = cache.readQuery({ query }).history
assert.deepEqual(result.valuePoints.map(p => p.value), prices)
assert.deepEqual(result.riskPoints.map(p => p.value), [1, 2, 2, 2])
assert.equal(result.valuePoints.at(-1).value - result.valuePoints[0].value, result.valueChange)
assert.equal(Math.round(result.valueChange / result.valuePoints[0].value * 10000) / 100, result.valueChangePercent)
cache.writeQuery({ query, data: { history: { ...data.history, riskPoints: [5, 4, 3, 2].map(point) } } })
assert.deepEqual(cache.readQuery({ query }).history.valuePoints.map(p => p.value), prices)
assert.equal(cache.identify({ __typename: 'Property', id: '1' }), 'Property:1')
console.log('PASS: reproduced price/risk cache collision; independent series, unchanged values/deltas and ordinary entity normalization after fix')
