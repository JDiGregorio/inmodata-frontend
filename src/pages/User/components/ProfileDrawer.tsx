import React, { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

import { DrawerContainer } from '@/components/widgets/Drawer/DrawerContainer'
import { ProfileForm } from './ProfileForm'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

import { useAuthContext } from '@/hooks/useAuthContext'

import { 
    useUpdateUserMutation
} from '@/generated-types'

import { User } from '@/contexts/AuthContext.types'

interface ProfileDrawerProps {
    open: boolean;
    onClose: (isOpen: boolean, shouldRefetch?: boolean) => void;
}

export type Profile = Pick<User, 'id' | 'name'> & {
    password: string;
    confirmPassword: string;
}

const BASE_URL = import.meta.env.APP_BASE_URL

export const ProfileDrawer = ({ open, onClose }: ProfileDrawerProps): React.ReactElement => {
    const [profile, setProfile] = useState<Profile>()
    const [passwdHasError, setPasswordHasError] = useState<boolean>(false)
    const [unmatchingPasswords, setUnmatchingPasswords] = useState<boolean>(false)

    const { user, dispatch } = useAuthContext()

    useEffect(() => {
        if (user) {
            setProfile({
                id: user.id,
                name: user.name,
                password: "",
                confirmPassword: ""
            })
        }
    }, [user])

    const [updateUser, result] = useUpdateUserMutation({
        onError: (error) => {
            const errors = error.graphQLErrors
            const extensions = errors[0].extensions

            if (extensions!.reason === "412") {
                toast.error(error.message)
            }

            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const handleOnClose = () => {
        setProfile({
            id: user ? user.id : "",
            name: user ? user.name : "",
            password: "",
            confirmPassword: ""
        })

        onClose(false)
    }

    const handleUpdateUser = (mutation: Partial<Profile>): void => {
        const newData = {
            ...profile,
            ...mutation
        }

        setProfile(newData as Profile)
    }

    const handleActualizarUsuario = async () => {
        if (!profile) {
            return
        }
        
        if ((profile.password.length > 0 && profile.confirmPassword.length === 0) || (profile.password.length === 0 && profile.confirmPassword.length > 0)) {
            setPasswordHasError(true)
            return
        }

        if (profile.password.length !== 0 && profile.confirmPassword.length !== 0) {
            if (!validatePassword(profile)) {
                return
            }
        }

        const result = await updateUser({
            variables: {
                input: {
                    id: profile.id,
                    name: profile.name,
                    password: profile.password.length > 0 ? profile.password : null
                }
            }
        })

        if (result.data) {
            if (profile.password.length > 0) {
                axios.post(`${BASE_URL}/logout`)
                    .then(async () => {
                        dispatch({ type: 'LOGOUT', payload: null })
                    })
                    .catch(() => {
                        toast.error("Ocurrió un error al cerrar sesión. Por favor, intenta nuevamente.")
                    })
            }
            
            if (user) {
                const updateUser = {
                    ...user,
                    name: profile.name
                }

                localStorage.removeItem('user')
                localStorage.setItem('user', JSON.stringify(updateUser))

                dispatch({ type: 'UPDATE', payload: updateUser })

                setProfile({
                    ...profile,
                    password: "",
                    confirmPassword: ""
                })
            }
            

            toast.success('Registro actualizado exitosamente!')
        }
    }

    const validatePassword = (profile: Profile) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        setUnmatchingPasswords(false)
        setPasswordHasError(false)

        if (profile.password !== profile.confirmPassword) {
            setPasswordHasError(true)
            setUnmatchingPasswords(true)
            return false
        }

        const isValid = passwordRegex.test(profile.password)

        if (!isValid) {
            setPasswordHasError(true)
        }

        return isValid
    }

    if (!profile) {
        return <></>
    }

    return (
        <>
            <Dialog open={open} onClose={() => handleOnClose()} className="relative z-50">
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                            <DialogPanel transition className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
                                <div className="flex h-full flex-col overflow-hidden bg-white shadow-xl">
                                    <div className="py-4 px-6 w-full flex justify-between items-center border-b border-gray-200">
                                        <p className="text-sm text-black font-medium">
                                            Perfil de Usuario
                                        </p>

                                        <Button type="button" variant={'ghost'} onClick={() => handleOnClose()} className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-0 cursor-pointer">
                                            <span className="absolute -inset-2.5" />
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                        </Button>
                                    </div>

                                    <DrawerContainer footer={true} onSubmit={handleActualizarUsuario} onClose={() => handleOnClose()} disabled={result.loading}>
                                        <ProfileForm profile={profile} pwdHasError={passwdHasError} unmatching={unmatchingPasswords} handleUpdateUser={handleUpdateUser} />
                                    </DrawerContainer>
                                </div>
                            </DialogPanel>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}