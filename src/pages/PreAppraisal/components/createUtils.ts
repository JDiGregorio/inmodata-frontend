import { ChartPoint } from './createTypes'

export const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 15.7597, lng: -86.7822 }
export const DEFAULT_RADIUS_METERS = '150'
export const DEFAULT_TIME_FACTOR = -0.5

export const parseChartPoints = (value: unknown, valueKey: 'averagePrice' | 'averageRiskScore'): ChartPoint[] => {
    const rows = parseArray(value)

    return rows.reduce<ChartPoint[]>((items, row) => {
        if (!row || typeof row !== 'object') {
            return items
        }

        const record = row as Record<string, unknown>
        const year = parseFiniteNumber(record.year)
        const parsedValue = parseFiniteNumber(record[valueKey])

        if (year === undefined || parsedValue === undefined) {
            return items
        }

        return [
            ...items,
            {
                year,
                value: parsedValue,
                valuationCount: parseFiniteNumber(record.valuationCount ?? record.count),
                propertyCount: parseFiniteNumber(record.propertyCount ?? record.count)
            }
        ]
    }, []).sort((left, right) => left.year - right.year)
}

export const isValidPreviewInput = (latitude: number | null, longitude: number | null, radiusMeters: string): boolean => {
    const radius = Number(radiusMeters)

    return latitude !== null && longitude !== null && Number.isFinite(radius) && radius > 0
}

const parseFiniteNumber = (value: unknown): number | undefined => {
    if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
        return undefined
    }

    const parsedValue = Number(value)

    return Number.isFinite(parsedValue) ? parsedValue : undefined
}

const parseArray = (value: unknown): unknown[] => {
    if (Array.isArray(value)) {
        return value
    }

    if (typeof value !== 'string') {
        return []
    }

    try {
        const parsedValue: unknown = JSON.parse(value)

        return Array.isArray(parsedValue) ? parsedValue : []
    } catch {
        return []
    }
}
