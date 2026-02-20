import * as React from 'react'

import { PropertyPointFieldsFragment } from '@/generated-types'

import { getRiskProfileLabel } from './riskProfile'

type Property = PropertyPointFieldsFragment & {
    position: {
        lat: number
        lng: number
    }
}

type RightPanelProps = {
    point: Property | null
    onClose: () => void
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

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
    )
}

export function RightPanel({ point, onClose }: RightPanelProps) {
    const valuation = point?.latestValuation
    const sector = valuation?.sector?.toLowerCase() ?? null
    const isFinancialSector = sector === 'financiero'
    const isControlSector = sector === 'control'
    const [showDetails, setShowDetails] = React.useState<boolean>(false)

    React.useEffect(() => {
        setShowDetails(false)
    }, [point?.id])

    return (
        <div
            className={[
                'absolute bottom-4 right-4 top-[9.7rem] z-20 w-[420px] max-w-[calc(100%-2rem)]',
                'transition-all duration-200',
                point ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0',
            ].join(' ')}
        >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-sm font-semibold text-white">{getRiskProfileLabel(valuation?.riskProfile)}</div>

                    <button onClick={onClose} className="cursor-pointer rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">
                        Cerrar
                    </button>
                </div>

                <div className="space-y-1 border-b border-gray-200 pb-4">
                    <h3 className="text-3xl font-semibold text-gray-900">{point?.name ?? 'Detalle'}</h3>
                    <p className="text-lg text-gray-600">{point?.exactAddress ?? 'Sin dirección'}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-b border-gray-200 pb-4">
                    <div className="rounded-xl border border-gray-200 p-3">
                        <p className="text-sm text-gray-500">Perfil de riesgo</p>
                        <p className="text-2xl font-semibold text-gray-900">{getRiskProfileLabel(valuation?.riskProfile)}</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                        <p className="text-sm text-gray-500">L/m² promedio</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatNumber(valuation?.averageSquareMeter)}</p>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-4">
                    <p className="text-sm text-gray-500">Detalles del inmueble</p>
                    <button type="button" onClick={() => setShowDetails((prev) => !prev)} className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-500">
                        {showDetails ? 'Ocultar detalles' : 'Ver más detalles'}
                    </button>
                </div>

                {showDetails && (
                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 overflow-y-auto pr-2 text-sm">
                        <Item label="Clave catastral" value={point?.cadastralKey ?? '-'} />
                        <Item label="Coordenadas" value={point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : '-'} />
                        <Item label="Sector avalúo" value={valuation?.sector ?? '-'} />
                        <Item label="Valor promedio" value={formatNumber(valuation?.averageValue)} />
                        <Item label="Área de terreno" value={formatNumber(valuation?.landArea)} />
                        <Item label="Valor del terreno" value={formatNumber(valuation?.landValue)} />
                        {isFinancialSector && <Item label="Área de mejoras" value={formatNumber(valuation?.improvementArea)} />}
                        {isFinancialSector && <Item label="L/v²" value={formatNumber(valuation?.averageSquareYard)} />}
                        {(isFinancialSector || isControlSector) && <Item label="Radio de utilización" value={formatNumber(valuation?.utilizationRatio)} />}
                        <Item label="Última actualización" value={formatDate(valuation?.measuredAt)} />
                    </div>
                )}
            </div>
        </div>
    )
}
