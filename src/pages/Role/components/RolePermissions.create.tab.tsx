import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PermissionGrid } from '../../User/components/PermissionGrid'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

import { initialPermissions } from '@/utils/permissions'
import { parsePermissions } from '@/utils/parsePermissions'
import { Permission } from '@/pages/User/components/ExtraPermissions.tab'

import {
    useCreateRoleMutation
} from '@/generated-types'

type InitialPermissions = {
	[key: string]: Permission
}

export const RolePermissionsTab = (): React.ReactElement => {
    const initial = JSON.parse(JSON.stringify(initialPermissions))

	const [name, setName] = useState<string>("")
	const [permissions, setPermissions] = useState<InitialPermissions>(initial)

	const navigate = useNavigate()

    const [ createRole, result ] = useCreateRoleMutation({
        onError: () => {
            toast.error('Error al crear el rol.')
        }
    })

	const handleCheckboxChanged = (model: string, field: 'add' | 'delete' | 'edit' | 'view') => {
        const newPermissions = {...permissions}
        newPermissions[model][field] = !newPermissions[model][field]
    
        setPermissions(newPermissions)
    }

    const handleCreateRole = async () => {
        if (!name || name === "") {
            toast.warning('Necesita agregar el nombre del rol!')
            return
        }

        const permisos = parsePermissions(permissions)

        const result = await createRole({
            variables: {
                input: {
                    name: name,
                    permisos: permisos
                }
            }
        })

        if (result.data) {
            toast.success('Registro creado exitosamente!')

            const newRoleId = result.data.createRole.id

            navigate(`/roles/${newRoleId}/editar`, { 
                replace: true
            })
        }
    }

	return (
		<div className="mx-auto max-w-3xl mt-6 px-4 py-5 rounded-lg bg-white shadow mb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Rol y Permisos
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Crear rol y asignar permisos.
                            </p>
                        </div>

                        <div className="space-y-6">
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

                            <div className="relative">
                                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-start">
                                    <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                                        Asignar Permisos
                                    </span>
                                </div>
                            </div>

                            <PermissionGrid
                                permissions={permissions}
                                handleCheckboxChanged={handleCheckboxChanged} 								
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={()=> {navigate('/roles')}}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={handleCreateRole} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
	)
}