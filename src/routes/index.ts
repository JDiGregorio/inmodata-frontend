import { lazy } from 'react'
import {
    MapIcon,
    MapPinHouseIcon,
    DiscIcon,
    LandmarkIcon,
    UsersIcon,
    ListTodoIcon
} from 'lucide-react'

import { PermissionHelpers } from "@/hooks/usePermissions"

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const PropertiesIndex = lazy(() => import('@/pages/Property'))
const PropertyCreate = lazy(() => import('@/pages/Property/create'))
const PropertyEdit = lazy(() => import('@/pages/Property/edit'))
const PreAppraisalIndex = lazy(() => import('@/pages/PreAppraisal'))
const PreAppraisalCreate = lazy(() => import('@/pages/PreAppraisal/create'))
const PreAppraisalEdit = lazy(() => import('@/pages/PreAppraisal/edit'))
const InstitutionsIndex = lazy(() => import('@/pages/Institution'))
const InstitutionCreate = lazy(() => import('@/pages/Institution/create'))
const InstitutionEdit = lazy(() => import('@/pages/Institution/edit'))
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
            icon: MapIcon,
            name: 'Inicio'
        }
    },
    {
        view: permissions.canView("property"),
        path: '/inmuebles',
        component: PropertiesIndex,
        label: 'Inmuebles',
        sidebar: {
            icon: MapPinHouseIcon,
            name: 'Inmuebles'
        }
    },
    {
        view: permissions.canCreate("property"),
        path: '/inmuebles/crear',
        component: PropertyCreate,
        label: 'Crear'
    },
    {
        view: permissions.canEdit("property"),
        path: '/inmuebles/:id/editar',
        component: PropertyEdit,
        label: 'Editar'
    },
    {
        view: true, // permissions.canView("preappraisal"),
        path: '/preavaluos',
        component: PreAppraisalIndex,
        label: 'Preavaluos',
        sidebar: {
            icon: DiscIcon,
            name: 'Preavaluos'
        }
    },
    {
        view: true, // permissions.canCreate("preappraisal"),
        path: '/preavaluos/crear',
        component: PreAppraisalCreate,
        label: 'Crear'
    },
    {
        view: true, // permissions.canEdit("preappraisal"),
        path: '/preavaluos/:id/editar',
        component: PreAppraisalEdit,
        label: 'Editar'
    },
    {
        view: permissions.canView("institution"),
        path: '/instituciones',
        component: InstitutionsIndex,
        label: 'Instituciones',
        sidebar: {
            icon: LandmarkIcon,
            name: 'Instituciones'
        }
    },
    {
        view: permissions.canCreate("institution"),
        path: '/instituciones/crear',
        component: InstitutionCreate,
        label: 'Crear'
    },
    {
        view: permissions.canEdit("institution"),
        path: '/instituciones/:id/editar',
        component: InstitutionEdit,
        label: 'Editar'
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