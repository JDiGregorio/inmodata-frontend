import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from '../../src/contexts/AuthContext'
import Login from '../../src/pages/Auth/Login'
import { withLayout } from '../../src/pages/Auth/Layout'

const LoginPage = withLayout(Login)
createRoot(document.getElementById('root')!).render(<AuthContextProvider><LoginPage /></AuthContextProvider>)
