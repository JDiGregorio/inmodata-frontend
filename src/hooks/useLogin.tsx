import { useRef, useState } from 'react'
import axios from 'axios'

import { useAuthContext } from './useAuthContext'
import { toast } from '@/utils/toast'

const BASE_URL = import.meta.env.APP_BASE_URL

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true

export interface Authenticate {
    email: string;
    password: string;
}

export const useLogin = (): {
    authenticate: (args: Authenticate) => Promise<void>
    loading: boolean
} => {
    const [loading, setLoading] = useState(false)
    const pending = useRef(false)

    const { dispatch } = useAuthContext()

    const authenticate = async (credentials: Authenticate) => {
        if (pending.current) return
        pending.current = true
        setLoading(true)
        let stage = 'preparar la sesión'
        const options = { headers: { Accept: 'application/json' } }
        try {
            await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, options)
            stage = 'iniciar sesión'
            await axios.post(`${BASE_URL}/login`, credentials, options)
            stage = 'cargar el perfil'
            const response = await axios.get(`${BASE_URL}/api/user`, options)
            if (!response.data || !['string', 'number'].includes(typeof response.data.id)) {
                toast.error('El servidor no devolvió un perfil válido. Revisa la configuración del servicio de autenticación.')
                return
            }
            const { permissions, roles, ...values } = response.data

            const user = {
                ...values,
                roles: roles,
                permissions: permissions || []
            }

            localStorage.setItem('user', JSON.stringify(user))
            dispatch({ type: 'LOGIN', payload: user })
        } catch (error) {
            const status = axios.isAxiosError(error) ? error.response?.status : undefined
            if (status === 422) {
                toast.warning('No se pudo iniciar sesión. Verifica el correo y la contraseña, o espera unos minutos antes de reintentar.')
            } else if (status === 419) {
                toast.error('No se pudo validar la sesión (HTTP 419). Recarga la página; si persiste, revisa la configuración de cookies y CSRF.')
            } else if (status === 401) {
                toast.error(`La sesión no fue reconocida al ${stage} (HTTP 401).`)
            } else if (status === 429) {
                toast.warning('Demasiados intentos. Espera unos minutos antes de volver a iniciar sesión.')
            } else if (status) {
                toast.error(`No se pudo ${stage} (HTTP ${status}). Contacta al administrador.`)
            } else if (axios.isAxiosError(error)) {
                toast.error(`No se recibió respuesta del servidor al ${stage}. Revisa la conexión y la configuración de acceso al backend.`)
            } else {
                toast.error('No se pudo completar el inicio de sesión en este navegador.')
            }
        } finally {
            pending.current = false
            setLoading(false)
        }
    }
    
    return { authenticate, loading }
}
