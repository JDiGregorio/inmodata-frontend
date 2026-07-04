import { RiskAggregates } from '@/generated-types'

export const RISK_PROFILE_META: Record<RiskAggregates, { short: string; label: string; color: string }> = {
	[RiskAggregates.Excellent]: { short: 'R1', label: 'Excelente', color: '#00B050' },
	[RiskAggregates.VeryGood]: { short: 'R2', label: 'Muy Bueno', color: '#95D050' },
	[RiskAggregates.Good]: { short: 'R3', label: 'Bueno', color: '#FFFF00' },
	[RiskAggregates.Fair]: { short: 'R4', label: 'Regular', color: '#FFC000' },
	[RiskAggregates.HighRisk]: { short: 'R5', label: 'Riesgo Alto', color: '#FF0000' },
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

export function getRiskProfileTextColor(riskProfile?: RiskAggregates | null) {
	const color = getRiskProfileColor(riskProfile)
	const normalizedColor = color.replace('#', '')

	if (normalizedColor.length !== 6) {
		return '#111827'
	}

	const r = parseInt(normalizedColor.slice(0, 2), 16)
	const g = parseInt(normalizedColor.slice(2, 4), 16)
	const b = parseInt(normalizedColor.slice(4, 6), 16)
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

	return luminance > 0.65 ? '#111827' : '#FFFFFF'
}
