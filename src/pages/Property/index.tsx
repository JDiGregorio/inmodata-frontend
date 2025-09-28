import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import {
    RiskAggregates,
    useListPropertiesQuery
} from '@/generated-types'

const Properties = (): React.ReactElement => {
    return (
        <PropertiesListView />
    )
}

export type AggregateOption = {
    id: number
    value: RiskAggregates
    label: string
}

export const risks: AggregateOption[] = [
	{
		id: 1,
		label: 'Muy Alto',
		value: RiskAggregates.VeryHigh
	},
	{
		id: 2,
		label: 'Alto',
		value: RiskAggregates.High
	},
	{
		id: 3,
		label: 'Medio',
		value: RiskAggregates.Medium
	},
	{
		id: 4,
		label: 'Bajo',
		value: RiskAggregates.Low
	},
	{
		id: 5,
		label: 'Muy Bajo',
		value: RiskAggregates.VeryLow
	}
]

const PropertiesListView = (): React.ReactElement => {
    const permissions = usePermissions()

    const {data, loading, error, refetch} = useListPropertiesQuery({
        fetchPolicy:'network-only',
        variables: {
            first: 10,
            page: 1
        }
    })

    const handleRefetching = (args: HandleRefetchingProps) => {
        refetch(args)
    }

    const properties =  data?.properties.data
    const paginatorInfo = data?.properties.paginatorInfo
    const parsedColumns = properties ? properties.map(property => {

        const measuredAt = property.latestValuation?.measuredAt
        const institution = property.latestValuation?.institution?.name

        return [
            property.id,
            property.name,
            institution ?? '-',
            property.latitude.toString(),
            property.longitude.toString(),
            measuredAt ?? '-',
            property.quantity.toString()
        ]
    }) : []

    return (
        <SearchableTable 
            title="Inmuebles"
            canCreate={permissions.canCreate("property")}
            canEdit={permissions.canEdit("property")}
            headers={['Nombre', 'Institución', 'Latitud', 'Longitud', 'Fecha de Valuación', 'Valuaciones']}
            loading={loading}
            error={error}
            data={parsedColumns}
            paginatorInfo={paginatorInfo}
            model={defineModel('inmueble')}
            refetch={handleRefetching}
        />
    )
}

export default Properties