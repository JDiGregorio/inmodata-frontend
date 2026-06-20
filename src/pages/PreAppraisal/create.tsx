import React, { useEffect, useMemo, useState } from 'react'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/widgets/Dialog/ConfirmDialog'
import { toast } from '@/utils/toast'
import { useDebounce } from '@/utils/useDebounce'

import {
    CreatePreAppraisalInput,
    PreAppraisalCalculationInput,
    PreAppraisalCreateAction,
    PreAppraisalSectorFilter,
    useCreatePreAppraisalMutation,
    usePreviewPreAppraisalLazyQuery
} from '@/generated-types'

import { Badge } from './components/Badge'
import { PreAppraisalConfigurationPanel } from './components/PreAppraisalConfigurationPanel'
import { PreAppraisalCreateMap } from './components/PreAppraisalCreateMap'
import { PreAppraisalPreviewTabs } from './components/PreAppraisalPreviewTabs'
import { PreAppraisalCreateForm } from './components/createTypes'
import { DEFAULT_RADIUS_METERS, DEFAULT_TIME_FACTOR, isValidPreviewInput } from './components/createUtils'

const initialForm: PreAppraisalCreateForm = {
    name: '',
    targetAddress: '',
    targetLatitude: null,
    targetLongitude: null,
    targetPropertyId: null,
    radiusMeters: DEFAULT_RADIUS_METERS,
    sectorFilter: PreAppraisalSectorFilter.Financiero,
    valuationDate: new Date().toISOString().split('T')[0]
}

