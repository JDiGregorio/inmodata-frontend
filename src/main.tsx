import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'
import { CookiesProvider } from 'react-cookie'
import { APIProvider } from '@vis.gl/react-google-maps'
import Cookies from 'js-cookie'
import { Toaster } from 'sonner'

import { setContext } from '@apollo/client/link/context'
import setupInterceptors from './interceptors.ts'
import { AuthContextProvider } from './contexts/AuthContext.tsx'

import App from './App.tsx'

import './index.css'

const BASE_URL = import.meta.env.APP_BASE_URL
const GRAPHQL_ENDPOINT = `${BASE_URL}/graphql`
const GOOGLE_API_KEY = import.meta.env.APP_GOOGLE_MAPS_API_KEY

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT })

const authLink = setContext((_, { headers }) => {
	const token = Cookies.get('XSRF-TOKEN')

	return {
		credentials: 'include',
		headers: {
			...headers,
			'X-XSRF-TOKEN': token ?? ''
		}
	}
})

const client = new ApolloClient({
	credentials: 'include',
	uri: GRAPHQL_ENDPOINT,
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink),
	connectToDevTools: true,
	defaultOptions: {
		query: {
			errorPolicy: 'all'
		},
		mutate: {
			errorPolicy: 'all'
		}
	}
})

setupInterceptors()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CookiesProvider defaultSetOptions={{ path: '/' }}>
			<AuthContextProvider>
				<ApolloProvider client={client}>
					<BrowserRouter basename={"/"}>
						<APIProvider apiKey={GOOGLE_API_KEY} language="es" onLoad={() => console.log('Maps API has loaded.')}>
							<App />
							<Toaster position="top-right" richColors closeButton expand={true} />
						</APIProvider>
					</BrowserRouter>
				</ApolloProvider>
			</AuthContextProvider>
		</CookiesProvider>
	</StrictMode>
)
