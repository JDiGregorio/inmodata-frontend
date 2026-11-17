import React, { useRef } from 'react'
import { EyeIcon, SquarePenIcon, TrashIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { PreAppraisalStatus, useDeletePreAppraisalMutation } from '@/generated-types'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { PreAppraisalRow } from './types'

interface RowActionsProps {
    preAppraisal: PreAppraisalRow;
    onDeleted: () => Promise<unknown>;
}

export const RowActions = ({ preAppraisal, onDeleted }: RowActionsProps): React.ReactElement => {
    const navigate = useNavigate()
    const deleting = useRef(false)
    const [deletePreAppraisal, { loading }] = useDeletePreAppraisalMutation()

    const handleDelete = () => AlertConfirm({
        title: 'Eliminar Preavalúo',
        description: `¿Está seguro que quiere eliminar el preavalúo ${preAppraisal.reference || preAppraisal.uuid}, incluso si ya fue generado o tiene un avalúo solicitado? Esta acción no se puede deshacer desde el sistema. Los inmuebles y las valuaciones asociados se conservarán.`,
        textAccept: 'Eliminar',
        onAccept: async () => {
            if (deleting.current) return
            deleting.current = true
            try {
                const result = await deletePreAppraisal({ variables: { id: preAppraisal.id } })
                if (!result.data?.deletePreAppraisal) throw new Error('Delete failed')
                toast.success('Preavalúo eliminado exitosamente!')
                await onDeleted()
            } catch {
                toast.error('No se pudo completar la operación. Actualice el listado y verifique sus permisos.')
            } finally {
                deleting.current = false
            }
        }
    })

    const actionItems: Array<{ key: string; label: string; icon: React.ReactNode; onClick: () => void }> = [
        {
            key: 'view',
            label: 'Ver',
            icon: <EyeIcon className="h-4 w-4" />,
            onClick: () => navigate(`/preavaluos/${preAppraisal.id}`)
        }
    ]

    if (preAppraisal.canDelete) {
        actionItems.push({ key: 'delete', label: 'Eliminar', icon: <TrashIcon className="h-4 w-4" />, onClick: handleDelete })
    }

    if (preAppraisal.canEdit && preAppraisal.status === PreAppraisalStatus.Draft) {
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
                    disabled={item.key === 'delete' && loading}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {item.icon}
                    <span className="sr-only">{item.label}</span>
                </button>
            ))}
        </div>
    )
}
