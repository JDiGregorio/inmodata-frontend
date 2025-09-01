import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import { useListUsersQuery } from '@/generated-types'

const Users = (): React.ReactElement => {
    return (
        <UsersListView />
    )
}

const UsersListView = (): React.ReactElement => {
    const permissions = usePermissions()

    const {data, loading, error, refetch} = useListUsersQuery({
        fetchPolicy:'network-only',
        variables: {
            first: 10,
            page: 1
        }
    })

    const handleRefetching = (args: HandleRefetchingProps) => {
        refetch(args)
    }

    const users =  data?.users.data
    const paginatorInfo = data?.users.paginatorInfo
    const parsedColumns = users ? users.map(user => {
        const role = user.roles[0] || { name: '-', authType: '-' }

        return [
            user.id,
            user.name,
            role.name
        ]
    }) : []

    return (
        <SearchableTable 
            title="Usuarios"
            canCreate={permissions.canCreate("user")}
            canEdit={permissions.canEdit("user")}
            headers={['Nombre', 'Rol asignado']}
            loading={loading}
            error={error}
            data={parsedColumns}
            paginatorInfo={paginatorInfo}
            model={defineModel('usuario')}
            refetch={handleRefetching}
        />
    )
}

export default Users