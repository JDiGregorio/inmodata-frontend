import React from 'react'
import { useParams } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import { RolePermissionsTab } from './components/RolePermissions.edit.tab'

import {
    Role,
    useGetRoleByIdQuery
} from '@/generated-types'

const RoleEdit = (): React.ReactElement => {
    const { id } = useParams()

    const { data, loading, error } = useGetRoleByIdQuery({
        fetchPolicy: 'network-only',
        variables: {
            id: id!
        }
    })

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <p role="alert">No se pudo cargar el rol. {error.graphQLErrors[0]?.message}</p>
    }

    if (!data?.roleById?.id) {
        return (
            <Page404 />
        )
    }

    const role = data.roleById as Role

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Rol y Permisos',
            hash: '#rol-permisos',
            active: true, 
            content: <RolePermissionsTab key={role.id} role={role} />
        }
    ]

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <TabsPanel tabs={tabs}/>
            </div>
        </div>
    )
}

export default RoleEdit
