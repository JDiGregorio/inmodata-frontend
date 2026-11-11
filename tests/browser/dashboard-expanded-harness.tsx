import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, Observable } from '@apollo/client'
import { MemoryRouter } from 'react-router'
import { createApolloCache } from '../../src/lib/apolloCache'
import { AuthContext } from '../../src/contexts/AuthContext'
import DashboardMapView from '../../src/pages/Dashboard/components/DashboardMapView'

Object.assign(window, { google: { maps: { ControlPosition: { LEFT_BOTTOM: 6 }, marker: { PinElement: class {
    element = document.createElement('span')
    constructor() { Object.assign(this.element.style, { display: 'block', width: '24px', height: '36px', background: '#ffe500' }) }
} } } } })
const point = { __typename: 'Property', id: '1', name: 'INMO000693', exactAddress: 'Direccion de prueba', cadastralKey: null,
    latitude: 14.1, longitude: -87.2, quantity: 1, canViewHistory: true, latestAuthorizedValuationDate: '2025-01-01',
    latestFinancialValuation: { institution: { id: '1', name: 'Banco A' }, reference: 'VAL-1', sector: 'financiero',
        averageValue: 100000, landArea: 100, improvementArea: 20, landValue: 75000, utilizationRatio: 0.2,
        averageSquareYard: 750, averageSquareMeter: 1250, riskProfile: 'Good', measuredAt: '2025-01-01' } }
const client = new ApolloClient({ cache: createApolloCache(), link: new ApolloLink(operation => new Observable(observer => {
    if (operation.operationName === 'PropertiesWithinBounds') observer.next({ data: { propertiesWithinBounds: [point, { ...point, id: '2', name: 'INMO000694', latitude: 14.2 }] } })
    else if (operation.operationName === 'PropertyMapSummary') observer.next({ data: { propertyMapDetails: { id: '1', externalValuationSummary: { count: 0, hasNewer: false } } } })
    else { observer.error(new Error(operation.operationName)); return }
    observer.complete()
})) })
createRoot(document.getElementById('root')!).render(<ApolloProvider client={client}>
    <AuthContext.Provider value={{ user: { id: '1', permissions: ['view-property', 'view-valuation'] }, isReady: true, dispatch: () => {} } as never}>
        <MemoryRouter><div style={{ height: '100vh' }}><DashboardMapView /></div></MemoryRouter>
    </AuthContext.Provider>
</ApolloProvider>)
