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
        <TabsPanel tabs={tabs}/>
    )
}

export default InstitutionCreate