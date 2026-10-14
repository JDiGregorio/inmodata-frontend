import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, Observable } from '@apollo/client'
import { MemoryRouter } from 'react-router'
import { AuthContext } from '../../src/contexts/AuthContext'
import { GeneralInformationTab as CreateUser } from '../../src/pages/User/components/GeneralInformation.create.tab'
import { GeneralInformationTab as EditUser } from '../../src/pages/User/components/GeneralInformation.edit.tab'
import { RightPanel } from '../../src/pages/Dashboard/components/DashboardMapView/RightPanel'
import { ValuationsTable } from '../../src/pages/Property/components/ValuationsTable'

const institutions = [{ id: '1', name: 'Banco A' }, { id: '2', name: 'Banco B' }]
const role = { id: '1', name: 'Analista' }
const user = { id: '2', name: 'Usuario de prueba', email: 'test@example.test', roles: [role], institutions: [institutions[0]] }
const params = new URLSearchParams(location.search)
const requests: { name: string; variables: unknown }[] = []
Object.assign(window, { institutionTestRequests: requests })
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink((operation) => new Observable((observer) => {
        requests.push({ name: operation.operationName, variables: operation.variables })
        let data: object
        switch (operation.operationName) {
            case 'ListRoles': data = { roles: { data: [role], paginatorInfo: { currentPage: 1, lastPage: 1, total: 1 } } }; break
            case 'ListInstitutions': data = { institutions: { data: institutions, paginatorInfo: { currentPage: 1, lastPage: 1, total: 2 } } }; break
            case 'CreateUser': data = { createUser: { id: '3', name: operation.variables.input.name } }; break
            case 'UpdateUser': data = { updateUser: { ...user, ...operation.variables.input, permisos: [], permisosExtra: [], institutions: institutions.filter((item) => operation.variables.input.institutionIds.includes(item.id)) } }; break
            case 'PropertyMapSummary': data = { propertyMapDetails: { id: '1', externalValuationSummary: { count: 2, hasNewer: true } } }; break
            case 'PropertyExternalValuations': data = { propertyMapDetails: { id: '1', externalValuations: {
                currentPage: operation.variables.page, hasMorePages: operation.variables.page === 1,
                data: [{ id: String(operation.variables.page), institutionName: operation.variables.page === 1 ? 'Banco B' : 'Banco C',
                    measuredAt: '2026-06-01', sector: 'financiero', averageValue: 1000000, averageSquareYard: 1234.4, landArea: 300, riskProfile: 'Good', isNewer: true }],
            } } }; break
            default: observer.error(new Error('Unexpected operation: ' + operation.operationName)); return
        }
        const timer = setTimeout(() => { observer.next({ data }); observer.complete() }, 20)
        return () => clearTimeout(timer)
    })),
})
const own = { id: '1', reference: 'PROPIA', institution: institutions[0], riskProfile: 'Good', measuredAt: '2026-01-01', canEdit: true, canDelete: true }
const external = { ...own, id: '2', reference: 'EXTERNA', institution: institutions[1], canEdit: false, canDelete: false }
const point = { id: '1', name: 'INMO000001', latitude: 14.1, longitude: -87.2, position: { lat: 14.1, lng: -87.2 }, quantity: 1,
    exactAddress: 'La Ceiba, Atlántida', cadastralKey: 'ABC-123', latestFinancialValuation: { ...own, sector: 'financiero', averageSquareYard: 1000, averageValue: 300000 } }

export function App() {
    const screen = params.get('screen')
    return <ApolloProvider client={client}><MemoryRouter><AuthContext.Provider value={{ user: { id: '1', name: 'Admin', email: 'admin@example.test', roles: [], permissions: ['edit-user', 'edit-valuation', 'view-valuation'] }, isReady: true, dispatch: () => {} }}>
        {screen === 'create' ? <CreateUser /> : screen === 'edit' ? <EditUser user={user as never} /> : screen === 'valuations'
            ? <ValuationsTable canCreate canEdit property={{ id: '1', latestValuation: own } as never} valuations={[own, external] as never} setModalOpen={() => {}} handleUpdate={() => {}} />
            : <div style={{ position: 'relative', height: '100vh', background: '#f3f4f6' }}><RightPanel point={point as never} onClose={() => {}} /></div>}
    </AuthContext.Provider></MemoryRouter></ApolloProvider>
}

createRoot(document.getElementById('root')!).render(<App />)
