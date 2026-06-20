import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, EyeIcon, PrinterIcon, SquarePenIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { PreAppraisalStatus } from '@/generated-types'

import { PreAppraisalRow } from './types'

interface RowActionsProps {
    preAppraisal: PreAppraisalRow;
}

export const RowActions = ({ preAppraisal }: RowActionsProps): React.ReactElement => {
    const navigate = useNavigate()

    const handlePreparedAction = (_action: string, _row: PreAppraisalRow) => {
        return
    }

    const actionItems: Array<{ key: string; label: string; icon?: React.ReactNode; onClick: () => void }> = [
        {
            key: 'view',
            label: 'Ver',
            icon: <EyeIcon className="h-4 w-4 text-gray-500" />,
            onClick: () => navigate(`/preavaluos/${preAppraisal.id}`)
        }
    ]

    if (preAppraisal.status === PreAppraisalStatus.Draft) {
        actionItems.push(
            {
                key: 'edit',
                label: 'Editar',
                icon: <SquarePenIcon className="h-4 w-4 text-gray-500" />,
                onClick: () => navigate(`/preavaluos/${preAppraisal.id}/editar`)
            },
            {
                key: 'generate',
                label: 'Generar',
                onClick: () => handlePreparedAction('generate', preAppraisal)
            },
            {
                key: 'cancel',
                label: 'Cancelar',
                onClick: () => handlePreparedAction('cancel', preAppraisal)
            }
        )
    }

    if (preAppraisal.status === PreAppraisalStatus.Generated) {
        actionItems.push(
            {
                key: 'print',
                label: 'Imprimir',
                icon: <PrinterIcon className="h-4 w-4 text-gray-500" />,
                onClick: () => navigate(`/preavaluos/${preAppraisal.id}/imprimir`)
            },
            {
                key: 'request-formal',
                label: 'Solicitar avalúo',
                onClick: () => handlePreparedAction('request-formal', preAppraisal)
            }
        )
    }

    if (preAppraisal.status === PreAppraisalStatus.FormalRequested) {
        actionItems.push(
            {
                key: 'print',
                label: 'Imprimir',
                icon: <PrinterIcon className="h-4 w-4 text-gray-500" />,
                onClick: () => navigate(`/preavaluos/${preAppraisal.id}/imprimir`)
            },
            {
                key: 'view-request',
                label: 'Ver solicitud',
                onClick: () => navigate(`/preavaluos/${preAppraisal.id}/solicitud`)
            }
        )
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="sr-only">Abrir acciones</span>
                <EllipsisVerticalIcon className="h-4 w-4" />
            </MenuButton>

            <MenuItems transition className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 data-[closed]:scale-95 data-[closed]:opacity-0">
                {actionItems.map((item) => (
                    <MenuItem key={item.key}>
                        {({ close }) => (
                            <button
                                type="button"
                                onClick={() => {
                                    item.onClick()
                                    close()
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        )}
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    )
}
