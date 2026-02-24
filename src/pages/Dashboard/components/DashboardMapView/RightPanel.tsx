import * as React from 'react'
import { XIcon, EyeOffIcon, EyeIcon } from 'lucide-react'

import { Item } from './Item'

import { getRiskProfileColor, getRiskProfileShort, getRiskProfileLabel } from './riskProfile'

import {
    PropertyPointFieldsFragment
} from '@/generated-types'
import { classNames } from '@/lib/utils'

type Property = PropertyPointFieldsFragment & {
    position: {
        lat: number;
        lng: number;
    }
}

type RightPanelProps = {
    point: Property | null;
    expanded?: boolean;
    onClose: () => void;
}

const numberFormatter = new Intl.NumberFormat('es-HN', {
    maximumFractionDigits: 2
})

const dateFormatter = new Intl.DateTimeFormat('es-HN', {
    dateStyle: 'medium',
    timeStyle: 'short'
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



export function RightPanel({ point, expanded = false, onClose }: RightPanelProps) {
    const valuation = point?.latestValuation
    const sector = valuation?.sector?.toLowerCase() ?? null
    const isFinancialSector = sector === 'financiero'
    const isControlSector = sector === 'control'
    const [showDetails, setShowDetails] = React.useState<boolean>(false)

    React.useEffect(() => {
        setShowDetails(false)
    }, [point?.id])

    return (
        <div className={[
            'absolute right-4 z-20 w-[370px] max-w-[calc(100%-2rem)]',
            expanded ? 'bottom-4 top-[94px]' : 'bottom-4 top-4',
            'transition-all duration-200',
            point ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-2 opacity-0'
        ].join(' ')}>
            <div className="flex h-auto max-h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/95  shadow-2xl ring-1 ring-black/5 backdrop-blur-sm">
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-md font-semibold text-gray-900">
                            {point?.name ?? 'Detalle'}
                        </h3>

                        <button onClick={onClose} className="cursor-pointer rounded-lg py-1 text-sm text-gray-500 hover:bg-gray-100">
                            <XIcon aria-hidden="true" className="size-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex w-full items-center space-x-4 rounded-lg px-2 py-2 shadow-sm" style={{ backgroundColor: getRiskProfileColor(valuation?.riskProfile) }}>
                        <dt className="py-2 px-3 bg-white rounded-md border-transparent">
                            <p className="text-xl font-bold">
                                {getRiskProfileShort(valuation?.riskProfile)}
                            </p>
                        </dt>

                        <dd className="flex flex-col items-baseline leading-none">
                            <p className="text-xs text-gray-500">
                                Riesgo:
                            </p>
                            <p className="text-xl font-semibold text-gray-900">
                                {getRiskProfileLabel(valuation?.riskProfile)}
                            </p>
                        </dd>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center rounded bg-gray-100 border border-gray-200 py-2 px-4 sm:col-span-2">
                            <p className="text-sm text-gray-600">
                                Perfil de Riesgo:
                            </p>

                            <p className="text-md font-semibold text-gray-900">
                                {getRiskProfileLabel(valuation?.riskProfile)}
                            </p>
                        </div>

                        <div className="flex justify-between items-center rounded bg-gray-100 border border-gray-200 py-2 px-4 sm:col-span-2">
                            <p className="text-sm text-gray-600">
                                L/m² Promedio:
                            </p>

                            <p className="text-md font-semibold text-gray-900">
                                {formatNumber(valuation?.averageSquareMeter)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1 border-b border-gray-200 pb-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                            Dirección:
                        </h3>

                        <p className="text-xs text-gray-600">
                            {point?.exactAddress ?? 'Sin dirección'}
                        </p>
                    </div>
                </div>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">
                    <div className={classNames(showDetails ? "pr-2" : "pr-4", "pl-4  flex items-center justify-between")}>
                        <p className="text-sm text-gray-500">
                            Más Detalles
                        </p>

                        <button type="button" onClick={() => setShowDetails((prev) => !prev)} className="px-2 py-1 flex items-center cursor-pointer rounded-md border border-gray-200 bg-gray-100">
                            {showDetails ? (
                                <EyeOffIcon className="size-4 text-gray-400" />
                            ) : (
                                <EyeIcon className="size-4 text-gray-400" />
                            )}
                        </button>
                    </div>

                    {showDetails && (
                        <div className="px-4 grid grid-cols-2 gap-x-6 gap-y-3 pr-2 text-sm">
                            <Item label="Clave catastral" value={point?.cadastralKey ?? '-'} />

                            <Item label="Coordenadas" value={point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : '-'} />

                            <Item label="Sector avalúo" value={valuation?.sector ?? '-'} />

                            <Item label="Valor promedio" value={formatNumber(valuation?.averageValue)} />

                            <Item label="Área de terreno" value={formatNumber(valuation?.landArea)} />

                            <Item label="Valor del terreno" value={formatNumber(valuation?.landValue)} />

                            {isFinancialSector && (
                                <Item label="Área de mejoras" value={formatNumber(valuation?.improvementArea)} />
                            )}

                            {isFinancialSector && (
                                <Item label="L/v²" value={formatNumber(valuation?.averageSquareYard)} />
                            )}

                            {(isFinancialSector || isControlSector) && (
                                <Item label="Radio de utilización" value={formatNumber(valuation?.utilizationRatio)} />
                            )}

                            <Item label="Última actualización" value={formatDate(valuation?.measuredAt)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
