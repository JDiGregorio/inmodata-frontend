import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import axios from 'axios'
import { AuthContextProvider } from '../../src/contexts/AuthContext'
import { SessionApolloProvider } from '../../src/contexts/SessionApolloProvider'
import { useAuthContext } from '../../src/hooks/useAuthContext'
import setupInterceptors from '../../src/interceptors'

setupInterceptors()
const query = gql`query Private { secret }`
const automaticQuery = gql`query Automatic { health }`
function AutomaticQuery() {
    const { data, loading, refetch } = useQuery(automaticQuery, { fetchPolicy: 'network-only' })
    return <><p data-testid="automatic">{loading ? 'loading' : data?.health ?? 'empty'}</p>
        <button onClick={() => void refetch()}>Refresh query</button></>
}
function Harness() {
    const { user, dispatch, sessionVersion } = useAuthContext()
    const client = useApolloClient()
    Object.assign(window, {
        sessionTest: {
            login: (id: string) => dispatch({ type: 'LOGIN', payload: { id, name: id, email: `${id}@example.test`, roles: [], permissions: [] } }),
            logout: () => dispatch({ type: 'LOGOUT', payload: null }),
            seed: () => client.writeQuery({ query, data: { secret: 'private-A' } }),
            cache: () => client.readQuery({ query }),
            request: () => client.query({ query, fetchPolicy: 'network-only' }).catch(() => null),
            http: (path: string) => axios.get(path).catch(() => null),
            version: () => sessionVersion,
        },
    })
    return <><p data-testid="user">{user?.id ?? 'guest'}</p>
        {user && new URLSearchParams(location.search).has('automatic') && <AutomaticQuery />}
    </>
}
createRoot(document.getElementById('root')!).render(<StrictMode><CookiesProvider><AuthContextProvider><SessionApolloProvider><Harness /></SessionApolloProvider></AuthContextProvider></CookiesProvider></StrictMode>)
