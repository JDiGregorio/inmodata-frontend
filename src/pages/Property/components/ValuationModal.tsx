import React, { useState, useEffect, useMemo } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import Cleave from 'cleave.js/react'
import { XIcon } from 'lucide-react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ComboBox } from '@/components/widgets/ComboBox/ComboBox'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DateInput } from '@/components/widgets/DateInput/DateInput'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { cn, safeDiv, round6, toDateOnly, classNames } from '@/lib/utils'
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
    useUpdatePropertyValuationMutation,
    useDeleteValuationMutation
} from '@/generated-types'

interface ValuationModalProps {
    open: boolean;
    title: string;
    valuation: Valuation;
    property: Property;
    canDelete: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdate: (mutation: Partial<Valuation>, view?: string) => void;
    refetch: () => void;
}

const FACTOR_UTILIZATION = 1.43426

export const ValuationModal = ({ open, title, valuation, property, canDelete, setModalOpen, handleUpdate, refetch }: ValuationModalProps): React.ReactElement => {
    useEffect(() => {
        if (valuation.sector === "financiero") {
            const nextUtilization = round6(safeDiv((valuation.improvementArea * FACTOR_UTILIZATION), valuation.landArea))

            const nextAvgYard = round6(safeDiv(valuation.landValue, valuation.landArea))

            const nextAvgMeter = round6(safeDiv((valuation.averageValue - valuation.landValue), valuation.improvementArea))

            handleUpdate({
                utilizationRatio: nextUtilization,
                averageSquareYard: nextAvgYard,
                averageSquareMeter: nextAvgMeter
            })
        }
    }, [valuation.sector, valuation.improvementArea, valuation.landArea, valuation.averageValue, valuation.landValue])

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

    const [ deleteValuation ] = useDeleteValuationMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleClose = (value: boolean) => {
        setModalOpen(value)
        handleUpdate(initialValuation)
    }

    const handleAddNewValuation = async () => {

        if (!valuation.sector) {
            toast.error('Es necesario seleccionar el sector.')
            return
        }

        if (!valuation.measuredAt || valuation.measuredAt.length === 0) {
            toast.error('Es necesario seleccionar la fecha de valuación.')
            return
        }

        if (!valuation.riskProfile) {
            toast.error('Es necesario seleccionar el perfil de riesgo.')
            return
        }

        if (valuation.sector === "financiero") {
            if (!valuation.institution) {
                toast.error('Es necesario seleccionar la institución.')
                return
            }

            if (!valuation.owner) {
                toast.error('Es necesario agregar el propietario.')
                return
            }

            if (!valuation.applicant) {
                toast.error('Es necesario agregar el solicitante.')
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
        }

        if (valuation.sector === "control") {
            if (!valuation.averageSquareYard || valuation.averageSquareYard === 0) {
                toast.error('Es necesario agregar el valor de L/V2.')
                return
            }
        }

        const formatted = toDateOnly(valuation.measuredAt)

        const _institution = valuation.institution ?  { connect: valuation.institution.id } : { connect: null }

        let result = null

        if (valuation.id === null) {
            result = await addValuation({
                variables: {
                    propertyId: property.id,
                    input: {
                        measuredAt: formatted,
                        institution: _institution,
                        owner: valuation.owner,
                        applicant: valuation.applicant,
                        phone: valuation.phone,
                        sector: valuation.sector,
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
                        owner: valuation.owner,
                        applicant: valuation.applicant,
                        phone: valuation.phone,
                        sector: valuation.sector,
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

    const handleDeleteValuation = () => {
        AlertConfirm({
            title: `Eliminar Valuación`,
            description: '¿Está seguro que quiere eliminar este elemento? Esta acción es irreversible.',
            textAccept: 'Eliminar',
            onAccept: async () => {
                const result = await deleteValuation({
                    variables: {
                        id: valuation.id!
                    }
                })

                if (result.data) {
                    toast.success('Registro eliminado exitosamente!')

                    refetch()

                    handleClose(false)
                }
            }
        })
    }

    const institutions = useMemo(() => buildOptionsFromQueryResult<ListInstitutionsQuery, Institution>(data, 'institutions.data'), [data])
    const result = valuation.id === null ? resultCreate : resultUpdate

    return (
        <Dialog open={open} onClose={(value) => handleClose(value)} className="relative z-60">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl h-[90vh] md:h-auto md:max-h-[90vh]">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-2">
                        <DialogTitle className="text-base font-semibold text-gray-900">
                            {title}
                        </DialogTitle>

                        <Button type="button" onClick={() => handleClose(false)} size="icon" className="py-1 px-2 bg-white shadow-none hover:bg-transparent cursor-pointer">
                            <span className="sr-only">Remove</span>
                            <XIcon size={18} color="#646464" />
                        </Button>
                    </div>

                    <ScrollArea className="h-[70vh]">
                        <div className="px-8 py-6">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor="sector" data-required="*">
                                            Sector
                                        </Label>

                                        <Select name="sector" onValueChange={(value) => handleUpdate({ sector: value })} value={valuation.sector || ''}>
                                            <SelectTrigger id="sector" className="w-full focus:ring-0 focus:ring-offset-0">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                    
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="financiero">
                                                        Financiero
                                                    </SelectItem>
                                                    <SelectItem value="control">
                                                        Control
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                                    
                                    {(valuation.sector === null || valuation.sector === "financiero") && (
                                        <>
                                            <div className="sm:col-span-3 space-y-2">
                                                <Label htmlFor="owner">
                                                    Propietario
                                                </Label>

                                                <Input
                                                    type="text"
                                                    id="owner"
                                                    name="owner"
                                                    value={valuation.owner ?? ''}
                                                    placeholder="Propietario"
                                                    onChange={({ target }) => handleUpdate({ owner: target.value })}
                                                    autoComplete="off"
                                                    className="placeholder:text-gray-300"
                                                />
                                            </div>

                                            <div className="sm:col-span-3 space-y-2">
                                                <Label htmlFor="applicant">
                                                    Solicitante
                                                </Label>

                                                <Input
                                                    type="text"
                                                    id="applicant"
                                                    name="applicant"
                                                    value={valuation.applicant ?? ''}
                                                    placeholder="Solicitante"
                                                    onChange={({ target }) => handleUpdate({ applicant: target.value })}
                                                    autoComplete="off"
                                                    className="placeholder:text-gray-300"
                                                />
                                            </div>

                                            <div className="sm:col-span-3 space-y-2">
                                                <Label htmlFor="phone">
                                                    Teléfono
                                                </Label>

                                                <Cleave
                                                    id="phone"
                                                    className={cn(
                                                        "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                                        "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                                        "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                                    )}
                                                    placeholder="9503-1023"
                                                    options={{
                                                        numericOnly: true,
                                                        delimiter: '-',
                                                        blocks: [4, 4],
                                                    }}
                                                    value={valuation.phone ?? ''}
                                                    onChange={({ target }) => handleUpdate({ phone: target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            <div className="sm:col-span-3 space-y-2">
                                                <Label htmlFor="institution" data-required="*">
                                                    Institución
                                                </Label>

                                                <ComboBox
                                                    id="institution"
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
                                                    value={valuation.averageValue ?? ''}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.rawValue || "0")
                                                        handleUpdate({ averageValue: value })
                                                    }}
                                                />
                                            </div>

                                            <div className="sm:col-span-3 space-y-2">
                                                <Label htmlFor="landArea" data-required="*">
                                                    Área del Terreno V&sup2;
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
                                                    value={valuation.landArea ?? ''}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.rawValue || "0")
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
                                                    value={valuation.improvementArea ?? ''}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.rawValue || "0")
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
                                                    value={valuation.landValue ?? ''}
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
                                                    value={valuation.utilizationRatio ?? ''}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className={classNames(valuation.sector === "control" ? "sm:col-span-6" : "sm:col-span-3", "space-y-2")}>
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
                                            disabled={(valuation.sector === null || valuation.sector === "financiero")}
                                            placeholder="0.00"
                                            options={{
                                                numeral: true,
                                                numeralThousandsGroupStyle: 'thousand',
                                                numeralDecimalScale: 2,
                                                numeralDecimalMark: ".",
                                                delimiter: ","
                                            }}
                                            value={valuation.averageSquareYard ?? ''}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.rawValue || "0")
                                                handleUpdate({ averageSquareYard: value })
                                            }}
                                        />
                                    </div>
                                    
                                    {(valuation.sector === null || valuation.sector === "financiero") && (
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
                                                value={valuation.averageSquareMeter ?? ''}
                                            />
                                        </div>
                                    )}

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
                    </ScrollArea>

                    <div className="flex items-center justify-end gap-x-4 border-t border-gray-100 px-8 py-4">
                        {canDelete && valuation.id !== null && (
                            <Button type="button" variant={'ghost'} size={'default'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteValuation}>
                                Eliminar
                            </Button>
                        )}

                        <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={() => handleClose(false)}>
                            Cancelar
                        </Button>

                        <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleAddNewValuation} disabled={result.loading}>
                            {!valuation.id ? "Añadir" : "Actualizar"}
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
