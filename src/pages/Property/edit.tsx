import React from 'react'
import { Link, useParams } from 'react-router'
import { MapPinnedIcon } from 'lucide-react'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import { GeneralInformationTab } from './components/tabs/GeneralInformation.edit.tab'
import { ValuationsTab } from './components/tabs/Valuations.edit.tab'
import { buildMapViewFocusHref } from './utils/mapViewLink'

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
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <TabsPanel
                    tabs={tabs}
                    actions={(
                        <Link
                            to={buildMapViewFocusHref({
                                id: property.id,
                                latitude: property.latitude,
                                longitude: property.longitude
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <MapPinnedIcon size={16} />
                            Ver en mapa
                        </Link>
                    )}
                />
            </div>
        </div>
    )
}

export default PropertyEdit
