import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, Observable } from '@apollo/client'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createApolloCache } from '../../src/lib/apolloCache'
import { AuthContext } from '../../src/contexts/AuthContext'
import PropertyDetail from '../../src/pages/Property/detail'
import PropertyEdit from '../../src/pages/Property/edit'
import { InmuebleMapPreview } from '../../src/pages/Property/components/InmuebleMapPreview'

const params = new URLSearchParams(location.search)
const requests: string[] = []
Object.assign(window, { viewRequests: requests })
const property = { id: '1', name: 'INMO000656', cadastralKey: params.has('private') ? null : 'CAD-A',
    exactAddress: 'Dirección completa del inmueble de prueba', latitude: params.has('missing') ? null : 14.1, longitude: -87.2,
    canEdit: true, canDelete: false, quantity: 0 }
const client = new ApolloClient({ cache: createApolloCache(), link: new ApolloLink(operation => new Observable(observer => {
    requests.push(operation.operationName)
    if (operation.operationName === 'GetPropertyById') {
        observer.next({ data: { propertyById: params.has('denied') ? null : property } })
    } else if (operation.operationName === 'GetPropertiesWithinRadius') {
        observer.next({ data: { propertiesWithinRadius: [] } })
    } else { observer.error(new Error(`Unexpected operation: ${operation.operationName}`)); return }
    observer.complete()
})) })

export function EditableMapHarness() {
    const [point, setPoint] = useState({ lat: 14.1, lng: -87.2 })
    return <><output>{JSON.stringify(point)}</output><InmuebleMapPreview latitude={point.lat} longitude={point.lng} hasPoint onLatLngChange={(lat, lng) => setPoint({ lat, lng })} /></>
}

createRoot(document.getElementById('root')!).render(<ApolloProvider client={client}>
    <AuthContext.Provider value={{ user: { id: '1', permissions: ['view-property', ...(params.has('edit') ? ['edit-property'] : [])] }, isReady: true, dispatch: () => {} } as never}>
        <MemoryRouter initialEntries={['/inmuebles/1#informacion-general']}>
            {params.has('editableMap') ? <EditableMapHarness /> : <Routes><Route path="/inmuebles/:id" element={params.has('edit') ? <PropertyEdit /> : <PropertyDetail />} /></Routes>}
        </MemoryRouter>
    </AuthContext.Provider>
</ApolloProvider>)
