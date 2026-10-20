import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, Observable } from '@apollo/client'
import { MemoryRouter } from 'react-router'
import { Toaster } from 'sonner'
import { AuthContext } from '../../src/contexts/AuthContext'
import type { User } from '../../src/contexts/AuthContext.types'
import { RolePermissionsTab as EditRole } from '../../src/pages/Role/components/RolePermissions.edit.tab'
import { RolePermissionsTab as CreateRole } from '../../src/pages/Role/components/RolePermissions.create.tab'
import { ExtraPermissionsTab } from '../../src/pages/User/components/ExtraPermissions.tab'
import { initialPermissions } from '../../src/utils/permissions'

const params = new URLSearchParams(location.search)
const role = { id: '1', name: 'Administrador', permisos: ['view-role', 'edit-role', 'approve-report'] }
const requests: { name: string; variables: any }[] = []
Object.assign(window, { roleTestRequests: requests })
let savedPermissions = role.permisos
const client = new ApolloClient({ cache: new InMemoryCache(), link: new ApolloLink(operation => new Observable(observer => {
    requests.push({ name: operation.operationName, variables: operation.variables })
    const timer = setTimeout(() => {
        if (params.has('catalogError') && operation.operationName === 'PermissionCatalog') {
            observer.error(new Error('Synthetic failure')); return
        }
        if (params.has('denied') && operation.operationName === 'UpdateRole') {
            observer.next({ errors: [{ message: 'No autorizado para administrar este rol.' }] as never }); observer.complete(); return
        }
        let data
        switch (operation.operationName) {
            case 'PermissionCatalog': data = { permissionCatalog: [...Object.keys(initialPermissions).flatMap(module =>
                ['view', 'add', 'edit', 'delete'].map(action => `${action}-${module}`)), 'approve-report', 'view-future-module'] }; break
            case 'UpdateRole': savedPermissions = operation.variables.input.permisos; data = { updateRole: { ...role, permisos: savedPermissions } }; break
            case 'CreateRole': data = { createRole: { id: '2', name: operation.variables.input.name } }; break
            case 'GetUserById': data = { userById: { id: '1', name: 'Admin', email: 'synthetic@example.test',
                roles: [{ id: '1', name: 'Administrador' }], permisos: savedPermissions, permisosExtra: [], institutions: [] } }; break
            case 'UpdateUser': data = { updateUser: { id: '1', name: 'Admin', email: 'synthetic@example.test',
                roles: [role], permisos: operation.variables.input.permisos, permisosExtra: operation.variables.input.permisos, institutions: [] } }; break
            default: observer.error(new Error('Unexpected: ' + operation.operationName)); return
        }
        observer.next({ data }); observer.complete()
    }, 30)
    return () => clearTimeout(timer)
})) })

function Harness() {
    const [user, setUser] = useState<User | null>({ id: '1', name: 'Admin', email: 'synthetic@example.test', roles: [role],
        permissions: params.has('noedit') ? ['view-role'] : ['view-role', 'edit-role', 'add-role', 'edit-user'] })
    return <ApolloProvider client={client}><MemoryRouter><AuthContext.Provider value={{ user, isReady: true,
        dispatch: action => setUser(action.payload) }}>
        {params.has('create') ? <CreateRole /> : params.has('extra')
            ? <ExtraPermissionsTab user={{ id: '1', name: 'Admin', permisosExtra: ['approve-report'] } as never} />
            : <EditRole role={role} />}
        <Toaster />
    </AuthContext.Provider></MemoryRouter></ApolloProvider>
}
createRoot(document.getElementById('root')!).render(<Harness />)
