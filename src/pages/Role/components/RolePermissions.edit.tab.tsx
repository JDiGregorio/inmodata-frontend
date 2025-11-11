import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PermissionGrid } from '../../User/components/PermissionGrid'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { initialPermissions } from '@/utils/permissions'
import { parsePermissions } from '@/utils/parsePermissions'
import { useAuthContext } from '@/hooks/useAuthContext'

import {
    Role,
    useGetUserByIdLazyQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} from '@/generated-types'

type ActionType = 'description' | 'add' | 'delete' | 'edit' | 'view'

type Permission = {
    description: string;
    add: boolean;
    delete: boolean;
    edit: boolean;
    view: boolean;
}

type InitialPermissions = {
	[key: string]: Permission;
}

type PermissionKey = keyof typeof initialPermissions

export const RolePermissionsTab = ({ role }: { role: Role }): React.ReactElement => {
    const initial = JSON.parse(JSON.stringify(initialPermissions))

	const [name, setName] = useState<string>(role.name)
	const [permissions, setPermissions] = useState<InitialPermissions>(initial)

	const navigate = useNavigate()
	const userPermissions = usePermissions()
    const { user: storeUser, dispatch } = useAuthContext()

    useEffect(() => {
        if (!role.permisos) return;
    
        setPermissions((prevPermissions) => {
            const updatedPermissions = { ...prevPermissions }
    
            const permisosSet = new Set(role.permisos);
    
            (Object.keys(updatedPermissions) as PermissionKey[]).forEach((modelName) => {
                (Object.keys(updatedPermissions[modelName]) as ActionType[]).forEach((key) => {
                    if (key !== 'description') {
                        const permiso = `${key}-${modelName}`;
    
                        updatedPermissions[modelName][key]  = permisosSet.has(permiso)
                    }
                })
            })
    
            return updatedPermissions
        })
    }, [role.permisos])

    const [getUserData] = useGetUserByIdLazyQuery({
        onCompleted: (data) => {
            if (data.userById) {
                if (storeUser && storeUser.roles.some(item => item.id.toString() === role.id)) {
                    const permissions = data.userById?.permisos || []

                    let newPermissions = storeUser.permissions.filter(permission => permissions.includes(permission))
                    newPermissions = [...new Set([...newPermissions, ...permissions])]

                    const payload = { ...storeUser, permissions: newPermissions }

                    localStorage.removeItem('user')
                    localStorage.setItem('user', JSON.stringify(payload))

                    dispatch({ type: 'UPDATE', payload: payload })
                }
            }
        }
    })

    const [ deleteRole ] = useDeleteRoleMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const [ updateRole, result ] = useUpdateRoleMutation({
        onCompleted: () => {
            if (storeUser) {
                getUserData({
                    fetchPolicy: 'network-only',
                    variables: {
                        id: storeUser.id
                    }
                })
            }
        },
        onError: () => {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

	const handleCheckboxChanged = (model: string, field: 'add' | 'delete' | 'edit' | 'view') => {
        const newPermissions = {...permissions}
        newPermissions[model][field] = !newPermissions[model][field]
    
        setPermissions(newPermissions)
    }

    const handleDeleteRole = () => {
        AlertConfirm({
            title: "Eliminar Rol",
            description: '¿Está seguro que quiere eliminar este elemento? Esta acción es irreversible.',
            textAccept: 'Eliminar',
            onAccept: async () => {
                const result = await deleteRole({
                    variables: {
                        id: role.id
                    }
                })
        
                if (result.data) {
                    toast.success('Registro eliminado exitosamente!')
        
                    navigate(`/roles`, {
                        replace: true
                    })
                }
            }
        })
    }

    const handleUpdateRole = async () => {
        if (!name || name === "") {
            toast.warning('Necesita agregar el nombre del rol!')
            return
        }

        const permisos = parsePermissions(permissions)

        const result = await updateRole({
            variables: {
                input: {
                    id: role.id,
                    name: name,
                    permisos: permisos
                }
            }
        })

        if (result.data) {
            toast.success('Registro actualizado exitosamente!')
        }
    }

	return (
		<div className="mx-auto max-w-3xl mt-6 px-4 py-5 rounded-lg bg-white shadow border mb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl space-y-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Rol y Permisos
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Editar rol y permisos asignados.
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

                    <div className="mt-6 flex items-center justify-end gap-x-4">
                        {userPermissions.canDelete("role") && (
                            <Button type="button" variant={'ghost'} size={'default'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteRole}>
                                Eliminar
                            </Button>
                        )}
                        
                        <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={() => navigate('/roles')}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleUpdateRole} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
	)
}