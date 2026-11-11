import { PreAppraisalSectorFilter, PreAppraisalStatus, RiskAggregates } from '@/generated-types'

import { AdvancedFilters, RiskFilter, SectorFilter, StatusFilter } from './types'

export const ITEMS_PER_PAGE = 15
export const CREATE_PATH = '/preavaluos/crear'

export const initialAdvancedFilters: AdvancedFilters = {
    createdFrom: '',
    createdTo: '',
    generatedFrom: '',
    generatedTo: '',
    radiusMin: '',
    radiusMax: '',
    recommendedPriceMin: '',
    recommendedPriceMax: '',
    sampleCountMin: '',
    sampleCountMax: '',
    expectedRiskProfile: 'all'
}

export const statusOptions: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: PreAppraisalStatus.Draft, label: 'Borrador' },
    { value: PreAppraisalStatus.Generated, label: 'Generado' },
    { value: PreAppraisalStatus.FormalRequested, label: 'Avalúo solicitado' },
    { value: PreAppraisalStatus.Cancelled, label: 'Cancelado' }
]

export const sectorOptions: Array<{ value: SectorFilter; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: PreAppraisalSectorFilter.Financiero, label: 'Financiero' },
    { value: PreAppraisalSectorFilter.Control, label: 'Control' },
    { value: PreAppraisalSectorFilter.Both, label: 'Ambos' }
]

export const riskOptions: Array<{ value: RiskFilter; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: RiskAggregates.Excellent, label: 'R1 - Excelente' },
    { value: RiskAggregates.VeryGood, label: 'R2 - Muy bueno' },
    { value: RiskAggregates.Good, label: 'R3 - Bueno' },
    { value: RiskAggregates.Fair, label: 'R4 - Regular' },
    { value: RiskAggregates.HighRisk, label: 'R5 - Riesgo alto' }
]

export const statusMeta: Record<PreAppraisalStatus, { label: string; className: string }> = {
    [PreAppraisalStatus.Draft]: {
        label: 'Borrador',
        className: 'bg-slate-100 text-slate-700 ring-slate-500/10'
    },
    [PreAppraisalStatus.Generated]: {
        label: 'Generado',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    },
    [PreAppraisalStatus.FormalRequested]: {
        label: 'Avalúo solicitado',
        className: 'bg-blue-50 text-blue-700 ring-blue-600/20'
    },
    [PreAppraisalStatus.Cancelled]: {
        label: 'Cancelado',
        className: 'bg-amber-50 text-amber-700 ring-amber-600/20'
    }
}
