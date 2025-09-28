import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PermissionGrid } from './PermissionGrid'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { useAuthContext } from '@/hooks/useAuthContext'
import { initialPermissions } from '@/utils/permissions'
import { parsePermissions } from '@/utils/parsePermissions'

import {
    User,
    useUpdateUserMutation,
    useDeleteUserMutation,
} from '@/generated-types'

export type Permission = {
    description: string
    add: boolean
    delete: boolean
    edit: boolean
    view: boolean
}
  
type InitialPermissions = {
    [key: string]: Permission
}

type ActionType = 'description' | 'add' | 'delete' | 'edit' | 'view'

type PermissionKey = keyof typeof initialPermissions

export const ExtraPermissionsTab = ({ user }: {user: User}): React.ReactElement => {
    const initial = JSON.parse(JSON.stringify(initialPermissions))
    const [permissions, setPermissions] = useState<InitialPermissions>(initial)

    const navigate = useNavigate()
    const userPermissions = usePermissions()
    const { user: storeUser, dispatch } = useAuthContext()

    const { id } = useParams()

    useEffect(() => {
        if (!user.permisosExtra) return;
    
        setPermissions((prevPermissions) => {
            const updatedPermissions = { ...prevPermissions }
    
            const permisosSet = new Set(user.permisosExtra);
    
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
    }, [user.permisosExtra])
    

    const [ updateUser, result ] = useUpdateUserMutation({
        onError: () => {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [ deleteUser ] = useDeleteUserMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleUpdateRolePermissions = async () => {
        const permisos = parsePermissions(permissions)

        const result = await updateUser({
            variables: {
                input: {
                    id: user.id,
                    permisos: permisos
                }
            }
        })

        if (result.data) {
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

    const handleCheckboxChanged = (model: string, field: 'add' | 'delete' | 'edit' | 'view') => {
        const newPermissions = {...permissions}
        newPermissions[model][field] = !newPermissions[model][field]
    
        setPermissions(newPermissions)
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

                        <PermissionGrid
                            handleCheckboxChanged={handleCheckboxChanged}
                            permissions={permissions}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-x-6">
                        {userPermissions.canDelete("user") && (
                            <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleEliminarUsuario}>
                                Eliminar
                            </Button>
                        )}
                        
                        <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={() => navigate(`/usuarios/${id}/editar#informacion-general`)}>
                            Cancelar
                        </Button>
                        
                        <Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={handleUpdateRolePermissions} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}