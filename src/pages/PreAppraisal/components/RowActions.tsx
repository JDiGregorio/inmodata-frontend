import React from 'react'
import { EyeIcon, SquarePenIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { PreAppraisalStatus } from '@/generated-types'

import { PreAppraisalRow } from './types'

interface RowActionsProps {
    preAppraisal: PreAppraisalRow;
}

export const RowActions = ({ preAppraisal }: RowActionsProps): React.ReactElement => {
    const navigate = useNavigate()

    const actionItems: Array<{ key: string; label: string; icon: React.ReactNode; onClick: () => void }> = [
        {
            key: 'view',
            label: 'Ver',
            icon: <EyeIcon className="h-4 w-4" />,
            onClick: () => navigate(`/preavaluos/${preAppraisal.id}`)
        }
    ]

    if (preAppraisal.status === PreAppraisalStatus.Draft) {
        actionItems.push(
            {
                key: 'edit',
                label: 'Editar',
                icon: <SquarePenIcon className="h-4 w-4" />,
                onClick: () => navigate(`/preavaluos/${preAppraisal.id}/editar`)
            }
        )
    }

    return (
        <div className="inline-flex items-center justify-center gap-1">
            {actionItems.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    onClick={item.onClick}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                    {item.icon}
                    <span className="sr-only">{item.label}</span>
                </button>
            ))}
        </div>
    )
}
