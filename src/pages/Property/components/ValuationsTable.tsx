import React from 'react'
import moment from 'moment'
import { SquarePenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

import { risks } from '../index'

import { Valuation } from './tabs/Valuations.edit.tab'
import { Maybe, PropertyValuation } from '@/generated-types'

interface ValuationsTableProps {
    valuations?: Maybe<Maybe<PropertyValuation>[]> | undefined;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdate: (mutation: Partial<Valuation>, view?: string) => void
}

export const ValuationsTable = ({ valuations, setModalOpen, handleUpdate }: ValuationsTableProps): React.ReactElement => {
    const handleUpdateLine = (valuation: Maybe<PropertyValuation>) => {
        if (valuation) {
            const editValuation = {
                id: valuation.id,
                institution: valuation.institution,
                measuredAt: valuation.measuredAt,
                averageValue: valuation.averageValue,
                landArea: valuation.landArea,
                improvementArea: valuation.improvementArea,
                landValue: valuation.landValue,
                utilizationRatio: valuation.utilizationRatio,
                averageSquareYard: valuation.averageSquareYard,
                averageSquareMeter: valuation.averageSquareMeter,
                riskProfile: risks.find(risk => risk.value === valuation.riskProfile)
            }

            handleUpdate(editValuation, "edit")
        }
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 mb-10">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">
                        Valuaciones
                    </h1>

                    <p className="mt-2 text-sm text-gray-700">
                        Lista de todas las valuaciones relacionadas al inmueble.
                    </p>
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button type="button" variant={'default'} size="sm" onClick={() => setModalOpen(true)} className="cursor-pointer">
                        Añadir
                    </Button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                            <Table className="relative min-w-full divide-y divide-gray-300">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Banco
                                        </TableHead>
                                        <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Fecha de Valuación
                                        </TableHead>
                                        <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Valor en LPS de V&#178;
                                        </TableHead>
                                        <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Valor Promedio en LPS de M&#178;
                                        </TableHead>
                                        <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Perfil de Riesgo
                                        </TableHead>
                                        <TableHead scope="col" className="w-20 relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="divide-y divide-gray-200 bg-white">
                                    {valuations && valuations.length > 0 ? (
                                        valuations.map((valuation, index) => (
                                            <TableRow key={index} className="even:bg-gray-50">
                                                <TableCell className="py-2 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                                                    {valuation?.institution?.name}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 py-4 text-sm whitespace-nowrap text-gray-500">
                                                    {moment(valuation?.measuredAt).format("DD/MM/YYYY")}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                                                    L. {valuation?.averageSquareYard}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                                                    {valuation?.averageSquareMeter}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-sm whitespace-nowrap text-gray-500">
                                                    {risks.find(risk => risk.value === valuation?.riskProfile)?.label}
                                                </TableCell>
                                                <TableCell className="flex justify-center whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6 items-center">
                                                    <Button variant="ghost" onClick={() => handleUpdateLine(valuation)} className="text-orange-600 hover:text-orange-900 cursor-pointer">
                                                        <SquarePenIcon size={16} color="#646464" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow className="even:bg-gray-50">
                                            <TableCell colSpan={6}>
                                                <div className="relative card bg-white dark:bg-gray-700">
                                                    <div className="flex flex-col justify-center items-center px-6 py-8">
                                                        <div className="text-center">
                                                            <p className="text-base text-80 font-normal text-gray-600 dark:text-gray-400">
                                                                No hay datos que mostrar
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="overflow-hidden overflow-x-auto relative"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
