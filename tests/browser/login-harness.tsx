import React from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { AuthContextProvider } from '../../src/contexts/AuthContext'
import { useAuthContext } from '../../src/hooks/useAuthContext'
import Login from '../../src/pages/Auth/Login'

function Harness() {
    const { user } = useAuthContext()
    return <><div data-testid="user">{user?.id ?? 'guest'}</div><Login /><Toaster /></>
}

createRoot(document.getElementById('root')!).render(<AuthContextProvider><Harness /></AuthContextProvider>)
