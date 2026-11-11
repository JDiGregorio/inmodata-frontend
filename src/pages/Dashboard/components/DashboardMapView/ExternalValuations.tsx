import { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react'

import { usePropertyExternalValuationsQuery, usePropertyMapSummaryQuery } from '@/generated-types'
import { getRiskProfileLabel } from './riskProfile'

const price = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function ExternalValuations({ propertyId }: { propertyId: string }) {
    const [expanded, setExpanded] = useState(false)
    const [page, setPage] = useState(1)
    const summary = usePropertyMapSummaryQuery({ variables: { id: propertyId }, fetchPolicy: 'no-cache' })
    const details = usePropertyExternalValuationsQuery({
        variables: { id: propertyId, page },
        skip: !expanded,
        fetchPolicy: 'no-cache',
    })
    const available = summary.data?.propertyMapDetails.externalValuationSummary
    const valuations = details.data?.propertyMapDetails.externalValuations

    if (summary.error) {
        return <p role="alert" className="px-4 pb-4 text-xs text-red-700">No fue posible consultar las otras valuaciones.</p>
    }
    if (!available?.count) return null

    return (
        <section className="mx-4 border-t border-gray-200 py-4 text-sm">
            <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`external-valuations-${propertyId}`}
                onClick={() => setExpanded((value) => !value)}
                className="flex w-full items-center justify-between gap-2 text-left font-semibold text-gray-900"
            >
                <span>Otras valuaciones disponibles ({available.count})</span>
                {expanded ? <ChevronUp className="size-4 shrink-0" /> : <ChevronDown className="size-4 shrink-0" />}
            </button>
            {available.hasNewer && <p className="mt-2 text-xs text-amber-800">Hay una valuación externa más reciente que la de sus instituciones.</p>}
            {expanded && (
                <div id={`external-valuations-${propertyId}`} className="mt-3 space-y-3">
                    {details.loading && <p role="status" className="text-xs text-gray-500">Cargando valuaciones...</p>}
                    {details.error && <p role="alert" className="text-xs text-red-700">No fue posible cargar las valuaciones externas.</p>}
                    {!details.loading && !details.error && valuations?.data.map((valuation) => (
                        <div key={valuation.id} className="space-y-2 border-b border-gray-100 pb-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium text-gray-900 break-words">{valuation.institutionName ?? 'Sin institución'}</p>
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500"><LockKeyhole className="size-3" />Solo lectura</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                {valuation.measuredAt ? new Date(`${valuation.measuredAt}T12:00:00`).toLocaleDateString('es-HN') : 'Sin fecha'}
                                {valuation.isNewer && <span className="ml-2 font-medium text-amber-800">Más reciente</span>}
                            </p>
                            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                <dt className="text-gray-500">Precio L/v²</dt><dd className="text-right">{valuation.averageSquareYard == null ? '-' : price.format(valuation.averageSquareYard)}</dd>
                                <dt className="text-gray-500">Valor total L</dt><dd className="text-right">{valuation.averageValue == null ? '-' : price.format(valuation.averageValue)}</dd>
                                <dt className="text-gray-500">Área de terreno v²</dt><dd className="text-right">{valuation.landArea == null ? '-' : price.format(valuation.landArea)}</dd>
                                <dt className="text-gray-500">Perfil de riesgo</dt><dd className="text-right">{getRiskProfileLabel(valuation.riskProfile)}</dd>
                            </dl>
                        </div>
                    ))}
                    <div className="flex items-center justify-between">
                        <button type="button" title="Página anterior" aria-label="Página anterior" disabled={page === 1 || details.loading} onClick={() => setPage((value) => value - 1)} className="rounded p-1 hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="size-4" /></button>
                        <span className="text-xs text-gray-500">{page}</span>
                        <button type="button" title="Página siguiente" aria-label="Página siguiente" disabled={!valuations?.hasMorePages || details.loading} onClick={() => setPage((value) => value + 1)} className="rounded p-1 hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="size-4" /></button>
                    </div>
                </div>
            )}
        </section>
    )
}
