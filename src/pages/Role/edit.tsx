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

    if (!data?.roleById?.id) {
        return (
            <Page404 />
        )
    }

    if (error) {
        return <>Oops, algo sucedió.</>
    }

    const role = data.roleById as Role

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Rol y Permisos',
            hash: '#rol-permisos',
            active: true, 
            content: <RolePermissionsTab role={role} />
        }
    ]

    return (
        <TabsPanel tabs={tabs}/>
    )
}

export default RoleEdit