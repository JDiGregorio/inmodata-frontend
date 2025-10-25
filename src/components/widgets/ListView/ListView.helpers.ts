import { Align, TextCase, Header } from './ListView.types'

export function alignClass(a?: Align) {
    switch (a) {
        case "center": return "text-center"
        case "right": return "text-right"
        default: return "text-left"
    }
}

export function caseClass(c?: TextCase) {
    switch (c) {
        case "upper": return "uppercase"
        case "lower": return "lowercase"
        case "capitalize": return "capitalize"
        default: return ""
    }
}

export const ellipsis = "truncate whitespace-nowrap overflow-hidden text-ellipsis"

export function colStyle(h: Header): React.CSSProperties {
    const toCss = (v: number | string | undefined) => typeof v === "number" ? `${v}px` : v

    const style: React.CSSProperties = {}

    if (h.width !== undefined) style.width = toCss(h.width)
    if (h.minWidth !== undefined) style.minWidth = toCss(h.minWidth)
    if (h.maxWidth !== undefined) style.maxWidth = toCss(h.maxWidth)

    return style
}