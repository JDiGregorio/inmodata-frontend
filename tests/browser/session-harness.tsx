import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'
import { gql, useApolloClient } from '@apollo/client'
import axios from 'axios'
import { AuthContextProvider } from '../../src/contexts/AuthContext'
import { SessionApolloProvider } from '../../src/contexts/SessionApolloProvider'
import { useAuthContext } from '../../src/hooks/useAuthContext'
import setupInterceptors from '../../src/interceptors'

setupInterceptors()
const query = gql`query Private { secret }`
function Harness() {
    const { user, dispatch } = useAuthContext()
    const client = useApolloClient()
    Object.assign(window, {
        sessionTest: {
            login: (id: string) => dispatch({ type: 'LOGIN', payload: { id, name: id, email: `${id}@example.test`, roles: [], permissions: [] } }),
            logout: () => dispatch({ type: 'LOGOUT', payload: null }),
            seed: () => client.writeQuery({ query, data: { secret: 'private-A' } }),
            cache: () => client.readQuery({ query }),
            request: () => client.query({ query, fetchPolicy: 'network-only' }).catch(() => null),
            http: (path: string) => axios.get(path).catch(() => null),
        },
    })
    return <p data-testid="user">{user?.id ?? 'guest'}</p>
}
createRoot(document.getElementById('root')!).render(<StrictMode><CookiesProvider><AuthContextProvider><SessionApolloProvider><Harness /></SessionApolloProvider></AuthContextProvider></CookiesProvider></StrictMode>)
