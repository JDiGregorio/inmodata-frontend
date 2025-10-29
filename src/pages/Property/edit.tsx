import React from 'react'
import { useParams } from 'react-router'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import { GeneralInformationTab } from './components/tabs/GeneralInformation.edit.tab'
import { ValuationsTab } from './components/tabs/Valuations.edit.tab'

import {
    Property,
    useGetPropertyByIdQuery
} from '@/generated-types'

const PropertyEdit = (): React.ReactElement => {
    const { id } = useParams()

    const { data, loading, error, refetch } = useGetPropertyByIdQuery({
        fetchPolicy: 'network-only',
        variables: {
            id: id!
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

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true,
            content: <GeneralInformationTab property={property} />
        },
        {
            view: true,
            name: 'Valuaciones',
            hash: '#valuaciones',
            active: true,
            content: <ValuationsTab property={property} refetch={refetch} />
        }
    ]

    return (
        <TabsPanel tabs={tabs}/>
    )
}

export default PropertyEdit