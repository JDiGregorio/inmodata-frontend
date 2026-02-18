import {
	PropertyPointFieldsFragment
} from '@/generated-types'

import { getRiskProfileLabel } from './riskProfile'

type Property = PropertyPointFieldsFragment & {
	position: { 
		lat: number;
		lng: number;
	}
}

type RightPanelProps = {
	point: Property | null;
	onClose: () => void;
}

const numberFormatter = new Intl.NumberFormat('es-HN', {
	maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es-HN', {
	dateStyle: 'medium',
	timeStyle: 'short',
})

function formatNumber(value?: number | null) {
	if (value == null) {
		return '-'
	}

	return numberFormatter.format(value)
}

function formatDate(value?: string | null) {
	if (!value) {
		return '-'
	}

	const parsedDate = new Date(value)

	if (Number.isNaN(parsedDate.getTime())) {
		return value
	}

	return dateFormatter.format(parsedDate)
}

export function RightPanel({ point, onClose }: RightPanelProps) {
	const valuation = point?.latestValuation
	const sector = valuation?.sector?.toLowerCase() ?? null
	const isFinancialSector = sector === 'financiero'
	const isControlSector = sector === 'control'

	return (
		<div className={['absolute right-4 top-20 z-10 w-[390px] max-w-[calc(100%-2rem)]', 'transition-all duration-200', point ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'].join(' ')}>
			<div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
				<div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<h3 className="text-md font-semibold text-gray-900">
								{point?.name ?? 'Detalle'}
							</h3>

							<button onClick={onClose} className="cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
								Cerrar
							</button>
						</div>

						<p className="text-xs text-gray-500">
							{point?.exactAddress ?? 'Sin dirección'}
						</p>
					</div>
				</div>

				<div className="max-h-[52.5vh] space-y-2 overflow-y-auto p-4">
					<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
						<p className="text-xs text-gray-600">
							Clave Catastral:
						</p>

						<p className="text-sm font-medium text-gray-900">
							{point?.cadastralKey ?? '-'}
						</p>
					</div>

					<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
						<p className="text-xs text-gray-600">
							Cantidad:
						</p>

						<p className="text-sm font-medium text-gray-900">
							{formatNumber(point?.quantity)}
						</p>
					</div>

					<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
						<p className="text-xs text-gray-600">
							Coordenadas:
						</p>

						<p className="text-sm font-medium text-gray-900">
							{point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : '-'}
						</p>
					</div>

					<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
						<p className="text-xs text-gray-600">
							Sector Avalúo:
						</p>

						<p className="text-sm font-medium text-gray-900 capitalize">
							{valuation?.sector ?? '-'}
						</p>
					</div>

					{isFinancialSector && (
						<>
							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Valor Promedio:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.averageValue)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Área de Terreno:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.landArea)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Área de Mejoras:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.improvementArea)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Valor del Terreno:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.landValue)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Radio de Utilización:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.utilizationRatio)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									L/v&#178;:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.averageSquareYard)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									L/m&#178; Promedio
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.averageSquareMeter)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Perfil de Riesgo:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{getRiskProfileLabel(valuation?.riskProfile)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Valuado en:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatDate(valuation?.measuredAt)}
								</p>
							</div>
						</>
					)}

					{isControlSector && (
						<>
							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									L/v&#178;:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{formatNumber(valuation?.averageSquareYard)}
								</p>
							</div>

							<div className="px-4 py-2 flex justify-between items-center rounded bg-gray-50">
								<p className="text-xs text-gray-600">
									Perfil de riesgo:
								</p>

								<p className="text-sm font-medium text-gray-900">
									{getRiskProfileLabel(valuation?.riskProfile)}
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
