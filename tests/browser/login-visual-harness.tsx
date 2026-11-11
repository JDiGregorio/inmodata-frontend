import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from '../../src/contexts/AuthContext'
import Login from '../../src/pages/Auth/Login'
import { withLoginLayout } from '../../src/pages/Auth/LoginLayout'

const LoginPage = withLoginLayout(Login)
createRoot(document.getElementById('root')!).render(<AuthContextProvider><LoginPage /></AuthContextProvider>)
