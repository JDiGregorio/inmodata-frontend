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
