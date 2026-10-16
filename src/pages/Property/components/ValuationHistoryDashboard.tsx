import { useEffect, useRef, useState } from 'react'
import { CopyIcon, TrendingUpIcon, ShieldCheckIcon, ChevronDownIcon } from 'lucide-react'
import { PropertyValuationHistory } from '@/generated-types'
import { LineChart } from '@/pages/PreAppraisal/components/SimpleCharts'
import { formatDate, formatNumber } from '@/pages/PreAppraisal/components/createFormatters'
import { risks } from '../index'

export function ValuationHistoryDashboard({ history }: { history?: PropertyValuationHistory | null }) {
    const [expanded, setExpanded] = useState<'value' | 'risk' | null>(null)
    const chartContainer = useRef<HTMLDivElement>(null)
    const [chartWidth, setChartWidth] = useState(340)
    useEffect(() => {
        if (!chartContainer.current) return
        const observer = new ResizeObserver(([entry]) => setChartWidth(Math.min(900, entry.contentRect.width)))
        observer.observe(chartContainer.current)
        return () => observer.disconnect()
    }, [expanded])
    if (!history) return <p role="status" className="mb-6 text-sm text-gray-500">No fue posible consultar los indicadores históricos.</p>
    const riskFirst = history.riskPoints[0]?.value
    const riskLast = history.riskPoints.at(-1)?.value
    const riskLabel = (score?: number) => risks.find(risk => risk.id === score)?.label.split(' - ')[1] ?? '-'
    const riskComparable = history.riskPoints.length >= 2
    const change = history.valueChangePercent
    const points = expanded === 'value' ? history.valuePoints : history.riskPoints
    const currency = (value: number) => `L. ${formatNumber(value)}`
    const cards = [
        { key: null, title: 'Total de valuaciones', value: String(history.total), detail: `${history.financialCount} financieras · ${history.controlCount} control${history.otherCount ? ` · ${history.otherCount} otras` : ''}`, Icon: CopyIcon },
        { key: 'value' as const, title: 'Variación del valor', value: change == null ? '-' : `${change > 0 ? '+' : ''}${formatNumber(change, 1)}%`, detail: change == null ? 'Sin suficientes valores comparables' : 'Valor total de valuaciones financieras', Icon: TrendingUpIcon },
        { key: 'risk' as const, title: 'Evolución del riesgo', value: riskComparable ? `R${riskFirst} → R${riskLast}` : riskFirst ? `R${riskFirst}` : '-', detail: riskComparable ? `${riskLabel(riskFirst)} → ${riskLabel(riskLast)}` : 'Sin suficientes datos históricos', Icon: ShieldCheckIcon },
    ]
    return <section className="mb-6" aria-label="Indicadores históricos">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {cards.map(({ key, title, value, detail, Icon }) => {
                const content = <>
                    <span className="flex items-center justify-between gap-2 text-sm text-gray-600"><span>{title}</span><Icon className="size-4 shrink-0" /></span>
                    <span className={`mt-3 block text-2xl font-semibold ${key === 'value' && change != null && change !== 0 ? change > 0 ? 'text-green-700' : 'text-red-700' : 'text-gray-900'}`}>{value}</span>
                    <span className="mt-2 flex items-start justify-between gap-2 text-xs text-gray-500"><span>{detail}</span>{key && <ChevronDownIcon className={`size-4 shrink-0 ${expanded === key ? 'rotate-180' : ''}`} />}</span>
                </>
                return key ? <button key={title} type="button" aria-expanded={expanded === key} aria-controls="valuation-history-chart" onClick={() => setExpanded(expanded === key ? null : key)} className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 text-left hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#155a7c]">{content}</button>
                    : <div key={title} className="min-w-0 rounded-lg border border-gray-200 bg-white p-4">{content}</div>
            })}
        </div>
        {expanded && <div id="valuation-history-chart" className="mt-4 border-b border-gray-200 pb-4">
            <h3 className="text-sm font-semibold text-gray-900">{expanded === 'value' ? 'Valor total del inmueble (L.)' : 'Historial del riesgo'}</h3>
            {expanded === 'value' && history.valueChange != null && <p className="mt-1 text-xs text-gray-500">Variación absoluta: {history.valueChange > 0 ? '+' : ''}{currency(history.valueChange)}</p>}
            {expanded === 'risk' && riskComparable && riskLast !== undefined && <p className="mt-1 text-xs text-gray-500">{riskLast < riskFirst ? 'El riesgo mejoró' : riskLast > riskFirst ? 'El riesgo aumentó' : 'El riesgo se mantuvo'}</p>}
            <div ref={chartContainer} className="mt-3 overflow-x-auto">
                <LineChart showYAxis showValues={false} width={Math.max(chartWidth, points.length * 95 + 110)} height={220}
                    domain={expanded === 'risk' ? [1, 5] : undefined} formatValue={expanded === 'value' ? currency : value => `R${value}`}
                    data={points.map((point, index) => ({ year: index, value: Number(point.value), label: formatDate(point.date),
                        tooltip: `${formatDate(point.date)} | ${point.sector === 'financiero' ? 'Financiera' : point.sector === 'control' ? 'Control' : 'Sin sector'} | ${expanded === 'value' ? currency(point.value) : `R${point.value} - ${riskLabel(point.value)}`}` }))} />
            </div>
        </div>}
    </section>
}
