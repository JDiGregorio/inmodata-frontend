import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { RegisteredPermissionGrid } from './RegisteredPermissionGrid'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { useAuthContext } from '@/hooks/useAuthContext'

import {
    User,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from '@/generated-types'

export type Permission = {
    description: string;
    add: boolean;
    delete: boolean;
    edit: boolean;
    view: boolean;
}
  
export const ExtraPermissionsTab = ({ user }: {user: User}): React.ReactElement => {
    const [permissions, setPermissions] = useState<string[]>(user.permisosExtra ?? [])
    const [catalogReady, setCatalogReady] = useState(false)

    const navigate = useNavigate()
    const userPermissions = usePermissions()
    const { user: storeUser, dispatch } = useAuthContext()

    const { id } = useParams()

    const [ updateUser, result ] = useUpdateUserMutation({
        errorPolicy: 'none',
        onError: (error) => {
            toast.error(error.graphQLErrors[0]?.message ?? 'Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [ deleteUser ] = useDeleteUserMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleUpdateRolePermissions = async () => {
        if (!catalogReady || !userPermissions.canEdit('user')) return
        const permisos = permissions

        const result = await updateUser({
            variables: {
                input: {
                    id: user.id,
                    permisos: permisos
                }
            }
        })

        if (result.data?.updateUser) {
            if (storeUser && storeUser.id.toString() === user.id) {
                const permissions = result.data.updateUser.permisos || []
                const user = { ...storeUser, permissions: permissions }
                
                localStorage.removeItem('user')
                localStorage.setItem('user', JSON.stringify(user))

                dispatch({ type: 'UPDATE', payload: user })
            }

            toast.success('Registro actualizado exitosamente!')
        }

    }

    const handleEliminarUsuario = () => {
        AlertConfirm({
            title: "Eliminar Usuario",
            description: '¿Está seguro que quiere eliminar este elemento? Esta acción es irreversible.',
            textAccept: 'Eliminar',
            onAccept: async () => {
                const result = await deleteUser({
                    variables: {
                        id: user.id
                    }
                })
        
                if (result.data) {
                    toast.success('Registro eliminado exitosamente!')

                    navigate(`/usuarios`, {
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
                                Permisos Extra
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Editar permisos extra asignados al usuario.
                            </p>
                        </div>

                        <div className="relative">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>

                            <div className="relative flex justify-start">
                                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                                    Permisos Extra Asignados
                                </span>
                            </div>
                        </div>

                        <RegisteredPermissionGrid selected={permissions} onChange={setPermissions} onReady={setCatalogReady} />
                    </div>

                    <div className="flex items-center justify-end gap-x-4">
                        {userPermissions.canDelete("user") && (
                            <Button type="button" variant={'ghost'} size={'default'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleEliminarUsuario}>
                                Eliminar
                            </Button>
                        )}
                        
                        <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={() => navigate(`/usuarios/${id}/editar#informacion-general`)}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleUpdateRolePermissions} disabled={result.loading || !catalogReady || !userPermissions.canEdit('user')}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
