import { RiskAggregates } from '@/generated-types'

export const RISK_PROFILE_META: Record<RiskAggregates, { short: string; label: string; color: string }> = {
	[RiskAggregates.VeryHigh]: { short: 'R5', label: 'Muy Alto', color: '#FF0000' },
	[RiskAggregates.High]: { short: 'R4', label: 'Alto', color: '#FFC000' },
	[RiskAggregates.Medium]: { short: 'R3', label: 'Medio', color: '#FFFF00' },
	[RiskAggregates.Low]: { short: 'R2', label: 'Bajo', color: '#95D050' },
	[RiskAggregates.VeryLow]: { short: 'R1', label: 'Muy Bajo', color: '#00B050' }
}

export function getRiskProfileShort(riskProfile?: RiskAggregates | null) {
	if (!riskProfile) {
		return 'S/D'
	}

	return RISK_PROFILE_META[riskProfile]?.short ?? riskProfile
}

export function getRiskProfileLabel(riskProfile?: RiskAggregates | null) {
	if (!riskProfile) {
		return 'Sin Definir'
	}

	return RISK_PROFILE_META[riskProfile]?.label ?? riskProfile
}

export function getRiskProfileColor(riskProfile?: RiskAggregates | null) {
	if (!riskProfile) {
		return '#4B5563'
	}

	return RISK_PROFILE_META[riskProfile]?.color ?? '#4B5563'
}
