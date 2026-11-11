import { PreAppraisalFilterInput } from '@/generated-types'

import { AdvancedFilters, PreAppraisalRow, SectorFilter, StatusFilter } from './types'

const parseNumber = (value: string): number | undefined => {
    if (value.trim() === '') {
        return undefined
    }

    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) ? parsedValue : undefined
}

export const buildFilter = (
    search: string,
    status: StatusFilter,
    sectorFilter: SectorFilter,
    advancedFilters: AdvancedFilters
): PreAppraisalFilterInput => {
    return {
        search: search.trim(),
        status: status === 'all' ? undefined : status,
        sectorFilter: sectorFilter === 'all' ? undefined : sectorFilter,
        createdFrom: advancedFilters.createdFrom || undefined,
        createdTo: advancedFilters.createdTo || undefined,
        generatedFrom: advancedFilters.generatedFrom || undefined,
        generatedTo: advancedFilters.generatedTo || undefined,
        radiusMin: parseNumber(advancedFilters.radiusMin),
        radiusMax: parseNumber(advancedFilters.radiusMax),
        recommendedPriceMin: parseNumber(advancedFilters.recommendedPriceMin),
        recommendedPriceMax: parseNumber(advancedFilters.recommendedPriceMax),
        sampleCountMin: parseNumber(advancedFilters.sampleCountMin),
        sampleCountMax: parseNumber(advancedFilters.sampleCountMax),
        expectedRiskProfile: advancedFilters.expectedRiskProfile === 'all' ? undefined : advancedFilters.expectedRiskProfile
    }
}

export const getDisplayAddress = (preAppraisal: PreAppraisalRow): string => {
    return preAppraisal.targetAddress || preAppraisal.targetProperty?.exactAddress || '-'
}

export const countActiveAdvancedFilters = (filters: AdvancedFilters): number => {
    return Object.values(filters).filter((value) => value !== '' && value !== 'all').length
}
