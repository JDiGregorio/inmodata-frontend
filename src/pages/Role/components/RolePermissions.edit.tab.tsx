import React, { useState } from 'react'
import { useNavigate } from 'react-router'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RegisteredPermissionGrid } from '../../User/components/RegisteredPermissionGrid'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { useAuthContext } from '@/hooks/useAuthContext'

import {
    Role,
    useGetUserByIdLazyQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} from '@/generated-types'

export const RolePermissionsTab = ({ role }: { role: Role }): React.ReactElement => {
	const [name, setName] = useState<string>(role.name)
    const [permissions, setPermissions] = useState<string[]>(role.permisos ?? [])
    const [catalogReady, setCatalogReady] = useState(false)

	const navigate = useNavigate()
	const userPermissions = usePermissions()
    const { user: storeUser, dispatch } = useAuthContext()

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
        errorPolicy: 'none',
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const [ updateRole, result ] = useUpdateRoleMutation({
        errorPolicy: 'none',
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
        onError: (error) => {
            toast.error(error.graphQLErrors[0]?.message ?? 'Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

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

        if (!catalogReady || !userPermissions.canEdit('role')) return
        const permisos = permissions

        const result = await updateRole({
            variables: {
                input: {
                    id: role.id,
                    name: name,
                    permisos: permisos
                }
            }
        })

        if (result.data?.updateRole) {
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

                        <RegisteredPermissionGrid selected={permissions} onChange={setPermissions} onReady={setCatalogReady} />
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
                        
                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleUpdateRole} disabled={result.loading || !catalogReady || !userPermissions.canEdit('role')}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
	)
}
