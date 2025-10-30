import { useState, useEffect } from 'react'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
    const seed = new Uint32Array(4)
    const cryptoObj = window?.crypto || ((window as any).msCrypto as Crypto)

    return cryptoObj.getRandomValues(seed).join('-')
}

export const getInitials = (value: string) => {
    const palabras: string[] = value.trim().split(' ')
    let iniciales: string = ''

    if (palabras.length > 0) {
        iniciales += palabras[0][0]

        if (palabras.length > 1 && palabras[palabras.length - 1] !== '') {
            iniciales += palabras[palabras.length - 1][0]
        }
    }

    return iniciales.toUpperCase()
}

export const useLoadingDots = (title: string, interval = 500) => {
    const [animatedTitle, setAnimatedTitle] = useState(title)

    useEffect(() => {
        let count = 0

        const timer = setInterval(() => {
            count = (count + 1) % 4
            setAnimatedTitle(title + ".".repeat(count))
        }, interval)

        return () => clearInterval(timer)
    }, [title, interval])

    return animatedTitle
}

export const formatDate = (date: Date) => date.toISOString().split("T")[0]

export function formatMoney(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value

    if (isNaN(num)) {
        return ''
    }

    return num.toLocaleString('es-HN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export function toDateOnly(value: string): string {
    const sep = value.includes('/') ? '/' : '-'
    const [a, b, c] = value.split(sep).map(s => s.trim())

    if (a.length === 4) {
        const yyyy = a.padStart(4, '0')
        const mm = b.padStart(2, '0')
        const dd = c.padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    throw new Error('Formato de fecha no reconocido')
}

export const safeDiv = (num: number, den: number) => (den ? num / den : 0)

export const round6 = (n: number) => Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 1e6) / 1e6 : 0

export const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

export const isValidLatitude = (lat: unknown): lat is number => isFiniteNumber(lat) && lat >= -90 && lat <= 90

export const isValidLongitude = (lng: unknown): lng is number => isFiniteNumber(lng) && lng >= -180 && lng <= 180

export const isValidLatLng = (lat: unknown, lng: unknown): lat is number & (typeof lng extends number ? number : never) => isValidLatitude(lat) && isValidLongitude(lng)

export const parseNumberOrUndefined = (value: string): number | undefined => {
    if (value.trim() === '') return undefined
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
}

export const isLatLngLiteral = (v: any): v is { lat: number; lng: number } => v && typeof v.lat === 'number' && typeof v.lng === 'number'

export const isLatLngClass = (v: any): v is google.maps.LatLng => v && typeof v.lat === 'function' && typeof v.lng === 'function'

export function downloadBlob(blob: Blob, filenameFallback: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filenameFallback
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

export function getFilenameFromDisposition(disposition?: string | null): string | null {
    if (!disposition) return null

    const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition)

    if (!match) return null

    try {
        return decodeURIComponent(match[1].replace(/"/g, ''))
    } catch {
        return match[1].replace(/"/g, '')
    }
}
