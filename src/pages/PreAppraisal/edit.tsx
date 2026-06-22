import React, { useEffect, useMemo, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/widgets/Dialog/ConfirmDialog'
import { toast } from '@/utils/toast'
import { useDebounce } from '@/utils/useDebounce'

import {
    PreAppraisalCalculationInput,
    PreAppraisalCreateAction,
    PreAppraisalSectorFilter,
    PreAppraisalStatus,
    RiskAggregates,
    usePreviewPreAppraisalLazyQuery
} from '@/generated-types'

import Page404 from '../404'
import { Badge } from './components/Badge'
import { PreAppraisalConfigurationPanel } from './components/PreAppraisalConfigurationPanel'
import { PreAppraisalCreateMap } from './components/PreAppraisalCreateMap'
import { PreAppraisalPreviewTabs } from './components/PreAppraisalPreviewTabs'
import { PreAppraisalCreateForm, PreAppraisalPreview, PreAppraisalPreviewSample } from './components/createTypes'
import { statusMeta } from './components/constants'
import { DEFAULT_RADIUS_METERS, DEFAULT_TIME_FACTOR, isValidPreviewInput } from './components/createUtils'

const EDIT_GET_PRE_APPRAISAL_BY_ID = gql`
    query EditGetPreAppraisalById($id: ID!) {
        preAppraisalById(id: $id) {
            id
            uuid
            reference
            name
            targetAddress
            targetLatitude
            targetLongitude
            radiusMeters
            sectorFilter
            valuationSelectionMode
            valuationDate
            timeFactor
            candidateCount
            sampleCount
            minAverageSquareYard
            maxAverageSquareYard
            recommendedAverageSquareYard
            expectedRiskScore
            expectedRiskProfile
            annualAppreciationRate
            priceByYear
            riskByYear
            filters
            status
            generatedAt
            createdAt
            samples {
                tag
                propertyId
                propertyValuationId
                institutionId
                propertyName
                exactAddress
                cadastralKey
                latitude
                longitude
                valuationReference
                valuationSector
                averageSquareYard
                averageSquareMeter
                riskProfile
                riskScore
                measuredAt
                distanceMeters
                isWithinRadius
                valuationAgeYears
                timeWeight
                distanceWeight
                factor
                weightedPrice
                weightedRisk
            }
        }
    }
`

const EDIT_UPDATE_PRE_APPRAISAL = gql`
    mutation EditUpdatePreAppraisal($input: UpdatePreAppraisalInput!) {
        updatePreAppraisal(input: $input) {
            id
            uuid
            reference
            name
            targetAddress
            targetLatitude
            targetLongitude
            radiusMeters
            sectorFilter
            valuationDate
            candidateCount
            sampleCount
            recommendedAverageSquareYard
            expectedRiskScore
            expectedRiskProfile
            annualAppreciationRate
            status
            generatedAt
            createdAt
        }
    }
`

type EditPreAppraisalSample = PreAppraisalPreviewSample

type EditPreAppraisal = {
    id: string;
    name?: string | null;
    targetPropertyId?: string | null;
    targetAddress?: string | null;
    targetLatitude: number;
    targetLongitude: number;
    radiusMeters: number;
    sectorFilter: PreAppraisalSectorFilter;
    valuationDate?: string | null;
    timeFactor: number;
    candidateCount: number;
    sampleCount: number;
    minAverageSquareYard?: number | null;
    maxAverageSquareYard?: number | null;
    recommendedAverageSquareYard?: number | null;
    expectedRiskScore?: number | null;
    expectedRiskProfile?: RiskAggregates | null;
    annualAppreciationRate?: number | null;
    priceByYear?: unknown;
    riskByYear?: unknown;
    filters?: Record<string, unknown> | null;
    status: PreAppraisalStatus;
    generatedAt?: string | null;
    createdAt: string;
    samples: EditPreAppraisalSample[];
}

type GetPreAppraisalByIdData = {
    preAppraisalById?: EditPreAppraisal | null;
}

type GetPreAppraisalByIdVariables = {
    id: string;
}

type UpdatePreAppraisalInput = {
    id: string;
    targetPropertyId?: string | null;
    targetAddress?: string | null;
    targetLatitude: number;
    targetLongitude: number;
    radiusMeters: number;
    sectorFilter: PreAppraisalSectorFilter;
    timeFactor?: number;
    includeTargetProperty?: boolean;
    action?: PreAppraisalCreateAction;
}

type UpdatePreAppraisalData = {
    updatePreAppraisal: {
        id: string;
        status: PreAppraisalStatus;
    };
}

type UpdatePreAppraisalVariables = {
    input: UpdatePreAppraisalInput;
}

const initialFormFromPreAppraisal = (preAppraisal: EditPreAppraisal): PreAppraisalCreateForm => ({
    targetAddress: preAppraisal.targetAddress ?? '',
    targetLatitude: Number(preAppraisal.targetLatitude),
    targetLongitude: Number(preAppraisal.targetLongitude),
    targetPropertyId: preAppraisal.targetPropertyId ?? null,
    radiusMeters: String(preAppraisal.radiusMeters ?? DEFAULT_RADIUS_METERS),
    sectorFilter: preAppraisal.sectorFilter
})

const preAppraisalToPreview = (preAppraisal: EditPreAppraisal): PreAppraisalPreview => {
    const filters = preAppraisal.filters ?? {}
    const excludedCount = Number(filters.excluded_without_valid_valuation_count ?? 0)

    return {
        __typename: 'PreAppraisalPreviewPayload',
        targetPropertyId: preAppraisal.targetPropertyId ?? null,
        targetLatitude: Number(preAppraisal.targetLatitude),
        targetLongitude: Number(preAppraisal.targetLongitude),
        radiusMeters: Number(preAppraisal.radiusMeters),
        sectorFilter: preAppraisal.sectorFilter,
        valuationDate: preAppraisal.valuationDate,
        timeFactor: Number(preAppraisal.timeFactor ?? DEFAULT_TIME_FACTOR),
        candidateCount: Number(preAppraisal.candidateCount),
        sampleCount: Number(preAppraisal.sampleCount),
        excludedWithoutValidValuationCount: Number.isFinite(excludedCount) ? excludedCount : 0,
        minAverageSquareYard: preAppraisal.minAverageSquareYard ?? null,
        maxAverageSquareYard: preAppraisal.maxAverageSquareYard ?? null,
        recommendedAverageSquareYard: preAppraisal.recommendedAverageSquareYard ?? null,
        expectedRiskScore: preAppraisal.expectedRiskScore ?? null,
        expectedRiskProfile: preAppraisal.expectedRiskProfile ?? null,
        annualAppreciationRate: preAppraisal.annualAppreciationRate ?? null,
        priceByYear: preAppraisal.priceByYear ?? null,
        riskByYear: preAppraisal.riskByYear ?? null,
        samples: preAppraisal.samples
    } as PreAppraisalPreview
}

const PreAppraisalEditView = (): React.ReactElement => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [form, setForm] = useState<PreAppraisalCreateForm | null>(null)
    const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PreAppraisalCreateForm, string>>>({})
    const [confirmGenerateOpen, setConfirmGenerateOpen] = useState(false)
    const [savingAction, setSavingAction] = useState<PreAppraisalCreateAction | null>(null)
    const [addressAutofillLoading, setAddressAutofillLoading] = useState(false)
    const [formPreAppraisalId, setFormPreAppraisalId] = useState<string | null>(null)

    const { data, loading, error, refetch } = useQuery<GetPreAppraisalByIdData, GetPreAppraisalByIdVariables>(EDIT_GET_PRE_APPRAISAL_BY_ID, {
        fetchPolicy: 'network-only',
        variables: {
            id: id ?? ''
        },
        skip: !id
    })

    const [previewPreAppraisal, previewResult] = usePreviewPreAppraisalLazyQuery({
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true
    })

    const [updatePreAppraisal] = useMutation<UpdatePreAppraisalData, UpdatePreAppraisalVariables>(EDIT_UPDATE_PRE_APPRAISAL, {
        onError: () => {
            toast.error('Lo sentimos, el preavalúo no pudo ser actualizado.')
        }
    })

    const preAppraisal = data?.preAppraisalById

    useEffect(() => {
        if (!preAppraisal || preAppraisal.id === formPreAppraisalId) {
            return
        }

        setForm(initialFormFromPreAppraisal(preAppraisal))
        setFormPreAppraisalId(preAppraisal.id)
    }, [preAppraisal?.id, formPreAppraisalId])

    const previewFingerprint = JSON.stringify({
        targetLatitude: form?.targetLatitude,
        targetLongitude: form?.targetLongitude,
        radiusMeters: form?.radiusMeters,
        sectorFilter: form?.sectorFilter
    })
    const debouncedPreviewFingerprint = useDebounce(previewFingerprint, 650)

    const previewInput = useMemo<PreAppraisalCalculationInput | null>(() => {
        if (!form || !isValidPreviewInput(form.targetLatitude, form.targetLongitude, form.radiusMeters)) {
            return null
        }

        return {
            targetPropertyId: form.targetPropertyId,
            targetAddress: form.targetAddress || null,
            targetLatitude: form.targetLatitude!,
            targetLongitude: form.targetLongitude!,
            radiusMeters: Number(form.radiusMeters),
            sectorFilter: form.sectorFilter as PreAppraisalSectorFilter,
            timeFactor: Number(preAppraisal?.timeFactor ?? DEFAULT_TIME_FACTOR),
            includeTargetProperty: false
        }
    }, [form, preAppraisal?.timeFactor])

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
        setForm((currentForm) => currentForm ? ({
            ...currentForm,
            ...patch
        }) : currentForm)

        setValidationErrors((currentErrors) => {
            const nextErrors = { ...currentErrors }
            Object.keys(patch).forEach((key) => {
                delete nextErrors[key as keyof PreAppraisalCreateForm]
            })

            return nextErrors
        })
    }

    const handlePointChanged = (latitude: number, longitude: number) => {
        handleChange({
            targetLatitude: latitude,
            targetLongitude: longitude,
            targetPropertyId: null
        })
    }

    const handleAutofillAddress = async () => {
        if (!form || form.targetLatitude === null || form.targetLongitude === null) {
            return
        }

        setAddressAutofillLoading(true)

        try {
            const geocoder = new google.maps.Geocoder()
            const result = await geocoder.geocode({
                location: {
                    lat: form.targetLatitude,
                    lng: form.targetLongitude
                }
            })
            const address = result.results?.[0]?.formatted_address

            if (!address) {
                toast.error('No se encontró una dirección para el punto seleccionado.')
                return
            }

            handleChange({ targetAddress: address })
        } catch {
            toast.error('No se pudo autocompletar la dirección.')
        } finally {
            setAddressAutofillLoading(false)
        }
    }

    const validate = (): boolean => {
        if (!form) {
            return false
        }

        const errors: Partial<Record<keyof PreAppraisalCreateForm, string>> = {}

        if (form.targetLatitude === null || form.targetLongitude === null) {
            errors.targetLatitude = 'Selecciona un punto en el mapa para actualizar el preavalúo.'
        }

        if (!form.targetAddress.trim()) {
            errors.targetAddress = 'La dirección es requerida.'
        }

        const radius = Number(form.radiusMeters)
        if (!Number.isFinite(radius) || radius <= 0) {
            errors.radiusMeters = 'El radio debe ser mayor a 0.'
        }

        setValidationErrors(errors)

        return Object.keys(errors).length === 0
    }

    const buildUpdateInput = (action: PreAppraisalCreateAction): UpdatePreAppraisalInput => ({
        id: preAppraisal!.id,
        action,
        targetPropertyId: form!.targetPropertyId,
        targetAddress: form!.targetAddress || null,
        targetLatitude: form!.targetLatitude!,
        targetLongitude: form!.targetLongitude!,
        radiusMeters: Number(form!.radiusMeters),
        sectorFilter: form!.sectorFilter as PreAppraisalSectorFilter,
        timeFactor: Number(preAppraisal?.timeFactor ?? DEFAULT_TIME_FACTOR),
        includeTargetProperty: false
    })

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
        if (!preAppraisal || !form || !validate()) {
            return
        }

        setSavingAction(action)

        try {
            const result = await updatePreAppraisal({
                variables: {
                    input: buildUpdateInput(action)
                }
            })
            const updatedPreAppraisal = result.data?.updatePreAppraisal

            if (updatedPreAppraisal) {
                toast.success(action === PreAppraisalCreateAction.Generate ? 'Reporte generado exitosamente.' : 'Preavalúo actualizado exitosamente.')

                if (action === PreAppraisalCreateAction.Generate) {
                    navigate(`/preavaluos/${updatedPreAppraisal.id}`)
                    return
                }

                await refetch()
            }
        } finally {
            setSavingAction(null)
            setConfirmGenerateOpen(false)
        }
    }

    if (!id) {
        return <Page404 />
    }

    if (loading) {
        return <Spinner />
    }

    if (error || !preAppraisal || preAppraisal.status !== PreAppraisalStatus.Draft) {
        return <Page404 />
    }

    if (!form) {
        return <Spinner />
    }

    const radiusMeters = Number(form.radiusMeters)
    const savedPreview = preAppraisalToPreview(preAppraisal)
    const preview = previewResult.data?.previewPreAppraisal ?? savedPreview
    const previewSamples = preview?.samples ?? []
    const saveDraftLoading = savingAction === PreAppraisalCreateAction.SaveDraft
    const generateLoading = savingAction === PreAppraisalCreateAction.Generate
    const draftStatus = statusMeta[PreAppraisalStatus.Draft]

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
                                Editar Preavalúo
                            </h1>
                            <Badge className={draftStatus.className}>
                                {draftStatus.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                            Actualiza el punto de referencia, radio y sector del borrador.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => navigate('/preavaluos')} disabled={savingAction !== null}>
                        Cancelar
                    </Button>

                    <Button type="button" variant="outline" className="bg-white" onClick={() => handleSave(PreAppraisalCreateAction.SaveDraft)} disabled={savingAction !== null}>
                        {saveDraftLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
                        Guardar cambios
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
                    fitRadiusInView
                    onPointChanged={handlePointChanged}
                />

                <aside className="min-h-0 overflow-hidden border-l border-gray-200 bg-white">
                    <div className="h-full space-y-6 overflow-y-auto p-6">
                        <PreAppraisalConfigurationPanel
                            form={form}
                            readOnlyName={preAppraisal.name}
                            valuationDate={preAppraisal.valuationDate}
                            validationErrors={validationErrors}
                            previewLoading={previewResult.loading}
                            addressAutofillLoading={addressAutofillLoading}
                            onChange={handleChange}
                            onAutofillAddress={handleAutofillAddress}
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

export default PreAppraisalEditView
