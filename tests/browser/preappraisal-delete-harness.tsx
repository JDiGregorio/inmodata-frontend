import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router'
import { ApolloClient, ApolloProvider, ApolloLink, InMemoryCache, Observable } from '@apollo/client'
import { useState } from 'react'
import { RowActions } from '../../src/pages/PreAppraisal/components/RowActions'
import type { PreAppraisalRow } from '../../src/pages/PreAppraisal/components/types'
import { PreAppraisalStatus } from '../../src/generated-types'

let requests = 0
const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink(operation => new Observable(observer => {
    requests++
    document.body.dataset.requests = String(requests)
    setTimeout(() => {
        observer.next({ data: { deletePreAppraisal: { __typename: 'PreAppraisal', id: operation.variables.id } } })
        observer.complete()
    }, 300)
})) })
export function Harness() {
    const [deleted, setDeleted] = useState(false)
    const row = { id: '1', reference: 'PRE-TEST', uuid: 'test', status: PreAppraisalStatus.Draft, canEdit: false, canDelete: true } as PreAppraisalRow
    return <><div id="modal-container" /><div data-testid="allowed">{deleted ? 'Eliminado' : <RowActions preAppraisal={row} onDeleted={async () => { setDeleted(true) }} />}</div>
        <div data-testid="denied"><RowActions preAppraisal={{ ...row, id: '2', canDelete: false }} onDeleted={async () => { throw new Error('Unauthorized callback') }} /></div></>
}
createRoot(document.getElementById('root')!).render(<ApolloProvider client={client}><MemoryRouter><Harness /></MemoryRouter></ApolloProvider>)
