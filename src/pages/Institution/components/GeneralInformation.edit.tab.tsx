import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'

import {
    Institution,
    useUpdateInstitutionMutation,
    useDeleteInstitutionMutation
} from '@/generated-types'

export const GeneralInformationTab = ({ institution }: { institution: Institution }): React.ReactElement => {
	const [name, setName] = useState<string>(institution.name)

	const navigate = useNavigate()
    const permissions = usePermissions()

    const [ updateInstitution, result ] = useUpdateInstitutionMutation({
        onError: () => {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [ deleteInstitution ] = useDeleteInstitutionMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleUpdateInstitution = async () => {
        if (!name || name === "") {
            toast.warning('Necesita agregar el nombre de la institución!')
            return
        }

        const result = await updateInstitution({
            variables: {
                input: {
                    id: institution.id,
                    name: name
                }
            }
        })

        if (result.data) {
            toast.success('Registro actualizado exitosamente!')
        }
    }

    const handleDeleteInstitution = () => {
        AlertConfirm({
            title: "Eliminar Institución",
            description: '¿Está seguro que quiere eliminar este elemento? Esta acción es irreversible.',
            textAccept: 'Eliminar',
            onAccept: async () => {
                const result = await deleteInstitution({
                    variables: {
                        id: institution.id
                    }
                })
        
                if (result.data) {
                    toast.success('Registro eliminado exitosamente!')
        
                    navigate(`/instituciones`, {
                        replace: true
                    })
                }
            }
        })
    }

	return (
		<div className="mx-auto max-w-3xl mt-6 px-4 py-5 rounded-lg bg-white shadow border mb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Información General
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Editar información general de la institución.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" data-required="*">
                                Nombre
                            </Label>

                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                placeholder="Nombre"
                                onChange={({ target }) => setName(target.value)}
                                autoComplete="off"
                                className="placeholder:text-gray-300"
                            />
                        </div>

                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        {permissions.canDelete("institution") && (
                            <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteInstitution}>
                                Eliminar
                            </Button>
                        )}
                        
                        <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={() => navigate('/instituciones')}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={handleUpdateInstitution} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
	)
}