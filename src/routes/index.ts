import { lazy } from 'react'
import {
    HomeIcon,
    UsersIcon,
    ListTodoIcon
} from 'lucide-react' // 

import { PermissionHelpers } from "@/hooks/usePermissions"

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const UsersIndex = lazy(() => import('@/pages/User'))
const UserCreate = lazy(() => import('@/pages/User/create'))
const UserEdit = lazy(() => import('@/pages/User/edit'))
const RolesIndex = lazy(() => import('@/pages/Role'))
const RoleCreate = lazy(() => import('@/pages/Role/create'))
const RoleEdit = lazy(() => import('@/pages/Role/edit'))

const routes = (permissions: PermissionHelpers) => [
    {
        view: true,
        path: '/inicio',
        component: Dashboard,
        label: 'Inicio',
        sidebar: {
            icon: HomeIcon,
            name: 'Inicio'
        }
    },
    {
        view: permissions.canView("user"),
        path: '/usuarios',
        component: UsersIndex,
        label: 'Usuarios',
        sidebar: {
            icon: UsersIcon,
            name: 'Usuarios'
        }
    },
    {
        view: permissions.canCreate("user"),
        path: '/usuarios/crear',
        component: UserCreate,
        label: 'Crear'
    },
    {
        view: permissions.canEdit("user"),
        path: '/usuarios/:id/editar',
        component: UserEdit,
        label: 'Editar'
    },
    {
        view: permissions.canView("role"),
        path: '/roles',
        component: RolesIndex,
        label: 'Roles',
        sidebar: {
            icon: ListTodoIcon,
            name: 'Roles'
        }
    },
    {
        view: permissions.canCreate("role"),
        path: '/roles/crear',
        component: RoleCreate,
        label: 'Crear'
    },
    {
        view: permissions.canEdit("role"),
        path: '/roles/:id/editar',
        component: RoleEdit,
        label: 'Editar'
    }
]

export default routes