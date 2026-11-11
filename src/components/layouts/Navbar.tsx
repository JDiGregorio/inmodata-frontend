import React, { useState } from 'react'
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MenuIcon, ChevronDownIcon, UserPenIcon, LogOutIcon } from 'lucide-react'
import axios from 'axios'

import { Breadcrumbs } from './Breadcrumbs'
import { ProfileDrawer } from '@/pages/User/components/ProfileDrawer'
import { toast } from '@/utils/toast'

import { getInitials } from '@/lib/utils'
import { useAuthContext } from '@/hooks/useAuthContext'
import { PermissionHelpers } from '@/hooks/usePermissions'

const BASE_URL = import.meta.env.APP_BASE_URL

interface NavbarProps {
	permissions: PermissionHelpers
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Navbar = ({ permissions, setSidebarOpen }: NavbarProps): React.ReactElement => {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { user, dispatch } = useAuthContext()

    const handleProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        setDrawerOpen(true)
    }

    const handleLogout = async () => {
        await axios.post(`${BASE_URL}/logout`)
            .then(async () => {
                dispatch({ type: 'LOGOUT', payload: null })
            })
            .catch(() => {
                toast.error('Ocurrió un error al cerrar sesión. Por favor, intenta nuevamente.')
            })
    }

    return (
        <Disclosure as="nav" className="fixed inset-x-0 top-0 z-40 lg:pl-72 bg-white shadow border-b border-gray-200">
            {() => (
                <>
                    <div className="mx-auto max-w-full px-2 sm:px-2 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex space-x-2">
                                <div className="flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:border-b dark:after:border-white/10 dark:after:bg-black/10">
                                    <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden cursor-pointer">
                                        <span className="sr-only">
                                            Open sidebar
                                        </span>
                                        <MenuIcon size={24} aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="hidden lg:flex px-2 lg:px-0">
                                    <Breadcrumbs
                                        permissions={permissions}
                                    />
                                </div>
                            </div>

                            <ProfileDrawer open={drawerOpen} onClose={setDrawerOpen} />

                            <div className="flex items-center space-x-2">
                                <Menu as="div" className="relative">
                                    <MenuButton className=" flex items-center p-1.5 cursor-pointer">
                                        <span className="sr-only">Open user menu</span>

                                        <span className="flex items-center space-x-1">
                                            <span aria-hidden="true" className="hidden lg:block text-md text-gray-700 font-semibold">
                                                {user && user.name}
                                            </span>

                                            <span className="lg:hidden py-1 px-2 items-center rounded-full shadow-2xl text-md text-gray-700 font-semibold">
                                                {user && getInitials(user.name)}
                                            </span>

                                            <ChevronDownIcon aria-hidden="true" className="size-4 text-gray-900/50" />
                                        </span>
                                    </MenuButton>

                                    <MenuItems transition className="absolute right-0 z-[60] mt-4 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                        <MenuItem>
                                            {({ close }) => (
                                                <button
                                                    onClick={(event) => {
                                                        handleProfile(event)
                                                        close()
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 font-medium data-[focus]:bg-gray-100 data-[focus]:text-gray-900 space-x-2"
                                                >
                                                    <UserPenIcon size={18} className="text-gray-400" />
                                                    <span>
														Perfil
													</span>
                                                </button>
                                            )}
                                        </MenuItem>

                                        <MenuItem>
                                            {({ close }) => (
                                                <button
                                                    onClick={() => {
                                                        handleLogout()
                                                        close()
                                                    }}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 font-medium data-[focus]:bg-gray-100 data-[focus]:text-gray-900 space-x-2"
                                                >
                                                    <LogOutIcon size={18} className="text-gray-400" />
                                                    <span>
														Cerrar sesión
													</span>
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}
