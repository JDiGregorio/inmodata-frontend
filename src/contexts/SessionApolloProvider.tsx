import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import Cookies from 'js-cookie'
import { useAuthContext } from '../hooks/useAuthContext'
import { expireSession, isExpiredStatus, sessionGeneration } from '../lib/session'

export function SessionApolloProvider({ children }: { children: ReactNode }) {
    const { sessionVersion, user } = useAuthContext()
    return <SessionClient key={`${user?.id ?? 'guest'}:${sessionVersion ?? 0}`}>{children}</SessionClient>
}

function SessionClient({ children }: { children: ReactNode }) {
    const [client] = useState(() => {
        const generation = sessionGeneration()
        const errors = onError(({ graphQLErrors, networkError }) => {
            const status = networkError && 'statusCode' in networkError ? networkError.statusCode : null
            if (isExpiredStatus(status) || graphQLErrors?.some(error =>
                error.extensions?.category === 'authentication' || error.extensions?.code === 'UNAUTHENTICATED'
                || (error.message === 'Unauthenticated.' && Array.isArray(error.extensions?.guards)))) {
                expireSession(generation)
            }
        })
        const auth = setContext((_, { headers }) => ({
            credentials: 'include',
            headers: { ...headers, 'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') ?? '' },
        }))
        return new ApolloClient({
            cache: new InMemoryCache(),
            link: errors.concat(auth).concat(new HttpLink({ uri: `${import.meta.env.APP_BASE_URL}/graphql` })),
            connectToDevTools: import.meta.env.DEV,
            defaultOptions: { query: { errorPolicy: 'all' }, mutate: { errorPolicy: 'all' } },
        })
    })

    useEffect(() => () => {
        client.stop()
        // Clear without refetching private queries after logout. A new session owns a new cache.
        void client.clearStore().catch(() => {})
    }, [client])

    return <ApolloProvider client={client}>{children}</ApolloProvider>
}
