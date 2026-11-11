import React from 'react'
import { Navigate, useParams } from 'react-router'
import { usePermissions } from '@/hooks/usePermissions'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import { GeneralInformationTab } from './components/tabs/GeneralInformation.edit.tab'
import { ValuationsTab } from './components/tabs/Valuations.edit.tab'
import { PropertyMapLink } from './components/PropertyMapLink'

import {
    Property,
    useGetPropertyByIdQuery
} from '@/generated-types'

const PropertyEdit = (): React.ReactElement => {
    const { id } = useParams()
    const permissions = usePermissions()

    const { data, loading, error, refetch } = useGetPropertyByIdQuery({
        fetchPolicy: 'network-only',
        variables: {
            id: id!, includeValuations: permissions.canView('valuation')
        }
    })

    if (loading) {
        return <Spinner />
    }

    if (!data?.propertyById?.id) {
        return (
            <Page404 />
        )
    }

    if (error) {
        return <>Oops, algo sucedió.</>
    }

    const property = data.propertyById as Property
    if (!property.canEdit && !property.valuations?.some(value => value?.canEdit)) return <Navigate to={`/inmuebles/${property.id}`} replace />

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true,
            content: <GeneralInformationTab property={property} />
        },
        {
            view: permissions.canView('valuation'),
            name: 'Valuaciones',
            hash: '#valuaciones',
            active: true,
            content: <ValuationsTab property={property} refetch={refetch} />
        }
    ]

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <TabsPanel
                    tabs={tabs}
                    actions={<PropertyMapLink property={property} />}
                />
            </div>
        </div>
    )
}

export default PropertyEdit
