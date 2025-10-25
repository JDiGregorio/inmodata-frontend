import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import type { Header } from '@/components/widgets/ListView/ListView.types'
import {
	Institution,
	useListInstitutionsQuery
} from '@/generated-types'

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

	const headers: Header[] = [
		{ key: "name", label: "Nombre", sortable: false, filterable: false, width: "16rem", align: "left"  }
	]

	const institutions =  data?.institutions.data
	const paginatorInfo = data?.institutions.paginatorInfo
	const parsedColumns = institutions ? institutions.map(institution => {
		return {
			values: {
				id: institution.id,
				name: institution.name
			}
		}
	}) : []

	return (
		<SearchableTable<Institution>
			model={defineModel('institucion')}
			title={'Instituciones'}
			canCreate={permissions.canCreate("institution")}
			canEdit={permissions.canEdit("institution")}
			headers={headers}
			data={parsedColumns}
			loading={loading}
			error={error}
			paginatorInfo={paginatorInfo}
			refetch={handleRefetching}
		/>
	)
}

export default Institutions