const PreAppraisalCreateView = (): React.ReactElement => {
    const navigate = useNavigate()
    const [form, setForm] = useState<PreAppraisalCreateForm>(initialForm)
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PreAppraisalCreateForm, string>>>({})
    const [confirmGenerateOpen, setConfirmGenerateOpen] = useState(false)
    const [savingAction, setSavingAction] = useState<PreAppraisalCreateAction | null>(null)

    const previewFingerprint = JSON.stringify({
        targetLatitude: form.targetLatitude,
        targetLongitude: form.targetLongitude,
        radiusMeters: form.radiusMeters,
        sectorFilter: form.sectorFilter,
        valuationDate: form.valuationDate
    })
    const debouncedPreviewFingerprint = useDebounce(previewFingerprint, 650)

    const [previewPreAppraisal, previewResult] = usePreviewPreAppraisalLazyQuery({
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true
    })

    const [createPreAppraisal] = useCreatePreAppraisalMutation({
        onError: () => {
            toast.error('Lo sentimos, el preavalúo no pudo ser guardado.')
        }
    })

    const previewInput = useMemo<PreAppraisalCalculationInput | null>(() => {
        if (!isValidPreviewInput(form.targetLatitude, form.targetLongitude, form.radiusMeters)) {
            return null
        }

        return {
            targetPropertyId: form.targetPropertyId,
            name: form.name || null,
            targetAddress: form.targetAddress || null,
            targetLatitude: form.targetLatitude!,
            targetLongitude: form.targetLongitude!,
            radiusMeters: Number(form.radiusMeters),
            sectorFilter: form.sectorFilter as PreAppraisalSectorFilter,
            valuationDate: form.valuationDate,
            timeFactor: DEFAULT_TIME_FACTOR,
            includeTargetProperty: false
        }
    }, [form])

    useEffect(() => {
        if (!previewInput) {
            return
        }

        void previewPreAppraisal({
            variables: {
                input: previewInput
            }
        })
    }, [debouncedPreviewFingerprint])

    const handleChange = (patch: Partial<PreAppraisalCreateForm>) => {
        setForm((currentForm) => ({
            ...currentForm,
            ...patch
        }))

        setValidationErrors((currentErrors) => {
            const nextErrors = { ...currentErrors }
            Object.keys(patch).forEach((key) => {
                delete nextErrors[key as keyof PreAppraisalCreateForm]
            })

            return nextErrors
        })
    }

    const handlePointChanged = (latitude: number, longitude: number, address?: string) => {
        handleChange({
            targetLatitude: latitude,
            targetLongitude: longitude,
            targetAddress: address ?? form.targetAddress,
            targetPropertyId: null
        })
    }

    const validate = (): boolean => {
        const errors: Partial<Record<keyof PreAppraisalCreateForm, string>> = {}

        if (form.targetLatitude === null || form.targetLongitude === null) {
            errors.targetLatitude = 'Selecciona un punto en el mapa para crear el preavalúo.'
        }

        if (!form.targetAddress.trim()) {
            errors.targetAddress = 'La dirección es requerida.'
        }

        const radius = Number(form.radiusMeters)
        if (!Number.isFinite(radius) || radius <= 0) {
            errors.radiusMeters = 'El radio debe ser mayor a 0.'
        }

        if (!form.valuationDate) {
            errors.valuationDate = 'La fecha de análisis es requerida.'
        }

        setValidationErrors(errors)

        return Object.keys(errors).length === 0
    }

    const buildCreateInput = (action: PreAppraisalCreateAction): CreatePreAppraisalInput => {
        return {
            action,
            targetPropertyId: form.targetPropertyId,
            name: form.name || null,
            targetAddress: form.targetAddress || null,
            targetLatitude: form.targetLatitude!,
            targetLongitude: form.targetLongitude!,
            radiusMeters: Number(form.radiusMeters),
            sectorFilter: form.sectorFilter as PreAppraisalSectorFilter,
            valuationDate: form.valuationDate,
            timeFactor: DEFAULT_TIME_FACTOR,
            includeTargetProperty: false
        }
    }

    const handleRecalculate = () => {
        if (!previewInput) {
            validate()
            return
        }

        void previewPreAppraisal({
            variables: {
                input: previewInput
            }
        })
    }

    const handleSave = async (action: PreAppraisalCreateAction) => {
        if (!validate()) {
            return
        }

        setSavingAction(action)

        try {
            const result = await createPreAppraisal({
                variables: {
                    input: buildCreateInput(action)
                }
            })

            const createdPreAppraisal = result.data?.createPreAppraisal

            if (createdPreAppraisal) {
                toast.success('Preavalúo guardado exitosamente.')
                navigate(`/preavaluos/${createdPreAppraisal.id}`)
            }
        } finally {
            setSavingAction(null)
            setConfirmGenerateOpen(false)
        }
    }

    const radiusMeters = Number(form.radiusMeters)
    const preview = previewResult.data?.previewPreAppraisal
    const previewSamples = preview?.samples ?? []
    const saveDraftLoading = savingAction === PreAppraisalCreateAction.SaveDraft
    const generateLoading = savingAction === PreAppraisalCreateAction.Generate

    return (
        <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col bg-white">
            <div className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-3">
                <div className="flex items-start gap-3">
                    <button type="button" onClick={() => navigate('/preavaluos')} className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold leading-6 text-gray-900">
                                Nuevo Preavalúo
                            </h1>
                            <Badge className="bg-slate-100 text-slate-700 ring-slate-500/10">
                                Draft
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                            Configura el punto de interés y el radio para generar el reporte de vecindad.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => navigate('/preavaluos')} disabled={savingAction !== null}>
                        Cancelar
                    </Button>

                    <Button type="button" variant="outline" className="bg-white" onClick={() => handleSave(PreAppraisalCreateAction.SaveDraft)} disabled={savingAction !== null}>
                        {saveDraftLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                        Guardar Draft
                    </Button>

                    <Button type="button" className="bg-[#155a7c] hover:bg-[#104761]" onClick={() => validate() && setConfirmGenerateOpen(true)} disabled={savingAction !== null}>
                        {generateLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                        Generar Reporte
                    </Button>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_420px]">
                <PreAppraisalCreateMap
                    latitude={form.targetLatitude}
                    longitude={form.targetLongitude}
                    radiusMeters={Number.isFinite(radiusMeters) && radiusMeters > 0 ? radiusMeters : Number(DEFAULT_RADIUS_METERS)}
                    samples={previewSamples}
                    onPointChanged={handlePointChanged}
                />

                <aside className="min-h-0 overflow-hidden border-l border-gray-200 bg-white">
                    <div className="h-full space-y-6 overflow-y-auto p-6">
                        <PreAppraisalConfigurationPanel
                            form={form}
                            validationErrors={validationErrors}
                            previewLoading={previewResult.loading}
                            onChange={handleChange}
                            onRecalculate={handleRecalculate}
                        />

                        <PreAppraisalPreviewTabs
                            preview={preview}
                            previewLoading={previewResult.loading}
                            previewError={previewResult.error?.message}
                        />
                    </div>
                </aside>
            </div>

            <ConfirmDialog
                open={confirmGenerateOpen}
                title="Generar reporte"
                message="Al generar el reporte el preavalúo quedará bloqueado. ¿Deseas continuar?"
                cta="Generar Reporte"
                setOpen={setConfirmGenerateOpen}
                onDeny={() => setConfirmGenerateOpen(false)}
                onConfirm={() => void handleSave(PreAppraisalCreateAction.Generate)}
            />
        </div>
    )
}

export default PreAppraisalCreateView
