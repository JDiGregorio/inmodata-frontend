import React from 'react'
import { useParams } from 'react-router'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import { GeneralInformationTab } from './components/GeneralInformation.edit.tab'

import {
    Property,
    useGetPropertyByIdQuery
} from '@/generated-types'

const PropertyEdit = (): React.ReactElement => {
    const { id } = useParams()

    const { data, loading, error } = useGetPropertyByIdQuery({
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
        }
    ]

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <TabsPanel tabs={tabs}/>
            </div>
        </div>
    )
}

export default PropertyEdit