import React from 'react'
import { useParams } from 'react-router'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import { GeneralInformationTab } from './components/GeneralInformation.edit.tab'
import { ExtraPermissionsTab } from './components/ExtraPermissions.tab'

import {
    User,
    useGetUserByIdQuery
} from '@/generated-types'

const UserEdit = (): React.ReactElement => {
    const { id } = useParams()

    const { data, loading, error } = useGetUserByIdQuery({
        fetchPolicy: 'network-only',
        variables: {
            id: id!
        }
    })

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <p role="alert">No se pudo cargar el usuario. {error.graphQLErrors[0]?.message}</p>
    }

    if (!data?.userById?.id) {
        return (
            <Page404 />
        )
    }

    const user = data.userById as User

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true,
            content: <GeneralInformationTab user={user} />
        },
        {
            view: true,
            name: 'Permisos Extra',
            hash: '#permisos-extra',
            active: false, 
            content: <ExtraPermissionsTab user={user} />
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

export default UserEdit
