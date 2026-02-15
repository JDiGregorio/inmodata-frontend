import React from 'react'
import { useParams } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import Page404 from '../404'
import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import { GeneralInformationTab } from './components/GeneralInformation.edit.tab'

import {
    Institution,
    useGetInstitutionByIdQuery
} from '@/generated-types'

const InstitutionEdit = (): React.ReactElement => {
    const { id } = useParams()

    const { data, loading, error } = useGetInstitutionByIdQuery({
        fetchPolicy: 'network-only',
        variables: {
            id: id!
        }
    })

    if (loading) {
        return <Spinner />
    }

    if (!data?.institutionById?.id) {
        return (
            <Page404 />
        )
    }

    if (error) {
        return <>Oops, algo sucedió.</>
    }

    const institution = data.institutionById as Institution

    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true, 
            content: <GeneralInformationTab institution={institution} />
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

export default InstitutionEdit