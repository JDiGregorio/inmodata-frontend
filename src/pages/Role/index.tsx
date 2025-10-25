import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import type { Header } from '@/components/widgets/ListView/ListView.types'
import {
	Role,
	useListRolesQuery
} from '@/generated-types'

const Roles = (): React.ReactElement => {
	return (
		<RolesListView />
	)
}

const RolesListView = (): React.ReactElement => {
	const permissions = usePermissions()

	const {data, loading, error, refetch} = useListRolesQuery({
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
		{ key: "name", label: "Nombre", sortable: false, filterable: false, width: "16rem", align: "left"  }
	]

	const roles =  data?.roles.data
	const paginatorInfo = data?.roles.paginatorInfo
	const parsedColumns = roles ? roles.map(role => {
		return {
			values: {
				id: role.id,
				name: role.name
			}
		}
	}) : []

	return (
		<SearchableTable<Role>
			model={defineModel('rol')}
			title={'Roles'}
			canCreate={permissions.canCreate("role")}
			canEdit={permissions.canEdit("role")}
			headers={headers}
			data={parsedColumns}
			loading={loading}
			error={error}
			paginatorInfo={paginatorInfo}
			refetch={handleRefetching}
		/>
	)
}

export default Roles