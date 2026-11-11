import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, Observable } from '@apollo/client'
import { MemoryRouter } from 'react-router'
import { PreAppraisalInstitutionSelect } from '../../src/pages/PreAppraisal/components/PreAppraisalInstitutionSelect'
import { RowActions } from '../../src/pages/PreAppraisal/components/RowActions'
import { isPasswordAllowed } from '../../src/utils/passwordPolicy'

const scenario = new URLSearchParams(location.search).get('scenario') ?? 'single'
const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink(() => new Observable(observer => {
    if (scenario === 'error') observer.error(new Error('Synthetic failure'))
    else observer.next({ data: { preAppraisalInstitutionOptions: {
        canSelectNone: scenario === 'global',
        institutions: scenario === 'single' ? [{ id: '1', name: 'Banco A' }] : [{ id: '1', name: 'Banco A' }, { id: '2', name: 'Banco B' }],
    } } })
    observer.complete()
})) })

function Harness() {
    const [value, setValue] = useState<string | null | undefined>(scenario === 'legacy' ? null : undefined)
    return <ApolloProvider client={client}><MemoryRouter><main className="p-4 max-w-lg">
        <PreAppraisalInstitutionSelect value={value} onChange={setValue} preserveUnassigned={scenario === 'legacy'} />
        <output data-testid="selection">{value === undefined ? 'unset' : value === null ? 'none' : value}</output>
        <RowActions preAppraisal={{ id: '1', status: 'DRAFT', canEdit: scenario === 'single' } as never} />
        <output data-testid="passwords">{JSON.stringify([
            isPasswordAllowed('x'), isPasswordAllowed('a long phrase with spaces'),
            isPasswordAllowed('a'.repeat(72)), isPasswordAllowed('a'.repeat(73)),
            isPasswordAllowed('é'.repeat(36)), isPasswordAllowed('é'.repeat(37)),
        ])}</output>
    </main></MemoryRouter></ApolloProvider>
}
createRoot(document.getElementById('root')!).render(<Harness />)
