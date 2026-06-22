import { ChartPoint } from './createTypes'

export const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 15.7597, lng: -86.7822 }
export const DEFAULT_RADIUS_METERS = '150'
export const DEFAULT_TIME_FACTOR = -0.5

export const parseChartPoints = (value: unknown, valueKeys: string[]): ChartPoint[] => {
    const rows = Array.isArray(value) ? value : []

    return rows.reduce<ChartPoint[]>((items, row) => {
        if (!row || typeof row !== 'object') {
            return items
        }

        const record = row as Record<string, unknown>
        const year = record.year ?? record.anio ?? record.date
        const rawValue = valueKeys.map((key) => record[key]).find((item) => typeof item === 'number' || typeof item === 'string')
        const parsedValue = Number(rawValue)

        if (!year || !Number.isFinite(parsedValue)) {
            return items
        }

        return [
            ...items,
            {
                year: String(year),
                value: parsedValue
            }
        ]
    }, [])
}

export const isValidPreviewInput = (latitude: number | null, longitude: number | null, radiusMeters: string): boolean => {
    const radius = Number(radiusMeters)

    return latitude !== null && longitude !== null && Number.isFinite(radius) && radius > 0
}
