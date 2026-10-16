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

export const LineChart = ({ data, width = chartWidth, height = chartHeight, formatValue, showValues = true, showYAxis = false, domain }: LineChartProps): React.ReactElement => {
    if (data.length < 2) {
        return <ChartEmptyState />
    }

    const sortedData = getSortedData(data)
    const range = domain ? { min: domain[0], max: domain[1] } : getRange(sortedData)
    const leftPadding = showYAxis ? 95 : padding
    const minYear = Math.min(...sortedData.map((item) => item.year))
    const maxYear = Math.max(...sortedData.map((item) => item.year))
    const points = sortedData.map((item) => {
        const x = getYearPosition(item.year, minYear, maxYear, leftPadding, padding, width)
        const y = height - padding - ((item.value - range.min) / (range.max - range.min)) * (height - padding * 2)

        return { ...item, x, y }
    })

    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={showYAxis ? 'block' : 'h-44 w-full'} style={showYAxis ? { width, height } : undefined} role="img" aria-label="Gráfica histórica">
            <line x1={leftPadding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
            {showYAxis && [range.min, (range.min + range.max) / 2, range.max].map(value => {
                const y = height - padding - (value - range.min) / (range.max - range.min) * (height - padding * 2)
                return <g key={value}><line x1={leftPadding} x2={width - padding} y1={y} y2={y} stroke="#e5e7eb" /><text x={leftPadding - 8} y={y + 3} textAnchor="end" className="fill-slate-500 text-[10px]">{formatValue?.(value) ?? valueFormatter.format(value)}</text></g>
            })}
            <path d={path} fill="none" stroke="#155a7c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point) => (
                <g key={point.year}>
                    <ChartPointTitle point={point} />
                    {showValues && <ChartValueLabel point={point} />}
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

const ChartValueLabel = ({ point }: { point: ChartPoint & { x: number; y: number } }): React.ReactElement => {
    const label = valueFormatter.format(point.value)
    const labelWidth = Math.max(label.length * 5.6 + 8, 42)
    const labelHeight = 16
    const labelX = Math.min(Math.max(point.x, labelWidth / 2 + 2), chartWidth - labelWidth / 2 - 2)
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
                L. {label}
            </text>
        </g>
    )
}
