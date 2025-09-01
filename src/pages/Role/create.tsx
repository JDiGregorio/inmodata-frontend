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
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <TabsPanel tabs={tabs}/>
            </div>
        </div>
    )
}

export default RoleCreate