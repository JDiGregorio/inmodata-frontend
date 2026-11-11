import React from 'react'

import { ChartPoint } from './createTypes'

interface LineChartProps {
    data: ChartPoint[];
    width?: number;
    height?: number;
    formatValue?: (value: number) => string;
    showValues?: boolean;
    showYAxis?: boolean;
    domain?: [number, number];
    invertYAxis?: boolean;
    ticks?: number[];
    formatPointLabel?: (point: ChartPoint, index: number) => string;
}

interface BarChartProps {
    data: ChartPoint[];
}

const chartWidth = 360
const chartHeight = 170
const padding = 28
const valueFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

const getSortedData = (data: ChartPoint[]): ChartPoint[] => [...data].sort((left, right) => left.year - right.year)

const getRange = (data: ChartPoint[]) => {
    const values = data.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
        min,
        max: max === min ? max + 1 : max
    }
}

const getYearPosition = (year: number, minYear: number, maxYear: number, leftPadding = padding, rightPadding = padding, width = chartWidth): number => {
    if (maxYear === minYear) {
        return width / 2
    }

    return leftPadding + ((year - minYear) / (maxYear - minYear)) * (width - leftPadding - rightPadding)
}

export const LineChart = ({ data, width = chartWidth, height = chartHeight, formatValue, showValues = true, showYAxis = false, domain, invertYAxis = false, ticks, formatPointLabel }: LineChartProps): React.ReactElement => {
    if (data.length < 2) {
        return <ChartEmptyState />
    }

    const sortedData = getSortedData(data)
    const rawRange = domain ? { min: domain[0], max: domain[1] } : getRange(sortedData)
    const stepMagnitude = 10 ** Math.floor(Math.log10((rawRange.max - rawRange.min) / 4))
    const step = [1, 2, 5, 10].map(value => value * stepMagnitude).find(value => value >= (rawRange.max - rawRange.min) / 4) ?? stepMagnitude
    const range = showYAxis && !domain ? { min: Math.floor(rawRange.min / step) * step, max: Math.ceil(rawRange.max / step) * step } : rawRange
    const axisTicks = ticks ?? (showYAxis && !domain
        ? Array.from({ length: Math.round((range.max - range.min) / step) + 1 }, (_, index) => range.min + index * step)
        : [range.min, (range.min + range.max) / 2, range.max])
    const leftPadding = showYAxis ? Math.max(65, ...axisTicks.map(value => (formatValue?.(value) ?? valueFormatter.format(value)).length * 6 + 16)) : padding
    const pointLabels = sortedData.map((point, index) => formatPointLabel?.(point, index) ?? `L. ${valueFormatter.format(point.value)}`)
    const labelWidth = Math.max(60, ...pointLabels.map(label => label.length * 6.3 + 14))
    const plotWidth = showYAxis && showValues ? Math.max(width, leftPadding + (data.length - 1) * (labelWidth + 16) + labelWidth) : width
    const topPadding = showValues ? 40 : padding
    const yPosition = (value: number) => {
        const ratio = (value - range.min) / (range.max - range.min)
        return topPadding + (invertYAxis ? ratio : 1 - ratio) * (height - topPadding - padding)
    }
    const minYear = Math.min(...sortedData.map((item) => item.year))
    const maxYear = Math.max(...sortedData.map((item) => item.year))
    const points = sortedData.map((item) => {
        const x = getYearPosition(item.year, minYear, maxYear, showYAxis && showValues ? leftPadding + labelWidth / 2 + 8 : leftPadding, showYAxis && showValues ? labelWidth / 2 + 8 : padding, plotWidth)
        const y = yPosition(item.value)

        return { ...item, x, y }
    })

    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

    return (
        <svg viewBox={`0 0 ${plotWidth} ${height}`} className={showYAxis ? 'block' : 'h-44 w-full'} style={showYAxis ? { width: plotWidth, height } : undefined} role="img" aria-label="Gráfica histórica">
            <line x1={leftPadding} y1={height - padding} x2={plotWidth - padding} y2={height - padding} stroke="#e5e7eb" />
            {showYAxis && axisTicks.map(value => {
                const y = yPosition(value)
                return <g key={value}><line x1={leftPadding} x2={plotWidth - padding} y1={y} y2={y} stroke="#e5e7eb" /><text x={leftPadding - 8} y={y + 3} textAnchor="end" className="fill-slate-500 text-[10px]">{formatValue?.(value) ?? valueFormatter.format(value)}</text></g>
            })}
            <path d={path} fill="none" stroke="#155a7c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point, index) => (
                <g key={point.year}>
                    <ChartPointTitle point={point} />
                    {showValues && <ChartValueLabel point={point} label={pointLabels[index]} width={plotWidth} />}
                    <circle cx={point.x} cy={point.y} r="3" fill="#155a7c" />
                    <text x={point.x} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
                        {point.label ?? point.year}
                    </text>
                </g>
            ))}
        </svg>
    )
}

