import React, { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Cleave from 'cleave.js/react'
import { XIcon } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { ComboBox } from '@/components/widgets/ComboBox/ComboBox'
import { DateInput } from '@/components/widgets/DateInput/DateInput'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

import { cn, safeDiv, round6, toDateOnly } from '@/lib/utils'
import { useDebounce } from '@/utils/useDebounce'
import { buildOptionsFromQueryResult } from '@/components/widgets/ComboBox/ComboBox.utils'
import { risks } from '../index'

import { Valuation, initialValuation } from './tabs/Valuations.edit.tab'
import {
    Property,
    Institution,
    useListInstitutionsQuery,
    ListInstitutionsQuery,
    useAddPropertyValuationMutation,
    useUpdatePropertyValuationMutation
} from '@/generated-types'

interface ValuationModalProps {
    open: boolean;
    title: string;
    valuation: Valuation;
    property: Property;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdate: (mutation: Partial<Valuation>, view?: string) => void
    refetch: () => void;
}

const FACTOR_UTILIZATION = 1.43426

export const ValuationModal = ({ open, title, valuation, property, setModalOpen, handleUpdate, refetch }: ValuationModalProps): React.ReactElement => {
    useEffect(() => {
        const nextUtilization = round6(safeDiv((valuation.improvementArea * FACTOR_UTILIZATION), valuation.landArea))

        const nextAvgYard = round6(safeDiv(valuation.landValue, valuation.landArea))

        const nextAvgMeter = round6(safeDiv((valuation.averageValue - valuation.landValue), valuation.improvementArea))

        handleUpdate({
			utilizationRatio: nextUtilization,
            averageSquareYard: nextAvgYard,
            averageSquareMeter: nextAvgMeter
		})

    }, [valuation.improvementArea, valuation.landArea, valuation.averageValue, valuation.landValue])

    const [searchInstitutionQuery, setSearchInstitutionQuery] = useState('')
    const debouncedSearchInstitutionTerm = useDebounce(searchInstitutionQuery, 500)
    const { data, loading } = useListInstitutionsQuery({
        fetchPolicy: 'network-only',
        variables: {
            first: 10,
            search: debouncedSearchInstitutionTerm
        }
    })

    const [addValuation, resultCreate] = useAddPropertyValuationMutation({
        onError() {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [updateValuation, resultUpdate] = useUpdatePropertyValuationMutation({
        onError() {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const handleClose = (value: boolean) => {
        setModalOpen(value)
        handleUpdate(initialValuation)
    }

    const handleAddNewValuation = async () => {
        if (!valuation.institution) {
            toast.error('Es necesario seleccionar la institución.')
            return
        }

        if (!valuation.measuredAt || valuation.measuredAt.length === 0) {
            toast.error('Es necesario seleccionar la fecha de valuación.')
            return
        }

        if (!valuation.averageValue || valuation.averageValue === 0) {
            toast.error('Es necesario agregar el valor estimado del inmueble.')
            return
        }

        if (!valuation.landArea || valuation.landArea === 0) {
            toast.error('Es necesario agregar el área del terreno.')
            return
        }

        if (!valuation.landValue || valuation.landValue === 0) {
            toast.error('Es necesario agregar el valor solo del terreno.')
            return
        }

        if (!valuation.riskProfile) {
            toast.error('Es necesario seleccionar el perfil de riesgo.')
            return
        }

        const formatted = toDateOnly(valuation.measuredAt)

        const _institution = valuation.institution ?  { connect: valuation.institution.id } : { connect: null }

        let result = null

        if (valuation.id === null) {
            result = await addValuation({
                variables: {
                    propertyId: property.id,
                    input: {
                        institution: _institution,
                        measuredAt: formatted,
                        averageValue: valuation.averageValue,
                        landArea: valuation.landArea,
                        improvementArea: valuation.improvementArea,
                        landValue: valuation.landValue,
                        utilizationRatio: valuation.utilizationRatio,
                        averageSquareYard: valuation.averageSquareYard,
                        averageSquareMeter: valuation.averageSquareMeter,
                        riskProfile: valuation.riskProfile.value
                    }
                }
            })
        } else {
            result = await updateValuation({
                variables: {
                    input: {
                        id: valuation.id,
                        institution: _institution,
                        averageValue: valuation.averageValue,
                        landArea: valuation.landArea,
                        improvementArea: valuation.improvementArea,
                        landValue: valuation.landValue,
                        utilizationRatio: valuation.utilizationRatio,
                        averageSquareYard: valuation.averageSquareYard,
                        averageSquareMeter: valuation.averageSquareMeter,
                        riskProfile: valuation.riskProfile.value
                    }
                }
            })
        }

        if (result.data) {
			const type = valuation.id === null ? 'agregado' : 'actualizado'
            toast.success(`Registro ${type} exitosamente!`)

            refetch()

            handleClose(false)
        }
    }

    const institutions = useMemo(() => buildOptionsFromQueryResult<ListInstitutionsQuery, Institution>(data, 'institutions.data'), [data])
    const result = valuation.id === null ? resultCreate : resultUpdate

    return (
        <Dialog open={open} onClose={(value) => handleClose(value)} className="relative">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
                    <div className="px-6 py-2 flex justify-between items-center border-b border-gray-100">
                        <DialogTitle className="text-base font-semibold text-gray-900">
                            {title}
                        </DialogTitle>

                        <Button type="button" onClick={() => handleClose(false)} size="icon" className="py-1 px-2 bg-white shadow-none hover:bg-transparent cursor-pointer">
                            <span className="sr-only">Remove</span>
                            <XIcon size={18} color="#646464" />
                        </Button>
                    </div>

                    <div className="px-8 py-10 space-y-6">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="role" data-required="*">
                                        Institución
                                    </Label>

                                    <ComboBox
                                        id="role"
                                        placeholder={'Selecccione una institución..'}
                                        options={institutions}
                                        loading={loading}
                                        creatable={false}
                                        onChange={(institution) => handleUpdate({ institution: institution })}
                                        onInputChange={(value) => setSearchInstitutionQuery(value)}
                                        selectedOption={valuation.institution}
                                        displayValue={(institution) => institution.name}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="measuredAt" data-required="*">
                                        Fecha de Valuación
                                    </Label>

                                    <DateInput
                                        id="measuredAt"
                                        value={valuation.measuredAt}
                                        placeholder="Seleccione una fecha.."
                                        onChange={(date) => handleUpdate({ measuredAt: date })}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="averageValue" data-required="*">
                                        Valor Estimado del Inmueble
                                    </Label>

                                    <Cleave
                                        id="averageValue"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right"
                                        )}
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={valuation.averageValue || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.rawValue || "0")
                                            handleUpdate({ averageValue: value })
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="landArea" data-required="*">
                                        Área del Terreno V&#178;
                                    </Label>

                                    <Cleave
                                        id="landArea"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right"
                                        )}
                                        placeholder="0"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            noImmediatePrefix: false,
                                            rawValueTrimPrefix: false
                                        }}
                                        value={valuation.landArea || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.rawValue || "0")
                                            handleUpdate({ landArea: value })
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="improvementArea" data-required="*">
                                        Área de Mejoras M&#178;
                                    </Label>

                                    <Cleave
                                        id="improvementArea"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right"
                                        )}
                                        placeholder="0"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2
                                        }}
                                        value={valuation.improvementArea || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.rawValue || "0", 10)
                                            handleUpdate({ improvementArea: value })
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="landValue" data-required="*">
                                        Valor del Terreno
                                    </Label>

                                    <Cleave
                                        id="landValue"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right"
                                        )}
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={valuation.landValue || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.rawValue || "0")
                                            handleUpdate({ landValue: value })
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="utilizationRatio">
                                        Ratio de Utilización
                                    </Label>

                                    <Cleave
                                        id="utilizationRatio"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right disabled:opacity-100"                                                            
                                        )}
                                        disabled
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={valuation.utilizationRatio || ''}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="averageSquareYard">
                                        L/v&#178;
                                    </Label>

                                    <Cleave
                                        id="averageSquareYard"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right disabled:opacity-100"                                                            
                                        )}
                                        disabled
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={valuation.averageSquareYard || ''}
                                    />
                                </div>

                                <div className="sm:col-span-3 space-y-2">
                                    <Label htmlFor="averageSquareMeter">
                                        L/m&#178; Promedio
                                    </Label>

                                    <Cleave
                                        id="averageSquareMeter"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300",
                                            "text-right disabled:opacity-100"                                                            
                                        )}
                                        disabled
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={valuation.averageSquareMeter || ''}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="riskProfile" data-required="*">
                                        Perfil de Riesgo
                                    </Label>
                                    
                                    <ComboBox
                                        id="riskProfile"
                                        placeholder={'Selecccione un perfil de riesgo..'}
                                        options={risks}
                                        onChange={(aggregateOption) => handleUpdate({ riskProfile: aggregateOption })}
                                        selectedOption={valuation.riskProfile}
                                        displayValue={(aggregateOption) => aggregateOption.label}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="px-8 py-4 flex items-center justify-end gap-x-6 border-t border-gray-100">
                        <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={() => handleClose(false)}>
                            Cancelar
                        </Button>

                        <Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={handleAddNewValuation} disabled={result.loading}>
                            {!valuation.id ? "Añadir" : "Actualizar"}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
