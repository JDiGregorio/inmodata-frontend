import { RiskAggregates } from '@/generated-types'

export const RISK_PROFILE_META: Record<RiskAggregates, { label: string; color: string }> = {
	[RiskAggregates.VeryHigh]: { label: 'R5 - Muy Alto', color: '#FF0000' },
	[RiskAggregates.High]: { label: 'R4 - Alto', color: '#FFC000' },
	[RiskAggregates.Medium]: { label: 'R3 - Medio', color: '#FFFF00' },
	[RiskAggregates.Low]: { label: 'R2 - Bajo', color: '#95D050' },
	[RiskAggregates.VeryLow]: { label: 'R1 - Muy Bajo', color: '#00B050' },
}

export function getRiskProfileLabel(riskProfile?: RiskAggregates | null) {
	if (!riskProfile) {
		return '-'
	}

	return RISK_PROFILE_META[riskProfile]?.label ?? riskProfile
}

export function getRiskProfileColor(riskProfile?: RiskAggregates | null) {
	if (!riskProfile) {
		return '#4B5563'
	}

	return RISK_PROFILE_META[riskProfile]?.color ?? '#4B5563'
}
