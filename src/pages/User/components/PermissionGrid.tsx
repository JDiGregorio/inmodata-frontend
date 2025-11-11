import React from 'react'

import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'

type Permission = {
    description: string;
    add: boolean;
    delete: boolean;
    edit: boolean;
    view: boolean;
}

interface PermissionGridProps {
    handleCheckboxChanged: (model: string, field: 'add' | 'delete' | 'edit' | 'view') => void;
    permissions: { [key: string]: Permission; }
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
            <Table className="min-w-full">
                <TableHeader className="bg-gray-900">
                    <TableRow>
                        {tableHeaders}
                    </TableRow>
                </TableHeader>

                <TableBody className="bg-white border border-gray ">
                    {Object.entries(permissions).map((permission) => (
                        <TableRow key={permission[0]} className="bg-white">
                            <TableCell className="py-3 px-6 text-left text-black font-medium">
								{permission[1].description}
							</TableCell>

                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Checkbox
                                        id={`check-${permission[1].description.toLowerCase()}-view`}
                                        checked={permission[1].view}
                                        onCheckedChange={() => handleCheckboxChanged(permission[0], 'view')}
                                        className="h-4 w-4 p-2 rounded bg-gray-50 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2"
                                    />
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Checkbox
                                        id={`check-${permission[1].description.toLowerCase()}-add`}
                                        checked={permission[1].add}
                                        onCheckedChange={() => handleCheckboxChanged(permission[0], 'add')}
                                        className="h-4 w-4 p-2 rounded bg-gray-50 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2"
                                    />
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Checkbox
                                        id={`check-${permission[1].description.toLowerCase()}-edit`}
                                        checked={permission[1].edit}
                                        onCheckedChange={() => handleCheckboxChanged(permission[0], 'edit')}
                                        className="h-4 w-4 p-2 rounded bg-gray-50 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2"
                                    />
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex justify-center items-center">
                                    <Checkbox
                                        id={`check-${permission[1].description.toLowerCase()}-delete`}
                                        checked={permission[1].delete}
                                        onCheckedChange={() => handleCheckboxChanged(permission[0], 'delete')}
                                        className="h-4 w-4 p-2 rounded bg-gray-50 border-gray-300 cursor-pointer data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700 data-[state=checked]:text-white data-[state=checked]:p-2"
                                    />
                                </div>
                            </TableCell>                           
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}