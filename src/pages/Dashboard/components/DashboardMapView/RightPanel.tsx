import type { Point } from './types'

type RightPanelProps = {
	point: Point | null;
	onClose: () => void;
}

export function RightPanel({ point, onClose }: RightPanelProps) {
	return (
		<div className={['absolute right-4 top-20 z-10 w-[360px] max-w-[calc(100%-2rem)]', 'transition-all duration-200', point ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'].join(' ')}>
			<div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
				<div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
					<div>
						<h3 className="text-sm font-semibold text-gray-900">
							{point?.name ?? 'Detalle'}
						</h3>

						<p className="text-xs text-gray-500">
							{point?.address ?? 'Sin dirección'}
						</p>
					</div>

					<button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
						Cerrar
					</button>
				</div>

				<div className="p-4 space-y-3">
					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">
							Coordenadas
						</p>

						<p className="text-sm font-medium text-gray-900">
							{point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : '-'}
						</p>
					</div>

					<div className="rounded-xl bg-gray-50 p-3">
						<p className="text-xs text-gray-600">
							Notas
						</p>

						<p className="text-sm text-gray-900">
							{point?.notes ?? 'Sin notas'}
						</p>
					</div>

					<button
						className="w-full rounded-xl bg-gray-900 text-white text-sm font-semibold py-2 hover:bg-gray-800"
						onClick={() => {
							if (!point) {
								return
							}

							const url = `https://www.google.com/maps?q=${point.position.lat},${point.position.lng}`

							window.open(url, '_blank', 'noopener,noreferrer')
						}}
					>
						Abrir en Google Maps
					</button>
				</div>
			</div>
		</div>
	)
}
