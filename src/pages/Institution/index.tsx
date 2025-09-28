import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import { useListInstitutionsQuery } from '@/generated-types'

const Institutions = (): React.ReactElement => {
	return (
		<InstitutionsListView />
	)
}

const InstitutionsListView = (): React.ReactElement => {
	const permissions = usePermissions()

	const {data, loading, error, refetch} = useListInstitutionsQuery({
		fetchPolicy:'network-only',
		variables: {
			first: 10,
			page: 1
		}
	})

	const handleRefetching = (args: HandleRefetchingProps) => {
		refetch(args)
	}

	const institutions =  data?.institutions.data
	const paginatorInfo = data?.institutions.paginatorInfo
	const parsedColumns = institutions ? institutions.map(institution => [
		institution.id,
		institution.name
	]) : []

	return (
		<SearchableTable
			title={'Instituciones'}
			canCreate={permissions.canCreate("institution")}
			canEdit={permissions.canEdit("institution")}
			headers={['Nombre']}
			loading={loading}
			error={error}
			data={parsedColumns}
			paginatorInfo={paginatorInfo}
			model={defineModel('institucione')}
			refetch={handleRefetching}
		/>
	)
}

export default Institutions