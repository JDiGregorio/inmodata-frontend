import React, { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { ValuationDetailModal } from '../ValuationDetailModal'

import { ValuationModal } from '../ValuationModal'
import { ValuationsTable } from '../ValuationsTable'
import { ValuationHistoryDashboard } from '../ValuationHistoryDashboard'

import { usePermissions } from '@/hooks/usePermissions'

import { AggregateOption } from '../../index'

import {
    Property,
    PropertyValuation
} from '@/generated-types'

interface ValuationsTabProps {
    property: Property;
    refetch: () => void;
}

export type Valuation = Omit<PropertyValuation, 'id' | 'riskProfile'> & {
    id: string | null;
    riskProfile: AggregateOption | null | undefined;
}

export const initialValuation = {
    id: null,
    reference: null,
    institution: null,
    owner: null,
    applicant: null,
    phone: null,
    sector: null,
    measuredAt: undefined,
    averageValue: 0,
    landArea: 0,
    improvementArea: 0,
    landValue: 0,
    utilizationRatio: 0,
    averageSquareYard: 0,
    averageSquareMeter: 0,
    riskProfile: null
}

export const ValuationsTab = ({ property, refetch }: ValuationsTabProps): React.ReactElement => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const requestedValuationId = searchParams.get('valuation')
    const requestedValuation = property.valuations?.find(item => item?.id === requestedValuationId) ?? undefined
    const closeDetail = () => {
        const next = new URLSearchParams(searchParams)
        next.delete('valuation')
        navigate({ pathname: location.pathname, search: next.toString(), hash: '#valuaciones' }, { replace: true })
    }
    const [modalOpen, setModalOpen] = useState(false)
    const [valuation, setValuation] = useState<Valuation>(initialValuation)

    const permissions = usePermissions()

    const handleUpdateValuation = (mutation: Partial<Valuation>, view?: string): void => {
        setValuation((prevValuation) => ({
            ...prevValuation,
            ...mutation
        }))

        if (view === "edit") {
            setModalOpen(true)
        }
	}

    return (
        <div className="mt-6 px-4 py-5">
            <ValuationHistoryDashboard history={property.valuationHistory} />
            {requestedValuationId && <ValuationDetailModal valuation={requestedValuation} onClose={closeDetail} />}
            <ValuationModal 
                open={modalOpen}
                title={`${!valuation.id ? 'Agregar' : 'Actualizar'} Valuación`}
                valuation={valuation}
                property={property}
                canDelete={permissions.canDelete("valuation") && valuation.canDelete === true}
                setModalOpen={setModalOpen}
                handleUpdate={handleUpdateValuation}
                refetch={refetch}
            />
            
            <ValuationsTable
                canCreate={permissions.canCreate("valuation")}
                canEdit={permissions.canEdit("valuation")}
                property={property}
                valuations={property.valuations}
                setModalOpen={setModalOpen}
                handleUpdate={handleUpdateValuation}
            />
        </div>
    )
}
