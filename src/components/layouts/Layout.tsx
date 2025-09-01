import React, { useState, lazy, Suspense } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { XIcon, SquareStackIcon } from 'lucide-react'
import { Routes, Route, NavLink, Navigate } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import { Navbar } from './Navbar'

import { usePermissions } from '@/hooks/usePermissions'

import routes from '@/routes'

import { classNames } from '@/lib/utils'

const Page403 = lazy(() => import('@/pages/403'))
const Page404 = lazy(() => import('@/pages/404'))


const MainLayout = (): React.ReactElement => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const permissions = usePermissions()

    const sidebar = routes(permissions).filter((route) => route.sidebar)

    return (
        <>
            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop transition className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0" />

                    <div className="fixed inset-0 flex">
                        <DialogPanel transition className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full">
                            <TransitionChild>
                                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">
                                            Close sidebar
                                        </span>

                                        <XIcon aria-hidden="true" className="size-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>

                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="py-8 relative flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 bg-gray-900 ring ring-white/10 before:pointer-events-none before:absolute before:inset-0 before:bg-black/10">
                                <nav className="relative flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {sidebar.map((route, index) => route.view && (
                                                    <li key={index}>
                                                        <NavLink to={route.path} onClick={() => setSidebarOpen(false)}>
                                                            {({ isActive }) => {
                                                                const Icon = route.sidebar?.icon || SquareStackIcon

                                                                return (
                                                                    <span className={classNames(isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold')}>
                                                                        <Icon className={classNames(isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'size-6 shrink-0')} aria-hidden="true" />
                                                                        {route.sidebar?.name}
                                                                    </span>
                                                                )
                                                            }}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-gray-900">
                    <div className="py-8 flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 border-white/10 bg-black/10">
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {sidebar.map((route, index) => route.view && (
                                            <li key={index}>
                                                <NavLink to={route.path}>
                                                    {({ isActive }) => {
                                                        const Icon = route.sidebar?.icon || SquareStackIcon

                                                        return (
                                                            <span className={classNames(isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold')}>
                                                                <Icon className={classNames(isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'h-6 w-6 shrink-0')} aria-hidden="true" />
                                                                {route.sidebar?.name}
                                                            </span>
                                                        )
                                                    }}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <main className="h-full flex flex-col min-h-screen lg:pl-72">
                    <Navbar permissions={permissions} setSidebarOpen={setSidebarOpen} />

                    <Suspense fallback={<Spinner />}>
                        <Routes>
                            {routes(permissions).map((route, index) => (
                                <Route key={index} path={route.path} element={route.view ? <route.component /> : <Navigate to="/inicio" />} />
                            ))}

                            <Route path="/403" element={<Page403 />} />
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </>
    )
}

export default MainLayout