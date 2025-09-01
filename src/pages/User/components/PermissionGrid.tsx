import React from 'react'

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Permission = {
    description: string
    add: boolean
    delete: boolean
    edit: boolean
    view: boolean
}

interface PermissionGridProps {
    handleCheckboxChanged: (model: string, field: 'add' | 'delete' | 'edit' | 'view') => void
    permissions: {
        [key: string]: Permission
    }
}

export const PermissionGrid = ({ handleCheckboxChanged, permissions }: PermissionGridProps): React.ReactElement => {
    const headers = ['Modelo', 'Ver', 'Crear', 'Editar', 'Eliminar']

    const tableHeaders = headers.map((header, index) => {
        const classNames = index === 0 ? 'sm:pl-6 pl-4 pr-3' : 'px-3 text-center'

        return (
            <TableHead key={`th-${index}`} scope="col" className={`py-3.5 text-left text-sm font-semibold text-white ${classNames}`}>
                {header}
            </TableHead>
        )
    })

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-full ">
                <TableHeader className="bg-black">
                    <TableRow>
                        {tableHeaders}
                    </TableRow>
                </TableHeader>

                <TableBody className="bg-white">
                    {Object.entries(permissions).map((permission, index) => (
                        <tr key={permission[0]} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                            <td className="py-3 px-6 text-left">
								{permission[1].description}
							</td>

                            <td className="py-3 px-6 text-center">
                                <input
                                    id={`check-${permission[1].description.toLowerCase()}-view`}
                                    type="checkbox"
                                    checked={permission[1].view}
                                    onChange={() => handleCheckboxChanged(permission[0], 'view')}
                                    className="form-checkbox text-orange-600 h-4 w-4 rounded border-gray-300 focus:ring-orange-600"
                                />
                            </td>

                            <td className="py-3 px-6 text-center">
                                <input
                                    id={`check-${permission[1].description.toLowerCase()}-add`}
                                    type="checkbox"
                                    checked={permission[1].add}
                                    onChange={() => handleCheckboxChanged(permission[0], 'add')}
                                    className="form-checkbox text-orange-600 h-4 w-4 rounded border-gray-300 focus:ring-orange-600"
                                />
                            </td>

                            <td className="py-3 px-6 text-center">
                                <input
                                    id={`check-${permission[1].description.toLowerCase()}-edit`}
                                    type="checkbox"
                                    checked={permission[1].edit}
                                    onChange={() => handleCheckboxChanged(permission[0], 'edit')}
                                    className="form-checkbox text-orange-600 h-4 w-4 rounded border-gray-300 focus:ring-orange-600"
                                />
                            </td>

                            <td className="py-3 px-6 text-center">
                                <input
                                    id={`check-${permission[1].description.toLowerCase()}-delete`}
                                    type="checkbox"
                                    checked={permission[1].delete}
                                    onChange={() => handleCheckboxChanged(permission[0], 'delete')}
                                    className="form-checkbox text-orange-600 h-4 w-4 rounded border-gray-300 focus:ring-orange-600"
                                />
                            </td>                            
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}