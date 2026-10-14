import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

export function useFullSampleTable(): boolean {
    const { user } = useContext(AuthContext)
    return user?.roles.some(role => role.name === 'Administrador') ?? false
}
