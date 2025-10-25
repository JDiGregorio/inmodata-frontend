import React from 'react'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'

import { defineModel } from '@/utils/modelUtils'
import { usePermissions } from '@/hooks/usePermissions'

import type { Header } from '@/components/widgets/ListView/ListView.types'
import {
    RiskAggregates,
    Property,
    useListPropertiesQuery,
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

    const headers: Header[] = [
        { key: "name", label: "Nombre", sortable: false, filterable: false, width: 100, align: "center"  },
        { key: "exactAddress", label: "Dirección", sortable: false, filterable: false, width: "16rem", align: "left"  },
        { key: "institution", label: "Institución", sortable: false, filterable: false, width: "7rem", align: "center"  },
        { key: "latitude", label: "Latitud", sortable: false, filterable: false, width: 100, align: "center"  },
        { key: "longitude", label: "Longitud", sortable: false, filterable: false, width: 100, align: "center"  },
        { key: "measuredAt", label: "Fecha de Valuación", sortable: false, filterable: false, width: 120, align: "center"  },
        { key: "quantity", label: "Valuaciones", sortable: false, filterable: false, width: 100, align: "center"  }
    ]

    const properties =  data?.properties.data
    const paginatorInfo = data?.properties.paginatorInfo
    const parsedColumns = properties ? properties.map(property => {

        const measuredAt = property.latestValuation?.measuredAt
        const institution = property.latestValuation?.institution?.name

        return {
            values: {
                id: property.id,
                name: property.name ?? '',
                exactAddress: property.exactAddress ?? '',
                institution: institution ?? '',
                latitude: property.latitude,
                longitude: property.longitude,
                measuredAt: measuredAt ?? '',
                quantity: property.quantity
            }
        }
    }) : []

    return (
        <SearchableTable<Property>
            model={defineModel('inmueble')}
            title="Inmuebles"
            canCreate={permissions.canCreate("property")}
            canEdit={permissions.canEdit("property")}
            headers={headers}
            data={parsedColumns}
            loading={loading}
            error={error}
            paginatorInfo={paginatorInfo}
            refetch={handleRefetching}
        />
    )
}

export default Properties