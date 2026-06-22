import React from 'react'

import { ChartPoint } from './createTypes'

interface LineChartProps {
    data: ChartPoint[];
}

interface BarChartProps {
    data: ChartPoint[];
}

const chartWidth = 360
const chartHeight = 170
const padding = 28

const getRange = (data: ChartPoint[]) => {
    const values = data.map((item) => item.value)
    const min = Math.min(...values)
    const max = Math.max(...values)

    return {
        min,
        max: max === min ? max + 1 : max
    }
}

export const LineChart = ({ data }: LineChartProps): React.ReactElement => {
    if (data.length < 2) {
        return <ChartEmptyState />
    }

    const range = getRange(data)
    const points = data.map((item, index) => {
        const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1)
        const y = chartHeight - padding - ((item.value - range.min) / (range.max - range.min)) * (chartHeight - padding * 2)

        return { ...item, x, y }
    })

    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-44 w-full">
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e5e7eb" />
            <path d={path} fill="none" stroke="#155a7c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((point) => (
                <g key={point.year}>
                    <circle cx={point.x} cy={point.y} r="3" fill="#155a7c" />
                    <text x={point.x} y={chartHeight - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
                        {point.year}
                    </text>
                </g>
            ))}
        </svg>
    )
}

export const BarChart = ({ data }: BarChartProps): React.ReactElement => {
    if (data.length === 0) {
        return <ChartEmptyState />
    }

    const range = getRange(data)
    const barWidth = Math.max((chartWidth - padding * 2) / data.length - 22, 22)

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-44 w-full">
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e5e7eb" />
            {data.map((item, index) => {
                const x = padding + index * ((chartWidth - padding * 2) / data.length) + 10
                const height = ((item.value - range.min) / (range.max - range.min)) * (chartHeight - padding * 2 - 18) + 18
                const y = chartHeight - padding - height

                return (
                    <g key={item.year}>
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
