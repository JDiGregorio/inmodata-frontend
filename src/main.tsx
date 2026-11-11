import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { CookiesProvider } from 'react-cookie'
import { APIProvider } from '@vis.gl/react-google-maps'
import { Toaster } from 'sonner'

import setupInterceptors from './interceptors.ts'
import { AuthContextProvider } from './contexts/AuthContext.tsx'
import { SessionApolloProvider } from './contexts/SessionApolloProvider.tsx'

import App from './App.tsx'

import './index.css'

const GOOGLE_API_KEY = import.meta.env.APP_GOOGLE_MAPS_API_KEY

setupInterceptors()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CookiesProvider defaultSetOptions={{ path: '/' }}>
			<AuthContextProvider>
				<SessionApolloProvider>
					<BrowserRouter basename={"/"}>
						<APIProvider apiKey={GOOGLE_API_KEY} language="es" libraries={["places"]} onLoad={() => console.log('Maps API has loaded.')}>
							<App />
							<Toaster position="top-right" richColors closeButton expand={true} />
						</APIProvider>
					</BrowserRouter>
				</SessionApolloProvider>
			</AuthContextProvider>
		</CookiesProvider>
	</StrictMode>
)
