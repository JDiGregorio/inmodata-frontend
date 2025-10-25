import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import type { Header } from '@/components/widgets/ListView/ListView.types'
import {
    User,
    useListUsersQuery
} from '@/generated-types'

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

    const headers: Header[] = [
        { key: "name", label: "Nombre", sortable: false, filterable: false, width: "14rem", align: "left"  },
        { key: "role", label: "Rol asignado", sortable: false, filterable: false, width: "9rem", align: "left"  }
    ]

    const users =  data?.users.data
    const paginatorInfo = data?.users.paginatorInfo
    const parsedColumns = users ? users.map(user => {
        const role = user.roles[0] || { name: '-', authType: '-' }

        return {
            values: {
                id: user.id,
                name: user.name,
                role: role.name
            }
        }
    }) : []

    return (
        <SearchableTable<User>
            model={defineModel('usuario')}
            title="Usuarios"
            canCreate={permissions.canCreate("user")}
            canEdit={permissions.canEdit("user")}
            headers={headers}
            data={parsedColumns}
            loading={loading}
            error={error}
            paginatorInfo={paginatorInfo}
            refetch={handleRefetching}
        />
    )
}

export default Users