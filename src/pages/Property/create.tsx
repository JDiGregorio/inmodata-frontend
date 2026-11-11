import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { usePermissions } from '@/hooks/usePermissions'
import { ValuationModal } from './components/ValuationModal'
import { initialValuation, Valuation } from './components/tabs/Valuations.edit.tab'

import TabsPanel, { TabPanel } from '@/components/widgets/TabsPanel/TabsPanel'
import { GeneralInformationTab } from './components/tabs/GeneralInformation.create.tab'

const PropertyCreate = (): React.ReactElement => {
    const navigate = useNavigate()
    const permissions = usePermissions()
    const [created, setCreated] = useState<{ id: string; name?: string | null } | null>(null)
    const [valuation, setValuation] = useState<Valuation>(initialValuation)
    const [modalOpen, setModalOpen] = useState(true)
    const finish = () => navigate(created && permissions.canView('property')
        ? `/inmuebles/${created.id}#valuaciones` : '/inmuebles', { replace: true })
    const onCreated = (property: { id: string; name?: string | null }) => {
        if (permissions.canView('property') && permissions.canEdit('property')) {
            navigate(`/inmuebles/${property.id}/editar`, { replace: true })
        } else if (permissions.canCreate('valuation')) {
            setCreated(property)
        } else {
            navigate(permissions.canView('property') ? `/inmuebles/${property.id}` : '/inmuebles', { replace: true })
        }
    }
    if (created) return <ValuationModal
        open={modalOpen} title="Agregar Valuación" property={created}
        valuation={valuation} canDelete={false}
        setModalOpen={value => { setModalOpen(value); finish() }}
        handleUpdate={patch => setValuation(current => ({ ...current, ...patch }))}
        refetch={finish}
    />
    const tabs: TabPanel[] = [
        {
            view: true,
            name: 'Información General',
            hash: '#informacion-general',
            active: true,
            content: <GeneralInformationTab onCreated={onCreated} />
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

export default PropertyCreate
