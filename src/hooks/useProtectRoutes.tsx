import { Outlet, Navigate } from 'react-router'

import { useAuthContext } from './useAuthContext'

export const ProtectRoutes = () => {
	const { user, isReady } = useAuthContext()

	if (!isReady) {
		return <>Loading...</>
	}

	const authenticated = !!user?.id
	const route = authenticated ? <Outlet /> : <Navigate to="/" />

	return route
}