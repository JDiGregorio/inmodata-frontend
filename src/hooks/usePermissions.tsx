import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

export type PermissionHelpers = {
    canView: (resource: string) => boolean;
    canCreate: (resource: string) => boolean;
    canEdit: (resource: string) => boolean;
    canDelete: (resource: string) => boolean;
}

export const usePermissions = (): PermissionHelpers => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return {
            canView: () => false,
            canCreate: () => false,
            canEdit: () => false,
            canDelete: () => false
        }
    }

    const hasPermission = (action: string, resource: string): boolean => {
        const permissionName = `${action}-${resource}`
        return user.permissions.includes(permissionName) || false
    }

    return {
        canView: (resource: string) => hasPermission('view', resource),
        canCreate: (resource: string) => hasPermission('add', resource),
        canEdit: (resource: string) => hasPermission('edit', resource),
        canDelete: (resource: string) => hasPermission('delete', resource)   
    }
}