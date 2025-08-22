import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'

import Spinner from '@/components/layouts/Spinner.tsx'
import { useAuthContext } from '@/hooks/useAuthContext'
import { withLayout } from '@/pages/Auth/Layout'
import { ProtectRoutes } from '@/hooks/useProtectRoutes'
import Layout from '@/components/layouts/Layout'

const wLogin = lazy(() => import('@/pages/Auth/Login'))
const wForgotPassword = lazy(() => import('@/pages/Auth/ForgotPassword'))
const wResetPassword = lazy(() => import('@/pages/Auth/ResetPassword'))

const Login = withLayout(wLogin, 'Iniciar sesión')
const ForgotPassword = withLayout(wForgotPassword, "Restablecer contraseña")
const ResetPassword = withLayout(wResetPassword, "Restablecer contraseña")

function App() {
	const { user } = useAuthContext()
	const isAuthenticated = !!user?.id

	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path="/" element={isAuthenticated ? <Navigate to="/inicio" replace={true} /> : <Login />} />

				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/password-reset/:token" element={<ResetPassword />} />

				<Route element={<ProtectRoutes />}>
					<Route path="/*" element={<Layout />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

export default App
