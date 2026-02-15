import React from 'react'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import { GeneralInformationTab } from './components/GeneralInformation.create.tab'

const InstitutionCreate = (): React.ReactElement => {
    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true,
            content: <GeneralInformationTab />
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

export default InstitutionCreate