import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, Observable } from '@apollo/client'
import { createApolloCache } from '../../src/lib/apolloCache'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AuthContext } from '../../src/contexts/AuthContext'
import PropertyDetail from '../../src/pages/Property/detail'
import PropertyCreate from '../../src/pages/Property/create'
import { useCurrentPreAppraisalPreview } from '../../src/pages/PreAppraisal/components/useCurrentPreAppraisalPreview'
import { PreAppraisalSectorFilter } from '../../src/generated-types'

const params = new URLSearchParams(location.search)
const requests: { name: string; variables: unknown }[] = []
Object.assign(window, { workflowRequests: requests })
const own = { id: '1', reference: 'PROPIA', canEdit: false, canDelete: false, owner: 'Propietario autorizado', applicant: null,
    phone: null, sector: 'financiero', measuredAt: '2024-01-01', averageValue: 1000000, landArea: 100, improvementArea: 20,
    landValue: 75000, utilizationRatio: 0.2, averageSquareYard: 750, averageSquareMeter: 2000, riskProfile: 'Excellent', institution: { id: '1', name: 'Banco A' }, user: null }
const history = { total: 5, financialCount: 3, controlCount: 2, otherCount: 0, ownCount: 1, externalCount: 4, isGlobalScope: false,
    valueChange: 500, valueChangePercent: 66.67,
    valuePoints: [750, 850, 950, 1100, 1250].map((value, index) => ({ __typename: 'ValuationHistoryPoint', id: String(index + 1), date: `${2021 + index}-01-01`, sector: index % 2 ? 'control' : 'financiero', value })),
    riskPoints: [1, 2, 2, 3, 5].map((value, index) => ({ __typename: 'ValuationHistoryPoint', id: String(index + 1), date: `${2021 + index}-01-01`, sector: 'financiero', value })) }
const scenarios: Record<string, number[]> = {
    small: [0.5, 1.25, 2.75], thousands: [500, 1250, 1500, 2069.5],
    large: [10000.25, 12500.75, 20690.5], negative: [2069.5, 1500, 500],
    zero: [1250, 1250], single: [1250], repeated: [500, 1250, 2069.5],
}
const prices = scenarios[params.get('prices') ?? '']
if (prices) {
    history.valuePoints = prices.map((value, index) => ({ __typename: 'ValuationHistoryPoint', id: String(index + 1), date: params.get('prices') === 'repeated' ? '2025-01-01' : `${2021 + index}-01-01`, sector: index % 2 ? 'control' : 'financiero', value }))
    history.riskPoints = history.valuePoints.map(point => ({ ...point, value: 2 }))
    Object.assign(history, { valueChange: prices.length > 1 ? prices.at(-1)! - prices[0] : null,
        valueChangePercent: prices.length > 1 ? Math.round((prices.at(-1)! - prices[0]) / prices[0] * 10000) / 100 : null })
}
const client = new ApolloClient({ cache: createApolloCache(), link: new ApolloLink(operation => new Observable(observer => {
    requests.push({ name: operation.operationName, variables: operation.variables })
    if (operation.operationName === 'GetPropertyById') {
        observer.next({ data: { propertyById: { id: '1', name: 'INMO000656', cadastralKey: 'CAD-A', exactAddress: 'Dirección de prueba',
            latitude: 14.1, longitude: -87.2, canEdit: false, canDelete: false, quantity: 1, valuations: [own], latestValuation: { id: '1' }, valuationHistory: history } } })
        observer.complete()
    } else if (operation.operationName === 'CreateProperty') {
        observer.next({ data: { createProperty: { id: '1', name: 'INMO000656' } } }); observer.complete()
    } else if (operation.operationName === 'ValuationInstitutionOptions') {
        observer.next({ data: { hasGlobalInstitutionScope: false, valuationInstitutions: [{ id: '1', name: 'Banco A' }] } }); observer.complete()
    } else if (operation.operationName === 'PreviewPreAppraisal') {
        const radius = operation.variables.input.radiusMeters
        const timer = setTimeout(() => { observer.next({ data: { previewPreAppraisal: { radiusMeters: radius, samples: [{ propertyId: String(radius) }] } } }); observer.complete() }, radius === 600 ? 1600 : 30)
        return () => clearTimeout(timer)
    } else observer.error(new Error(`Unexpected operation ${operation.operationName}`))
})) })

export function PreviewHarness() {
    const [radius, setRadius] = useState(500)
    const preview = useCurrentPreAppraisalPreview({ targetLatitude: 14.1, targetLongitude: -87.2, radiusMeters: radius, sectorFilter: PreAppraisalSectorFilter.Both })
    return <div>
        <button onClick={() => setRadius(600)}>Radio 600</button><button onClick={() => setRadius(700)}>Radio 700</button>
        <div data-testid="preview">{preview.loading ? 'loading' : preview.data?.previewPreAppraisal.radiusMeters}</div>
        <div data-testid="samples">{preview.data?.previewPreAppraisal.samples.map(sample => sample.propertyId).join(',') ?? ''}</div>
    </div>
}

createRoot(document.getElementById('root')!).render(<ApolloProvider client={client}>
    <AuthContext.Provider value={{ user: { id: '1', name: 'Analista', permissions: params.has('create') ? ['add-property', 'add-valuation', 'view-property', 'view-valuation'] : params.has('propertyOnly') ? ['view-property'] : ['view-property', 'view-valuation'] }, isReady: true, dispatch: () => {} } as never}>
        <MemoryRouter initialEntries={[params.has('create') ? '/inmuebles/crear' : `/inmuebles/1${params.has('valuation') ? '?valuation=' + params.get('valuation') : ''}#${params.has('general') ? 'informacion-general' : 'valuaciones'}`]}>
            {params.has('preview') ? <PreviewHarness /> : <Routes><Route path="/inmuebles/crear" element={<PropertyCreate />} /><Route path="/inmuebles/:id" element={<PropertyDetail />} /></Routes>}
        </MemoryRouter>
    </AuthContext.Provider>
</ApolloProvider>)
