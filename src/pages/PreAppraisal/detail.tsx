import React, { useMemo, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { ArrowLeftIcon, BanIcon, CopyIcon, DownloadIcon, FileTextIcon, Loader2Icon, Trash2Icon, WandSparklesIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ConfirmDialog } from '@/components/widgets/Dialog/ConfirmDialog'
import { Circle } from '@/pages/Property/components/Circle'
import { PinContent } from '@/pages/Dashboard/components/DashboardMapView/PinContent'
import { getRiskProfileColor } from '@/pages/Dashboard/components/DashboardMapView/riskProfile'
import { toast } from '@/utils/toast'
import markerPrimary from '@/assets/marker9.png'

import { PreAppraisalSectorFilter, PreAppraisalStatus, RiskAggregates, ValuationSector } from '@/generated-types'

import Page404 from '../404'
import { Badge } from './components/Badge'
import { BarChart, LineChart } from './components/SimpleCharts'
import { formatDate, formatExpectedRiskLevel, formatNumber, formatPercent, formatRisk, sectorLabels } from './components/createFormatters'
import { DEFAULT_CENTER } from './components/createUtils'
import { statusMeta } from './components/constants'
import { parseChartPoints } from './components/createUtils'

const GET_PRE_APPRAISAL_DETAIL = gql`
    query GetPreAppraisalDetail($id: ID!) {
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

const GENERATE_PRE_APPRAISAL = gql`
    mutation DetailGeneratePreAppraisal($id: ID!) {
        generatePreAppraisal(id: $id) {
            id
            status
            generatedAt
        }
    }
`

const CANCEL_PRE_APPRAISAL = gql`
    mutation DetailCancelPreAppraisal($id: ID!) {
        cancelPreAppraisal(id: $id) {
            id
            status
        }
    }
`

const DELETE_PRE_APPRAISAL = gql`
    mutation DetailDeletePreAppraisal($id: ID!) {
        deletePreAppraisal(id: $id) {
            id
        }
    }
`

const REQUEST_FORMAL_PRE_APPRAISAL = gql`
    mutation DetailRequestFormalPreAppraisal($id: ID!) {
        requestFormalPreAppraisal(id: $id) {
            id
            status
        }
    }
`

const DUPLICATE_PRE_APPRAISAL = gql`
    mutation DetailDuplicatePreAppraisal($id: ID!) {
        duplicatePreAppraisal(id: $id) {
            id
            status
        }
    }
`

const DOWNLOAD_PRE_APPRAISAL_PDF = gql`
    mutation DetailDownloadPreAppraisalPdf($id: ID!) {
        downloadPreAppraisalPdf(id: $id) {
            filename
            mimeType
            contentBase64
        }
    }
`

type DetailSample = {
    tag?: string | null;
    propertyId?: string | null;
    propertyValuationId?: string | null;
    propertyName?: string | null;
    exactAddress?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    valuationSector?: ValuationSector | null;
    averageSquareYard?: number | null;
    riskProfile?: RiskAggregates | null;
    riskScore?: number | null;
    measuredAt?: string | null;
    distanceMeters?: number | null;
    isWithinRadius: boolean;
    valuationAgeYears?: number | null;
    timeWeight?: number | null;
    distanceWeight?: number | null;
    factor?: number | null;
    weightedPrice?: number | null;
    weightedRisk?: number | null;
}

type DetailPreAppraisal = {
    id: string;
    uuid: string;
    reference?: string | null;
    name?: string | null;
    targetAddress?: string | null;
    targetLatitude: number;
    targetLongitude: number;
    radiusMeters: number;
    sectorFilter: PreAppraisalSectorFilter;
    valuationDate?: string | null;
    timeFactor: number;
    sampleCount: number;
    minAverageSquareYard?: number | null;
    maxAverageSquareYard?: number | null;
    recommendedAverageSquareYard?: number | null;
    expectedRiskScore?: number | null;
    expectedRiskProfile?: RiskAggregates | null;
    annualAppreciationRate?: number | null;
    priceByYear?: unknown;
    riskByYear?: unknown;
    filters?: Record<string, unknown> | string | null;
    status: PreAppraisalStatus;
    generatedAt?: string | null;
    createdAt: string;
    samples: DetailSample[];
}

type DetailData = {
    preAppraisalById?: DetailPreAppraisal | null;
}

type DetailVariables = {
    id: string;
}

type MutationData = {
    generatePreAppraisal?: { id: string; status: PreAppraisalStatus };
    cancelPreAppraisal?: { id: string; status: PreAppraisalStatus };
    deletePreAppraisal?: { id: string };
    requestFormalPreAppraisal?: { id: string; status: PreAppraisalStatus };
    duplicatePreAppraisal?: { id: string; status: PreAppraisalStatus };
    downloadPreAppraisalPdf?: {
        filename: string;
        mimeType: string;
        contentBase64: string;
    };
}

type MutationVariables = {
    id: string;
}

type ConfirmAction = 'generate' | 'cancel' | 'delete' | 'request-formal' | null
type DetailTab = 'summary' | 'samples'

const MAP_ID = '7e4a3d97341b511756649b5f'
const RADIUS_VIEW_PADDING = 16

const tabClassName = (active: boolean) => active
    ? 'border-[#155a7c] text-[#155a7c]'
    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'

const PreAppraisalDetailView = (): React.ReactElement => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
    const [runningAction, setRunningAction] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<DetailTab>('summary')

    const { data, loading, error, refetch } = useQuery<DetailData, DetailVariables>(GET_PRE_APPRAISAL_DETAIL, {
        fetchPolicy: 'network-only',
        variables: {
            id: id ?? ''
        },
        skip: !id
    })

    const [generatePreAppraisal] = useMutation<MutationData, MutationVariables>(GENERATE_PRE_APPRAISAL)
    const [cancelPreAppraisal] = useMutation<MutationData, MutationVariables>(CANCEL_PRE_APPRAISAL)
    const [deletePreAppraisal] = useMutation<MutationData, MutationVariables>(DELETE_PRE_APPRAISAL)
    const [requestFormalPreAppraisal] = useMutation<MutationData, MutationVariables>(REQUEST_FORMAL_PRE_APPRAISAL)
    const [duplicatePreAppraisal] = useMutation<MutationData, MutationVariables>(DUPLICATE_PRE_APPRAISAL)
    const [downloadPreAppraisalPdf] = useMutation<MutationData, MutationVariables>(DOWNLOAD_PRE_APPRAISAL_PDF)

    const preAppraisal = data?.preAppraisalById
    const priceChartData = useMemo(() => parseChartPoints(preAppraisal?.priceByYear, 'averagePrice'), [preAppraisal?.priceByYear])
    const riskChartData = useMemo(() => parseChartPoints(preAppraisal?.riskByYear, 'averageRiskScore'), [preAppraisal?.riskByYear])

    if (!id) {
        return <Page404 />
    }

    if (loading) {
        return <Spinner />
    }

    if (error || !preAppraisal) {
        return <Page404 />
    }

    const status = statusMeta[preAppraisal.status]
    const reportReference = preAppraisal.reference || preAppraisal.name || preAppraisal.uuid
    const isDraft = preAppraisal.status === PreAppraisalStatus.Draft
    const isGenerated = preAppraisal.status === PreAppraisalStatus.Generated
    const canDownloadAndReevaluate = isGenerated || preAppraisal.status === PreAppraisalStatus.FormalRequested

    const runAction = async (action: Exclude<ConfirmAction, null>) => {
        setRunningAction(action)

        try {
            if (action === 'generate') {
                await generatePreAppraisal({ variables: { id: preAppraisal.id } })
                toast.success('Reporte generado exitosamente.')
                await refetch()
            }

            if (action === 'cancel') {
                await cancelPreAppraisal({ variables: { id: preAppraisal.id } })
                toast.success('Preavalúo cancelado exitosamente.')
                await refetch()
            }

            if (action === 'delete') {
                await deletePreAppraisal({ variables: { id: preAppraisal.id } })
                toast.success('Preavalúo eliminado exitosamente.')
                navigate('/preavaluos')
            }

            if (action === 'request-formal') {
                await requestFormalPreAppraisal({ variables: { id: preAppraisal.id } })
                toast.success('Solicitud de avalúo formal creada exitosamente.')
                await refetch()
            }
        } catch {
            toast.error('No se pudo completar la acción solicitada.')
        } finally {
            setRunningAction(null)
            setConfirmAction(null)
        }
    }

    const handleDuplicate = async () => {
        setRunningAction('duplicate')

        try {
            const result = await duplicatePreAppraisal({ variables: { id: preAppraisal.id } })
            const duplicatedId = result.data?.duplicatePreAppraisal?.id

            if (duplicatedId) {
                toast.success('Preavalúo duplicado exitosamente.')
                navigate(`/preavaluos/${duplicatedId}/editar`)
            }
        } catch {
            toast.error('No se pudo reevaluar el preavalúo.')
        } finally {
            setRunningAction(null)
        }
    }

    const handleDownloadPdf = async () => {
        setRunningAction('download-pdf')

        try {
            const result = await downloadPreAppraisalPdf({ variables: { id: preAppraisal.id } })
            const download = result.data?.downloadPreAppraisalPdf

            if (!download) {
                toast.error('No se pudo realizar la descarga del preavalúo.')
                return
            }

            downloadBase64File(download.contentBase64, download.mimeType, download.filename)
            toast.success('Descarga realizada exitosamente.')
        } catch {
            toast.error('No se pudo descargar el preavalúo.')
        } finally {
            setRunningAction(null)
        }
    }

    const confirmCopy = getConfirmCopy(confirmAction)

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-slate-100">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate('/preavaluos')} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
                        <ArrowLeftIcon className="h-4 w-4" />
                    </button>

                    <h1 className="text-lg font-semibold text-gray-900">
                        Reporte de Vecindad
                    </h1>

                    <Badge className={status.className}>
                        {status.label}
                    </Badge>

                    <span className="h-5 w-px bg-gray-200" />
                    <span className="text-sm font-medium text-slate-500">
                        {reportReference}
                    </span>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                    {isDraft && (
                        <>
                            <Button type="button" variant="outline" className="bg-white text-red-700 hover:text-red-800" onClick={() => setConfirmAction('delete')} disabled={runningAction !== null}>
                                <Trash2Icon className="h-4 w-4" />
                                Eliminar
                            </Button>

                            <Button type="button" variant="outline" className="bg-white" onClick={() => setConfirmAction('cancel')} disabled={runningAction !== null}>
                                <BanIcon className="h-4 w-4" />
                                Cancelar
                            </Button>

                            <Button type="button" className="bg-[#155a7c] hover:bg-[#104761]" onClick={() => setConfirmAction('generate')} disabled={runningAction !== null}>
                                <WandSparklesIcon className="h-4 w-4" />
                                Generar reporte
                            </Button>
                        </>
                    )}

                    {canDownloadAndReevaluate && (
                        <>
                            <Button type="button" variant="outline" className="bg-white" onClick={handleDownloadPdf} disabled={runningAction !== null}>
                                {runningAction === 'download-pdf' ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
                                Descargar
                            </Button>

                            <Button type="button" variant="outline" className="bg-white" onClick={handleDuplicate} disabled={runningAction !== null}>
                                <CopyIcon className="h-4 w-4" />
                                Reevaluar
                            </Button>

                            {isGenerated && (
                                <Button type="button" className="bg-[#155a7c] hover:bg-[#104761]" onClick={() => setConfirmAction('request-formal')} disabled={runningAction !== null}>
                                    <FileTextIcon className="h-4 w-4" />
                                    Solicitar Avalúo
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <main className="px-4 py-8 sm:px-6 lg:px-10">
                <section className="mx-auto max-w-7xl bg-white p-8 shadow-sm ring-1 ring-gray-200 print:max-w-none print:shadow-none print:ring-0">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Reporte de Vecindad
                            </h2>
                            <p className="mt-4 text-sm text-slate-500">
                                Fecha: {formatDate(preAppraisal.valuationDate ?? preAppraisal.createdAt)}
                            </p>
                            <p className="text-sm text-slate-500">
                                Radio: {preAppraisal.radiusMeters}m | Sector: {sectorLabels[preAppraisal.sectorFilter]}
                            </p>
                            {preAppraisal.targetAddress && (
                                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                                    {preAppraisal.targetAddress}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="my-8 h-px bg-gray-200" />

                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex gap-6" aria-label="Tabs">
                            <button type="button" className={`border-b-2 py-3 text-sm font-medium ${tabClassName(activeTab === 'summary')}`} onClick={() => setActiveTab('summary')}>
                                Resumen
                            </button>
                            <button type="button" className={`border-b-2 py-3 text-sm font-medium ${tabClassName(activeTab === 'samples')}`} onClick={() => setActiveTab('samples')}>
                                Muestras ({preAppraisal.sampleCount})
                            </button>
                        </nav>
                    </div>

                    <div className="pt-8">
                        {activeTab === 'summary' && (
                            <div className="space-y-12">
                                <div className="grid gap-10 lg:grid-cols-2">
                                    <ReportMap preAppraisal={preAppraisal} />

                                    <section>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Resultados Generales de la Muestra
                                        </h3>

                                        <div className="mt-5 divide-y divide-gray-100">
                                            <ReportSummaryRow label="Rango" unit="L./V2" value={`${formatNumber(preAppraisal.minAverageSquareYard)} - ${formatNumber(preAppraisal.maxAverageSquareYard)}`} />
                                            <ReportSummaryRow label="Precio Recomendado" unit="L./V2" value={formatNumber(preAppraisal.recommendedAverageSquareYard)} strong />
                                            <ReportSummaryRow label="Calidad Esperada" unit={formatExpectedRiskLevel(preAppraisal.expectedRiskScore)} value={formatRisk(preAppraisal.expectedRiskProfile)} />
                                            <ReportSummaryRow label="Plusvalía Anual" unit="%" value={formatPercent(preAppraisal.annualAppreciationRate)} strong />
                                        </div>
                                    </section>
                                </div>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Comportamiento
                                    </h3>

                                    <div className="mt-6 grid gap-10 lg:grid-cols-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                Precio L/V&sup2;
                                            </h4>

                                            {priceChartData.length < 2 && (
                                                <p className="mt-2 text-sm text-slate-500">
                                                    La gráfica de precio necesita datos de al menos dos años.
                                                </p>
                                            )}

                                            <LineChart data={priceChartData} />
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                Riesgo
                                            </h4>

                                            {riskChartData.length < 2 && (
                                                <p className="mt-2 text-sm text-slate-500">
                                                    La gráfica de riesgo necesita datos de al menos dos años.
                                                </p>
                                            )}

                                            <BarChart data={riskChartData} />
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'samples' && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Datos de Muestra
                                </h3>

                                <div className="mt-5 overflow-hidden border border-gray-200">
                                    <SamplesTable samples={preAppraisal.samples} />
                                </div>
                            </section>
                        )}

                    </div>
                </section>
            </main>

            {confirmCopy && (
                <ConfirmDialog
                    open={confirmAction !== null}
                    title={confirmCopy.title}
                    message={confirmCopy.message}
                    cta={confirmCopy.cta}
                    setOpen={(open) => !open && setConfirmAction(null)}
                    onDeny={() => setConfirmAction(null)}
                    onConfirm={() => confirmAction && void runAction(confirmAction)}
                />
            )}
        </div>
    )
}

const ReportSummaryRow = ({ label, unit, value, strong = false }: { label: string; unit: string; value: string; strong?: boolean }) => (
    <div className="grid grid-cols-[1fr_7rem_10rem] items-center gap-4 py-4 text-sm">
        <span className="font-medium text-gray-900">{label}</span>
        <span className="text-slate-500">{unit}</span>
        <span className={strong ? 'text-right font-bold text-[#155a7c]' : 'text-right font-bold text-gray-900'}>{value}</span>
    </div>
)

const SamplesTable = ({ samples }: { samples: DetailSample[] }) => (
    <Table className="min-w-[1080px] table-fixed">
        <colgroup>
            <col className="w-[11rem]" />
            <col className="w-[4rem]" />
            <col className="w-[4rem]" />
            <col className="w-[7rem]" />
            <col className="w-[7rem]" />
            <col className="w-[8rem]" />
            <col className="w-[8rem]" />
            <col className="w-[8rem]" />
            <col className="w-[8rem]" />
            <col className="w-[8rem]" />
            <col className="w-[8rem]" />
        </colgroup>

        <TableHeader className="bg-[#155a7c]">
            <TableRow>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Lat Long</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Tag</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Risk</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Price</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Date</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Distancia (M)</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Dentro_Radio</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Dif Time (years)</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Peso Facto</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Peso Distancia</TableHead>
                <TableHead className="px-3 py-2 text-xs font-semibold text-white">Factor</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {samples.map((sample, index) => (
                <TableRow key={`${sample.propertyId ?? sample.propertyValuationId ?? index}`}>
                    <TableCell className="overflow-hidden text-ellipsis px-3 py-2 text-xs">{formatLatLong(sample)}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-xs">{sample.tag ?? '-'}</TableCell>
                    <TableCell className="px-3 py-2 text-center text-xs">{sample.riskScore ?? '-'}</TableCell>
                    <TableCell className="px-3 py-2 text-right text-xs">{formatNumber(sample.averageSquareYard)}</TableCell>
                    <TableCell className="px-3 py-2 text-xs">{formatDate(sample.measuredAt)}</TableCell>
                    <TableCell className="px-3 py-2 text-right text-xs">{formatNumber(sample.distanceMeters)}</TableCell>
                    <TableCell className={sample.isWithinRadius ? 'bg-red-100 px-3 py-2 text-center text-xs' : 'bg-blue-100 px-3 py-2 text-center text-xs'}>{String(sample.isWithinRadius).toUpperCase()}</TableCell>
                    <TableCell className="bg-blue-100 px-3 py-2 text-right text-xs">{formatNumber(sample.valuationAgeYears)}</TableCell>
                    <TableCell className="px-3 py-2 text-right text-xs">{formatNumber(sample.timeWeight, 5)}</TableCell>
                    <TableCell className="px-3 py-2 text-right text-xs">{formatNumber(sample.distanceWeight, 6)}</TableCell>
                    <TableCell className="px-3 py-2 text-right text-xs">{formatNumber(sample.factor, 6)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

const ReportMap = ({ preAppraisal }: { preAppraisal: DetailPreAppraisal }) => {
    const center = { lat: Number(preAppraisal.targetLatitude), lng: Number(preAppraisal.targetLongitude) }
    const radiusMeters = Number(preAppraisal.radiusMeters)
    const hasRadius = Number.isFinite(radiusMeters) && radiusMeters > 0

    return (
        <div className="h-72 overflow-hidden border border-gray-200 bg-slate-100">
            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={13}
                gestureHandling="greedy"
                mapTypeId="hybrid"
                mapId={MAP_ID}
                disableDefaultUI
                zoomControl
                zoomControlOptions={{ position: google.maps.ControlPosition.RIGHT_BOTTOM }}
                fullscreenControl={false}
                style={{ width: '100%', height: '100%' }}
            >
                <ReportMapViewport point={center} radiusMeters={radiusMeters} />

                {hasRadius && (
                    <Circle
                        center={center}
                        radius={radiusMeters}
                        fillColor="#155a7c"
                        fillOpacity={0.12}
                        strokeColor="#155a7c"
                        strokeOpacity={0.55}
                        strokeWeight={2}
                    />
                )}

                <AdvancedMarker position={center} zIndex={200}>
                    <img src={markerPrimary} width={28} height={40} alt="Punto seleccionado" />
                </AdvancedMarker>

                {preAppraisal.samples.map((sample, index) => {
                    if (sample.latitude === null || sample.latitude === undefined || sample.longitude === null || sample.longitude === undefined) {
                        return null
                    }

                    return (
                        <AdvancedMarker key={`${sample.propertyId ?? sample.propertyValuationId ?? index}`} position={{ lat: sample.latitude, lng: sample.longitude }} zIndex={100}>
                            <PinContent scale={0.55} background={getRiskProfileColor(sample.riskProfile)} borderColor="#ffffff" glyphColor="#ffffff" />
                        </AdvancedMarker>
                    )
                })}
            </Map>
        </div>
    )
}

const ReportMapViewport = ({ point, radiusMeters }: { point: google.maps.LatLngLiteral; radiusMeters: number }) => {
    const map = useMap()

    React.useEffect(() => {
        if (!map || !Number.isFinite(radiusMeters) || radiusMeters <= 0) {
            return
        }

        const bounds = new google.maps.Circle({ center: point, radius: radiusMeters }).getBounds()

        if (bounds) {
            map.fitBounds(bounds, RADIUS_VIEW_PADDING)
        }
    }, [map, point.lat, point.lng, radiusMeters])

    return null
}

const formatLatLong = (sample: DetailSample): string => {
    if (sample.latitude === null || sample.latitude === undefined || sample.longitude === null || sample.longitude === undefined) {
        return '-'
    }

    return `${Number(sample.latitude).toFixed(6)}, ${Number(sample.longitude).toFixed(6)}`
}

const downloadBase64File = (contentBase64: string, mimeType: string, filename: string): void => {
    const binaryString = window.atob(contentBase64)
    const bytes = new Uint8Array(binaryString.length)

    for (let index = 0; index < binaryString.length; index += 1) {
        bytes[index] = binaryString.charCodeAt(index)
    }

    const url = window.URL.createObjectURL(new Blob([bytes], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

const getConfirmCopy = (action: ConfirmAction): { title: string; message: string; cta: string } | null => {
    if (action === 'generate') {
        return {
            title: 'Generar reporte',
            message: 'Al generar el reporte el preavalúo quedará bloqueado. ¿Deseas continuar?',
            cta: 'Generar reporte'
        }
    }

    if (action === 'cancel') {
        return {
            title: 'Cancelar preavalúo',
            message: 'El preavalúo pasará a estado cancelado. ¿Deseas continuar?',
            cta: 'Cancelar preavalúo'
        }
    }

    if (action === 'delete') {
        return {
            title: 'Eliminar preavalúo',
            message: 'Esta acción eliminará el borrador. ¿Deseas continuar?',
            cta: 'Eliminar'
        }
    }

    if (action === 'request-formal') {
        return {
            title: 'Solicitar avalúo formal',
            message: 'Se marcará este reporte como solicitud de avalúo formal. ¿Deseas continuar?',
            cta: 'Solicitar'
        }
    }

    return null
}

export default PreAppraisalDetailView
