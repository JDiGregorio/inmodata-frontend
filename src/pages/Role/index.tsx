import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import { useListRolesQuery } from '@/generated-types'

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

	const roles =  data?.roles.data
	const paginatorInfo = data?.roles.paginatorInfo
	const parsedColumns = roles ? roles.map(role => [
		role.id,
		role.name
	]) : []

	return (
		<SearchableTable
			title={'Roles'}
			canCreate={permissions.canCreate("role")}
			canEdit={permissions.canEdit("role")}
			headers={['Nombre']}
			loading={loading}
			error={error}
			data={parsedColumns}
			paginatorInfo={paginatorInfo}
			model={defineModel('role')}
			refetch={handleRefetching}
		/>
	)
}

export default Roles