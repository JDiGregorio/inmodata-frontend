import React from 'react'
import { useLocation, Link } from 'react-router'
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import routes from '@/routes'
import { PermissionHelpers } from '@/hooks/usePermissions'

interface BreadcrumbsProps {
    permissions: PermissionHelpers
}

export const Breadcrumbs = ({ permissions }: BreadcrumbsProps): React.ReactElement | null => {
    const location = useLocation()

    const breadcrumbItems = []
    let currentPath = ""

    const pathSegments = location.pathname.split("/").filter(segment => segment !== "")

    for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`

        const routeMatch = routes(permissions).find(route => {
            const routePath = route.path.replace(":id", pathSegments[1])

            return routePath === currentPath
        })

        if (routeMatch) {
            const name = routeMatch.label

            breadcrumbItems.push({
                name: name,
                path: ["Inicio", "Crear", "Editar"].includes(name) ? null : currentPath
            })
        }
    }

    return pathSegments[0] !== "inicio" ? (
        <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link to="/" className="text-gray-500 hover:text-gray-400">
                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />

                            <span className="sr-only">
                                Home
                            </span>
                        </Link>
                    </div>
                </li>

                {breadcrumbItems.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />

                            {item.path ? (
                                <Link to={item.path} className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-400">
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    {item.name}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    ) : (null)
}