export const BarChart = ({ data }: BarChartProps): React.ReactElement => {
    if (data.length < 2) {
        return <ChartEmptyState />
    }

    const sortedData = getSortedData(data)
    const range = getRange(sortedData)
    const minYear = Math.min(...sortedData.map((item) => item.year))
    const maxYear = Math.max(...sortedData.map((item) => item.year))
    const barWidth = Math.min(Math.max((chartWidth - padding * 2) / sortedData.length - 22, 22), 42)
    const yearPadding = padding + barWidth / 2

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-44 w-full">
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e5e7eb" />
            {sortedData.map((item) => {
                const x = getYearPosition(item.year, minYear, maxYear, yearPadding, yearPadding) - barWidth / 2
                const height = ((item.value - range.min) / (range.max - range.min)) * (chartHeight - padding * 2 - 18) + 18
                const y = chartHeight - padding - height

                return (
                    <g key={item.year}>
                        <ChartPointTitle point={item} />
                        <rect x={x} y={y} width={barWidth} height={height} fill="#155a7c" />
                        <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-slate-800 text-[10px] font-semibold">
                            {item.value.toFixed(1)}
                        </text>
                        <text x={x + barWidth / 2} y={chartHeight - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
                            {item.year}
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export const ChartEmptyState = (): React.ReactElement => (
    <div className="flex h-44 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
        No hay suficientes datos para graficar.
    </div>
)

const ChartPointTitle = ({ point }: { point: ChartPoint }): React.ReactElement => {
    const metadata = [
        `${point.year}: ${valueFormatter.format(point.value)}`,
        point.valuationCount !== undefined ? `Valuaciones: ${point.valuationCount}` : null,
        point.propertyCount !== undefined ? `Propiedades: ${point.propertyCount}` : null
    ].filter(Boolean).join(' | ')

    return <title>{point.tooltip ?? metadata}</title>
}

const ChartValueLabel = ({ point, label, width }: { point: ChartPoint & { x: number; y: number }; label: string; width: number }): React.ReactElement => {
    const labelWidth = Math.max(label.length * 6.3 + 12, 42)
    const labelHeight = 16
    const labelX = Math.min(Math.max(point.x, labelWidth / 2 + 2), width - labelWidth / 2 - 2)
    const labelY = Math.max(point.y - 10, labelHeight)

    return (
        <g pointerEvents="none">
            <rect
                x={labelX - labelWidth / 2}
                y={labelY - labelHeight + 2}
                width={labelWidth}
                height={labelHeight}
                rx="3"
                fill="#ffffff"
                stroke="#155a7c"
                strokeOpacity="0.22"
            />
            <text x={labelX} y={labelY - 3} textAnchor="middle" className="fill-slate-800 text-[9px] font-semibold">
                {label}
            </text>
        </g>
    )
}
