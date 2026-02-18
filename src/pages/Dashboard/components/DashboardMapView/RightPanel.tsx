import {
	PropertyPointFieldsFragment
} from '@/generated-types'

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
			<div className="overflow-hidden rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5">
				<div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
					<div>
						<h3 className="text-sm font-semibold text-gray-900">{point?.name ?? 'Detalle'}</h3>
						<p className="text-xs text-gray-500">{point?.exactAddress ?? 'Sin dirección'}</p>
					</div>

					<button onClick={onClose} className="cursor-pointer rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
						Cerrar
					</button>
				</div>

				<div className="max-h-[67vh] space-y-3 overflow-y-auto p-4">
					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">Clave catastral</p>
						<p className="text-sm font-medium text-gray-900">{point?.cadastralKey ?? '-'}</p>
					</div>

					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">Cantidad</p>
						<p className="text-sm font-medium text-gray-900">{formatNumber(point?.quantity)}</p>
					</div>

					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">Coordenadas</p>
						<p className="text-sm font-medium text-gray-900">{point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : '-'}</p>
					</div>

					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">Sector avalúo</p>
						<p className="text-sm font-medium text-gray-900">{valuation?.sector ?? '-'}</p>
					</div>

					{isFinancialSector && (
						<>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Valor promedio</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.averageValue)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Área de terreno</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.landArea)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Área de mejoras</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.improvementArea)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Valor del terreno</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.landValue)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Relación de utilización</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.utilizationRatio)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Promedio yarda²</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.averageSquareYard)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Promedio metro²</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.averageSquareMeter)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Perfil de riesgo</p><p className="text-sm font-medium text-gray-900">{valuation?.riskProfile ?? '-'}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Medido en</p><p className="text-sm font-medium text-gray-900">{formatDate(valuation?.measuredAt)}</p></div>
						</>
					)}

					{isControlSector && (
						<>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Promedio yarda²</p><p className="text-sm font-medium text-gray-900">{formatNumber(valuation?.averageSquareYard)}</p></div>
							<div className="rounded-xl bg-gray-50 p-3"><p className="text-xs text-gray-600">Perfil de riesgo</p><p className="text-sm font-medium text-gray-900">{valuation?.riskProfile ?? '-'}</p></div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
