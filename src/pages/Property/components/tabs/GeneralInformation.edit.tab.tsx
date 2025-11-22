import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Cleave from 'cleave.js/react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { InmuebleMapPreview } from '../InmuebleMapPreview'
import { Button } from '@/components/ui/button'
import { AlertConfirm } from '@/components/widgets/Dialog/AlertConfirm'
import { toast } from '@/utils/toast'

import { usePermissions } from '@/hooks/usePermissions'
import { cn, isValidLatitude, isValidLongitude, isValidLatLng, parseNumberOrUndefined } from '@/lib/utils'

import {
    Property,
    useUpdatePropertyMutation,
    useDeletePropertyMutation
} from '@/generated-types'

export const GeneralInformationTab = ({ property }: { property: Property }): React.ReactElement => {
    const [owner, setOwner] = useState<string | null | undefined>(property.owner)
    const [exactAddress, setExactAddress] = useState<string | null | undefined>(property.exactAddress)
    const [cadastralKey, setCadastralKey] = useState<string | null | undefined>(property.cadastralKey)
    const [latitude, setLatitude] = useState<number | undefined>(property.latitude)
    const [longitude, setLongitude] = useState<number | undefined>(property.longitude)

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

    const handleUpdateProperty = async (event: React.MouseEvent<HTMLButtonElement> | undefined) => {
        event?.preventDefault()
        
        if (!latitude || latitude === 0) {
            toast.error('Es necesario agregar la latitud.')
            return
        }

        if (!longitude || longitude === 0) {
            toast.error('Es necesario agregar la longitud.')
            return
        }

        const result = await updateProperty({
            variables: {
                input: {
                    id: property.id,
                    owner: owner,
                    exactAddress: exactAddress,
                    cadastralKey: cadastralKey,
                    latitude: latitude,
                    longitude: longitude
                }
            }
        })

        if (result.data) {
            toast.success('Registro actualizado exitosamente!')
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

    const isValidLat = !isValidLatitude(latitude) && latitude !== undefined
    const isValidLong = !isValidLongitude(longitude) && longitude !== undefined
    const hasPoint = isValidLatLng(latitude, longitude)

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
                                    <Label htmlFor="cadastralKey">
                                        Clave Catastral
                                    </Label>

                                    <Input
                                        type="text"
                                        id="cadastralKey"
                                        name="cadastralKey"
                                        value={cadastralKey || ''}
                                        placeholder="Clave Catastral"
                                        onChange={(e) => setCadastralKey(e.target.value)}
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
                                            onChange={({ target }) => setLatitude(parseNumberOrUndefined(target.value))}
                                        />

                                        {isValidLat && (
                                            <p className="mt-1 text-xs text-red-600">
                                                La latitud debe estar entre -90 y 90.
                                            </p>
                                        )}
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
                                            onChange={({ target }) => setLongitude(parseNumberOrUndefined(target.value))}
                                        />

                                        {isValidLong && (
                                            <p className="mt-1 text-xs text-red-600">
                                                La longitud debe estar entre -180 y 180.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <InmuebleMapPreview
                                latitude={latitude}
                                longitude={longitude}
                                hasPoint={hasPoint}
                                onLatLngChange={(lat, lng) => {
                                    setLatitude(lat)
                                    setLongitude(lng)
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-x-4">
                            {permissions.canDelete("user") && (
                                <Button type="button" variant={'ghost'} size={'default'} className={'w-auto px-4 cursor-pointer hover:bg-red-600 hover:text-white'} onClick={handleDeleteProperty}>
                                    Eliminar
                                </Button>
                            )}

                            <Button type="button" variant={'outline'} size={'default'} className={'w-auto px-4 cursor-pointer'} onClick={()=> {navigate('/inmuebles')}}>
                                Cancelar
                            </Button>

                            <Button type="button" variant={'default'} size={'default'} className={'w-auto px-4 cursor-pointer bg-green-700 hover:bg-green-900'} onClick={handleUpdateProperty} disabled={result.loading}>
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}