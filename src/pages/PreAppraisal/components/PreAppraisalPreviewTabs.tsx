import React, { useMemo, useState } from 'react'
import { BarChart3Icon } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { RiskAggregates } from '@/generated-types'

import { Badge } from './Badge'
import { formatDate, formatDistance, formatExpectedRiskLevel, formatLempiras, formatNumber, formatPercent, formatRisk, sectorLabels, valuationSectorLabels } from './createFormatters'
import { parseChartPoints } from './createUtils'
import { BarChart, LineChart } from './SimpleCharts'
import { PreAppraisalPreview } from './createTypes'

interface PreAppraisalPreviewTabsProps {
    preview?: PreAppraisalPreview;
    previewLoading: boolean;
    previewError?: string;
}

const tabClassName = (active: boolean) => active
    ? 'border-[#155a7c] text-[#155a7c]'
    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'

const riskBadgeClass = (risk?: RiskAggregates | null): string => {
    if (risk === RiskAggregates.HighRisk) {
        return 'bg-rose-50 text-rose-700 ring-rose-600/20'
    }

    if (risk === RiskAggregates.Fair) {
        return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    }

    return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
}

export const PreAppraisalPreviewTabs = ({ preview, previewLoading, previewError }: PreAppraisalPreviewTabsProps): React.ReactElement => {
    const [activeTab, setActiveTab] = useState<'summary' | 'behavior' | 'samples'>('summary')

    const priceChartData = useMemo(() => parseChartPoints(preview?.priceByYear, ['averagePrice', 'averageSquareYard', 'price', 'value']), [preview?.priceByYear])
    const riskChartData = useMemo(() => parseChartPoints(preview?.riskByYear, ['averageRiskScore', 'riskScore', 'risk', 'value']), [preview?.riskByYear])

    if (previewError) {
        return (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                No pudimos calcular la muestra. Revisa el punto y vuelve a intentar.
            </div>
        )
    }

    if (previewLoading && !preview) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500">
                Calculando muestra...
            </div>
        )
    }

    if (!preview) {
        return (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                Selecciona un punto y presiona Recalcular Muestra para ver los resultados.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-5" aria-label="Tabs">
                    <button type="button" className={`border-b-2 px-0 py-3 text-sm font-medium ${tabClassName(activeTab === 'summary')}`} onClick={() => setActiveTab('summary')}>
                        Resumen
                    </button>
                    <button type="button" className={`border-b-2 px-0 py-3 text-sm font-medium ${tabClassName(activeTab === 'behavior')}`} onClick={() => setActiveTab('behavior')}>
                        Comportamiento
                    </button>
                    <button type="button" className={`border-b-2 px-0 py-3 text-sm font-medium ${tabClassName(activeTab === 'samples')}`} onClick={() => setActiveTab('samples')}>
                        Muestra ({preview.sampleCount})
                    </button>
                </nav>
            </div>

            {activeTab === 'summary' && (
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Resultados Generales de la Muestra
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <SummaryCard label="Rango L./V2" value={`${formatNumber(preview.minAverageSquareYard)} - ${formatNumber(preview.maxAverageSquareYard)}`} />
                        <SummaryCard label="Precio Recomendado" value={`${formatLempiras(preview.recommendedAverageSquareYard)} L./V2`} strong />
                        <SummaryCard
                            label="Calidad Esperada"
                            value={formatExpectedRiskLevel(preview.expectedRiskScore)}
                            aside={<Badge className={riskBadgeClass(preview.expectedRiskProfile)}>{formatRisk(preview.expectedRiskProfile)}</Badge>}
                        />
                        <SummaryCard label="Plusvalía Anual" value={formatPercent(preview.annualAppreciationRate)} strong />
                    </div>

                    {preview.excludedWithoutValidValuationCount > 0 && (
                        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
                            {preview.excludedWithoutValidValuationCount} properties no fueron consideradas porque no tienen una valuación válida para el sector seleccionado.
                        </div>
                    )}

                    <div className="rounded-lg border border-gray-200 bg-white px-5 py-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#155a7c]/10 text-[#155a7c]">
                            <BarChart3Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {preview.sampleCount} Propiedades encontradas
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Dentro del radio de {preview.radiusMeters}m en el sector {sectorLabels[preview.sectorFilter].toLowerCase()}.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'behavior' && (
                <div className="space-y-5">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Comportamiento del Precio L./V2</h3>
                        <LineChart data={priceChartData} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Comportamiento del Riesgo</h3>
                        <BarChart data={riskChartData} />
                    </div>
                </div>
            )}

            {activeTab === 'samples' && (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    {preview.samples.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-gray-500">
                            No hay propiedades dentro de la muestra.
                        </div>
                    ) : (
                        <Table className="min-w-[1040px] table-fixed">
                            <colgroup>
                                <col className="w-[4rem]" />
                                <col className="w-[9rem]" />
                                <col className="w-[14rem]" />
                                <col className="w-[7rem]" />
                                <col className="w-[5rem]" />
                                <col className="w-[8rem]" />
                                <col className="w-[8rem]" />
                                <col className="w-[8rem]" />
                                <col className="w-[7rem]" />
                                <col className="w-[9rem]" />
                                <col className="w-[9rem]" />
                            </colgroup>

                            <TableHeader className="bg-[#155a7c]">
                                <TableRow>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Tag</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Referencia valuation</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Property</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Sector</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Riesgo</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Precio L./V2</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Fecha medición</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Distancia M</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Factor</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Precio ponderado</TableHead>
                                    <TableHead className="px-3 py-2 text-xs font-medium text-white">Riesgo ponderado</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {preview.samples.map((sample, index) => (
                                    <TableRow key={`${sample.propertyId ?? sample.propertyValuationId ?? index}`}>
                                        <TableCell className="px-3 py-2 text-xs">{sample.tag ?? '-'}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{sample.valuationReference ?? '-'}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{sample.propertyName ?? sample.exactAddress ?? '-'}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{sample.valuationSector ? valuationSectorLabels[sample.valuationSector] : '-'}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{sample.riskScore ?? '-'}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatLempiras(sample.averageSquareYard)}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatDate(sample.measuredAt)}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatDistance(sample.distanceMeters)}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatNumber(sample.factor, 6)}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatLempiras(sample.weightedPrice)}</TableCell>
                                        <TableCell className="px-3 py-2 text-xs">{formatNumber(sample.weightedRisk)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    )
}

interface SummaryCardProps {
    label: string;
    value: string;
    aside?: React.ReactNode;
    strong?: boolean;
}

const SummaryCard = ({ label, value, aside, strong = false }: SummaryCardProps): React.ReactElement => (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <div className="mt-2 flex items-center gap-2">
            <p className={strong ? 'text-base font-semibold text-[#155a7c]' : 'text-sm font-semibold text-gray-900'}>
                {value}
            </p>
            {aside}
        </div>
    </div>
)
