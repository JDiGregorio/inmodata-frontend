import { ListPreAppraisalsQuery, PreAppraisalSectorFilter, PreAppraisalStatus, RiskAggregates } from '@/generated-types'

export type PreAppraisalRow = ListPreAppraisalsQuery['preAppraisals']['data'][number]
export type SelectAll = 'all'
export type StatusFilter = SelectAll | PreAppraisalStatus
export type SectorFilter = SelectAll | PreAppraisalSectorFilter
export type RiskFilter = SelectAll | RiskAggregates

export type AdvancedFilters = {
    createdFrom: string;
    createdTo: string;
    generatedFrom: string;
    generatedTo: string;
    radiusMin: string;
    radiusMax: string;
    recommendedPriceMin: string;
    recommendedPriceMax: string;
    sampleCountMin: string;
    sampleCountMax: string;
    expectedRiskProfile: RiskFilter;
}
