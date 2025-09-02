import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Cleave from 'cleave.js/react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ComboBox } from '@/components/widgets/ComboBox/ComboBox'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { cn } from '@/lib/utils'

import {
    Property,
    useUpdatePropertyMutation,
    useDeletePropertyMutation
} from '@/generated-types'

import { AggregateOption, risks } from '../index'

export const GeneralInformationTab = ({ property }: { property: Property }): React.ReactElement => {
    const [owner, setOwner] = useState<string | null | undefined>(property.owner)
    const [exactAddress, setExactAddress] = useState<string | null | undefined>(property.exactAddress)
    const [latitude, setLatitude] = useState<number | null>(property.latitude)
    const [longitude, setLongitude] = useState<number | null>(property.longitude)
    const [averageValue, setAverageValue] = useState<number>(property.averageValue)
    const [landArea, setLandArea] = useState<number>(property.landArea)
    const [improvementArea, setImprovementArea] = useState<number>(property.improvementArea)
    const [landValue, setLandValue] = useState<number>(property.landValue)
    // const [utilizationRatio, setUtilizationRatio] = useState<number>(property.utilizationRatio)
    // const [averageSquareYard, setAverageSquareYard] = useState<number>(property.averageSquareYard)
    // const [averageSquareMeter, setAverageSquareMeter] = useState<number>(property.averageSquareMeter)
    const risk = risks.find(risk => risk.value == property.riskProfile)
    const [riskProfile, setRiskProfile] = useState<AggregateOption | null | undefined>(risk)

    const navigate = useNavigate()
    const permissions = usePermissions()
    
    const [updateProperty, result] = useUpdatePropertyMutation({
        onError() {
            toast.error('Lo sentimos, sus cambios no pudieron ser aplicados.')
        }
    })

    const [ deleteProperty ] = useDeletePropertyMutation({
        onError: () => {
            toast.error('Lo sentimos, el registro no pudo ser eliminado.')
        }
    })

    const handleUpdateProperty = async () => {
        if (!latitude || latitude === 0) {
            toast.error('Es necesario agregar la latitud.')
            return
        }

        if (!longitude || longitude === 0) {
            toast.error('Es necesario agregar la longitud.')
            return
        }

        if (!riskProfile) {
            toast.error('Es necesario seleccionar el perfil de riesgo.')
            return
        }

        const result = await updateProperty({
            variables: {
                input: {
                    id: property.id,
                    owner: owner,
                    exactAddress: exactAddress,
                    latitude: latitude,
                    longitude: longitude,
                    averageValue: averageValue,
                    landArea: landArea,
                    improvementArea: improvementArea,
                    landValue: landValue,
                    utilizationRatio: 0,
                    averageSquareYard: 0,
                    averageSquareMeter: 0,
                    riskProfile: riskProfile.value
                }
            }
        })

        if (result.data) {
            toast.success('Registro creado exitosamente!')

            const newUserId = result.data?.updateProperty.id

            navigate(`/inmuebles/${newUserId}/editar`, {
                replace: true
            })
        }
    }

    const handleDeleteProperty = () => {
        AlertConfirm({
            title: `Eliminar Inmueble`,
            description: '¿Está seguro que quiere eliminar este elemento? Esta acción es irreversible.',
            textAccept: 'Eliminar',
            onAccept: async () => {
                const result = await deleteProperty({
                    variables: {
                        id: property.id
                    }
                })
        
                if (result.data) {
                    toast.success('Registro eliminado exitosamente!')

                    navigate('/inmuebles', {
                        replace: true
                    })
                }
            }
        })
    }

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
                                    Editar información general del inmueble.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="owner">
                                        Propietario
                                    </Label>

                                    <Input
                                        type="text"
                                        id="owner"
                                        name="owner"
                                        value={owner || ''}
                                        placeholder="Nombre"
                                        onChange={(e) => setOwner(e.target.value)}
                                        autoComplete="off"
                                        className="placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="exactAddress">
                                        Dirección
                                    </Label>

                                    <Textarea
                                        name="exactAddress"
                                        id="exactAddress"
                                        placeholder="Dirección exacta"
                                        rows={2}
                                        value={exactAddress || ''}
                                        onChange={(e) => setExactAddress(e.target.value)}
                                        className="placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="sm:col-span-6 grid grid-cols-2 gap-x-6 sm:grid-cols-6">
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor="latitude" data-required="*">
                                            Latitud
                                        </Label>

                                        <Cleave
                                            id="latitude"
                                            className={cn(
                                                "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                                "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                                "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                            )}
                                            placeholder="15.7415223"
                                            options={{
                                                numeral: true,
                                                numeralDecimalScale: 7,
                                                numeralDecimalMark: ".",
                                                numeralPositiveOnly: false,
                                                stripLeadingZeroes: true
                                            }}
                                            value={latitude || ''}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)

                                                if (!isNaN(val) && val >= -90 && val <= 90) {
                                                    setLatitude(val)
                                                } else {
                                                    setLatitude(null)
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor="longitude" data-required="*">
                                            Longitud
                                        </Label>

                                        <Cleave
                                            id="longitude"
                                            className={cn(
                                                "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                                "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                                "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                            )}
                                            placeholder="-86.8825891"
                                            options={{
                                                numeral: true,
                                                numeralDecimalScale: 7,
                                                numeralDecimalMark: ".",
                                                numeralPositiveOnly: false,
                                                stripLeadingZeroes: true
                                            }}
                                            value={longitude || ''}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value)
                                                
                                                if (!isNaN(val) && val >= -180 && val <= 180) {
                                                    setLongitude(val)
                                                } else {
                                                    setLongitude(null)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="averageValue" data-required="*">
                                        Valor Estimado del inmueble
                                    </Label>

                                    <Cleave
                                        id="averageValue"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                        )}
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={averageValue || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.rawValue || "0")
                                            setAverageValue(value)
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="landArea" data-required="*">
                                        Area del terreno v2
                                    </Label>

                                    <Cleave
                                        id="landArea"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                        )}
                                        placeholder="0"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            noImmediatePrefix: false,
                                            rawValueTrimPrefix: false
                                        }}
                                        value={landArea || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.rawValue || "0")
                                            setLandArea(value)
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="improvementArea" data-required="*">
                                        Area Techada de Mejoras M2
                                    </Label>

                                    <Cleave
                                        id="improvementArea"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                        )}
                                        placeholder="0"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2
                                        }}
                                        value={improvementArea || ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.rawValue || "0", 10)
                                            setImprovementArea(value)
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="landValue" data-required="*">
                                        Valor solo del Terreno
                                    </Label>

                                    <Cleave
                                        id="landValue"
                                        className={cn(
                                            "file:text-slate-950 placeholder:text-slate-500 selection:bg-slate-900 selection:text-slate-50 dark:bg-slate-200/30 border-slate-200 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-slate-50 dark:placeholder:text-slate-400 dark:selection:bg-slate-50 dark:selection:text-slate-900 dark:dark:bg-slate-800/30 dark:border-slate-800",
                                            "focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50",
                                            "aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900 placeholder:text-gray-300"                                                            
                                        )}
                                        placeholder="0.00"
                                        options={{
                                            numeral: true,
                                            numeralThousandsGroupStyle: 'thousand',
                                            numeralDecimalScale: 2,
                                            numeralDecimalMark: ".",
                                            delimiter: ","
                                        }}
                                        value={landValue || ''}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.rawValue || "0")
                                            setLandValue(value)
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-6 space-y-2">
                                    <Label htmlFor="riskProfile">
                                        Perfil de riesgo
                                    </Label>
                                    
                                    <ComboBox
                                        id="riskProfile"
                                        placeholder={'Selecccione un perfil de riesgo..'}
                                        options={risks}
                                        onChange={(aggregateOption) => setRiskProfile(aggregateOption)}
                                        selectedOption={riskProfile}
                                        displayValue={(aggregateOption) => aggregateOption.label}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-x-6">
                            {permissions.canDelete("user") && (
                                <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteProperty}>
                                    Eliminar
                                </Button>
                            )}

                            <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={()=> {navigate('/inmuebles')}}>
                                Cancelar
                            </Button>

                            <Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 cursor-pointer'} onClick={handleUpdateProperty} disabled={result.loading}>
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}