import moment from 'moment'

import { PreAppraisalSectorFilter, RiskAggregates, ValuationSector } from '@/generated-types'

export const sectorLabels: Record<PreAppraisalSectorFilter, string> = {
    [PreAppraisalSectorFilter.Financiero]: 'Financiero',
    [PreAppraisalSectorFilter.Control]: 'Control',
    [PreAppraisalSectorFilter.Both]: 'Ambos'
}

export const valuationSectorLabels: Record<ValuationSector, string> = {
    [ValuationSector.Financiero]: 'Financiero',
    [ValuationSector.Control]: 'Control'
}

export const riskLabels: Record<RiskAggregates, string> = {
    [RiskAggregates.Excellent]: 'Excelente',
    [RiskAggregates.VeryGood]: 'Muy Bueno',
    [RiskAggregates.Good]: 'Bueno',
    [RiskAggregates.Fair]: 'Regular',
    [RiskAggregates.HighRisk]: 'Riesgo Alto'
}

export const formatLempiras = (value?: number | null): string => {
    if (value === null || value === undefined) {
        return '-'
    }

    return `L. ${value.toLocaleString('es-HN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

export const formatNumber = (value?: number | null, digits = 2): string => {
    if (value === null || value === undefined) {
        return '-'
    }

    return value.toLocaleString('es-HN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    })
}

export const formatPercent = (value?: number | null): string => {
    if (value === null || value === undefined) {
        return '-'
    }

    return `${(value * 100).toFixed(1)}%`
}

export const formatDistance = (value?: number | null): string => {
    if (value === null || value === undefined) {
        return '-'
    }

    return `${formatNumber(value, 2)} m`
}

export const formatDate = (value?: string | null): string => {
    if (!value) {
        return '-'
    }

    return moment(value).format('DD/MM/YYYY')
}

export const formatRisk = (value?: RiskAggregates | null): string => {
    if (!value) {
        return '-'
    }

    return riskLabels[value] ?? value
}

export const formatExpectedRiskLevel = (value?: number | null): string => {
    if (value === null || value === undefined) {
        return '-'
    }

    return `R${Math.round(value)}`
}
