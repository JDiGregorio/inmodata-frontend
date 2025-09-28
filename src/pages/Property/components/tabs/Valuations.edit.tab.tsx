import React, { useState } from 'react'

import { ValuationModal } from '../ValuationModal'
import { ValuationsTable } from '../ValuationsTable'

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
    institution: null,
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
    const [modalOpen, setModalOpen] = useState(false)
    const [valuation, setValuation] = useState<Valuation>(initialValuation)

    const handleUpdateValuation = (mutation: Partial<Valuation>, view?: string): void => {
        const newData = {
            ...valuation,
            ...mutation,
        }

        setValuation(newData)

        if (view === "edit") {
            setModalOpen(true)
        }
	}

    return (
        <div className="mt-6 px-4 py-5">
            <ValuationModal 
                open={modalOpen}
                title={`${!valuation.id ? 'Agregar' : 'Actualizar'} Valuación`}
                valuation={valuation}
                property={property}
                setModalOpen={setModalOpen}
                handleUpdate={handleUpdateValuation}
                refetch={refetch}
            />
            
            <ValuationsTable
                valuations={property.valuations}
                setModalOpen={setModalOpen}
                handleUpdate={handleUpdateValuation}
            />
        </div>
    )
}
