import React from 'react'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import { RolePermissionsTab } from './components/RolePermissions.create.tab'

const RoleCreate = (): React.ReactElement => {
    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Rol y Permisos',
            hash: '#rol-permisos',
            active: true,
            content: <RolePermissionsTab />
        }
    ]

    return (
        <TabsPanel tabs={tabs}/>
    )
}

export default RoleCreate