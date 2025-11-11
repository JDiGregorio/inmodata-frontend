import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { XCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ComboBox } from '@/components/widgets/ComboBox/ComboBox'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { useDebounce } from '@/utils/useDebounce'
import { buildOptionsFromQueryResult } from '@/components/widgets/ComboBox/ComboBox.utils'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuthContext } from '@/hooks/useAuthContext'

import {
    User,
    Role,
    useListRolesQuery,
    ListRolesQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} from '@/generated-types'

const BASE_URL = import.meta.env.APP_BASE_URL

export const GeneralInformationTab = ({ user }: { user: User }): React.ReactElement => {
    const [name, setName] = useState<string>(user.name)
    const [email, setEmail] = useState<string>(user.email)
    const [password, setPassword] = useState<string | null>(null)
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const _role = user.roles ? user.roles[0] : null
    const [role, setRole] = useState<Role | null>(_role)
    const [passwdHasError, setPasswordHasError] = useState<boolean>(false)
    const [unmatchingPasswords, setUnmatchingPasswords] = useState<boolean>(false)

    const { user: _user, dispatch } = useAuthContext()

    const [searchRoleQuery, setSearchRoleQuery] = useState<string>('')
    const debouncedSearchRoleTerm = useDebounce(searchRoleQuery, 500)
    const { data, loading } = useListRolesQuery({
        fetchPolicy: 'network-only',
        variables: {
            first: 10,
            search: debouncedSearchRoleTerm
        }
    })

    const navigate = useNavigate()
    const permissions = usePermissions()
    
    const [ updateUser, result ] = useUpdateUserMutation({
        onError: (error) => {
            const errors = error.graphQLErrors
            const extensions = errors[0].extensions

            if (extensions!.reason === "412") {
                toast.error(error.message)
            }

            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [ deleteUser ] = useDeleteUserMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleUpdateUser = async () => {
        if (!name || name.length === 0) {
            toast.error('Es necesario agregar el nombre.')
            return
        }

        if (!email || email.length === 0) {
            toast.error('Es necesario agregar el correo electrónico.')
            return
        }

        if ((password && password.length > 0 && confirmPassword.length === 0) || (password && password.length === 0 && confirmPassword.length > 0)) {
            setPasswordHasError(true)
            return
        }

        if (password && password.length !== 0 && confirmPassword.length !== 0) {
            if (!validatePassword()) {
                return
            }
        }

        if (!role) {
            toast.error('Es necesario seleccionar el rol.')
            return
        }

        const result = await updateUser({
            variables: {
                input: {
                    id: user.id,
                    name: name,
                    email: email,
                    password: password && password.length > 0 ? password : null,
                    roles: { connect: role ? [role.id] : [] }
                }
            }
        })

        if (result.data) {
            if (_user && _user.id.toString() === user.id) {
                if (password && password.length > 0) {
                    axios.post(`${BASE_URL}/logout`)
                        .then(async () => {
                            dispatch({ type: 'LOGOUT', payload: null })
                        })
                        .catch(() => {
                            toast.error("Ocurrió un error al cerrar sesión. Por favor, intenta nuevamente.")
                        })
                }
                
                const updateUser = {
                    ..._user,
                    name: name
                }

                localStorage.removeItem('user')
                localStorage.setItem('user', JSON.stringify(updateUser))

                dispatch({ type: 'UPDATE', payload: updateUser })
            }

            toast.success('Registro actualizado exitosamente!')
            
            setPassword('')
            setConfirmPassword('')
        }
    }

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        setUnmatchingPasswords(false)
        setPasswordHasError(false)

        if (password !== confirmPassword) {
            setPasswordHasError(true)
            setUnmatchingPasswords(true)
            return false
        }

        const isValid = passwordRegex.test(password)

        if (!isValid) {
            setPasswordHasError(true)
        }

        return isValid
    }

    const handleDeleteUser = () => {
        AlertConfirm({
            title: `Eliminar Usuario`,
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

                    navigate('/usuarios', {
                        replace: true
                    })
                }
            }
        })
    }

    const roles = useMemo(() => buildOptionsFromQueryResult<ListRolesQuery, Role>(data, 'roles.data'), [data])

    return (
        <div className="mx-auto max-w-3xl mt-6 px-4 py-5 rounded-lg bg-white shadow border mb-10">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                <form className="space-y-12">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">
                                Información General
                            </h2>

                            <p className="text-sm leading-6 text-gray-600">
                                Editar información general del usuario.
                            </p>
                        </div>
                        
            
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6 space-y-2">
                                <Label htmlFor="name">
                                    Nombre
                                </Label>

                                <Input 
                                    type="text"
                                    id="name"
                                    value={name}
                                    placeholder="Nombre"
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    className="placeholder:text-gray-300"
                                />
                            </div>

                            <div className="sm:col-span-6 space-y-2">
                                <Label htmlFor="email" data-required="*">
                                    Correo electrónico
                                </Label>

                                <Input
                                    type="email"
                                    id="email"
                                    value={email || ''}
                                    placeholder="Correo electrónico"
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="off"
                                    className="placeholder:text-gray-300"
                                />
                            </div>

                            <div className="sm:col-span-6 space-y-2">
                                <Label htmlFor="password" data-required="*">
                                    Contraseña
                                </Label>

                                <Input
                                    type="password"
                                    id="password"
                                    value={password || ''}
                                    placeholder="Contraseña"
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="placeholder:text-gray-300"
                                />
                            </div>

                            <div className="sm:col-span-6 space-y-2">
                                <Label htmlFor="confirm-password" data-required="*">
                                    Confirmar contraseña
                                </Label>

                                <Input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    placeholder="Confirmar contraseña"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="placeholder:text-gray-300"
                                />
                            </div>

                            <div className="sm:col-span-6 space-y-2">
                                <Label htmlFor="role" data-required="*">
                                    Rol de usuario
                                </Label>

                                <ComboBox
                                    id="role"
                                    placeholder={'Selecccione un rol..'}
                                    options={roles}
                                    loading={loading}
                                    creatable={false}
                                    onChange={(role) => setRole(role)}
                                    onInputChange={(value) => setSearchRoleQuery(value)}
                                    selectedOption={role}
                                    displayValue={(role) => role.name}
                                />
                            </div>

                            {passwdHasError && (
                                <div className="sm:col-span-4 rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
                                        </div>

                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Por favor verifíque los siguientes requerimientos:
                                            </h3>

                                            <div className="mt-2 text-sm text-red-700">
                                                <ul role="list" className="list-disc space-y-1 pl-5">
                                                    {unmatchingPasswords ? (
                                                        <li>Ambas contraseñas deben coincidir.</li>
                                                    ) : (
                                                        <>
                                                            <li>Su contraseña debe contener al menos 8 carácteres.</li>
                                                            <li>Su contraseña debe contener al menos una letra minúscula.</li>
                                                            <li>Su contraseña debe contener al menos una letra mayúscula.</li>
                                                            <li>Su contraseña debe contener al menos un número.</li>
                                                            <li>Su contraseña debe contener al menos un carácter especial (@$!%*?&).</li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
        
                    <div className="flex items-center justify-end gap-x-4">
                        {permissions.canDelete("user") && (
                            <Button type="button" variant={'ghost'} size={'default'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteUser}>
                                Eliminar
                            </Button>
                        )}

                        <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={()=> {navigate('/usuarios')}}>
                            Cancelar
                        </Button>

                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleUpdateUser} disabled={result.loading}>
                            Guardar
                        </Button>
                    </div>
                </form>
                </div>
            </div>  
        </div>
    )
}