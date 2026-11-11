import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XIcon } from 'lucide-react'
import { PropertyValuation } from '@/generated-types'
import { risks } from '../index'
import { formatDate, formatNumber } from '@/pages/PreAppraisal/components/createFormatters'

export function ValuationDetailModal({ valuation, onClose }: {
    valuation?: PropertyValuation;
    onClose: () => void;
}) {
    const fields = valuation ? [
        ['Referencia', valuation.reference],
        ['Institución', valuation.institution?.name],
        ['Sector', valuation.sector],
        ['Fecha de valuación', formatDate(valuation.measuredAt)],
        ['Propietario', valuation.owner],
        ['Solicitante', valuation.applicant],
        ['Teléfono', valuation.phone],
        ['Perfil de riesgo', risks.find(risk => risk.value === valuation.riskProfile)?.label],
        ['Valor estimado (L.)', formatNumber(valuation.averageValue)],
        ['Área del terreno (V²)', formatNumber(valuation.landArea)],
        ['Área de mejoras (M²)', formatNumber(valuation.improvementArea)],
        ['Valor del terreno (L.)', formatNumber(valuation.landValue)],
        ['Relación de utilización', formatNumber(valuation.utilizationRatio)],
        ['Precio L./V²', formatNumber(valuation.averageSquareYard)],
        ['Precio L./M²', formatNumber(valuation.averageSquareMeter)],
    ] : []

    return <Dialog open onClose={onClose} className="fixed inset-0 z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
            <DialogPanel className="mx-auto w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <DialogTitle className="text-lg font-semibold">Detalle de valuación</DialogTitle>
                    <button type="button" onClick={onClose} aria-label="Cerrar detalle" title="Cerrar" className="p-2 text-gray-600"><XIcon size={20} /></button>
                </div>
                {valuation ? <>
                    <p className="mb-4 text-sm text-gray-500">Solo lectura</p>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        {fields.map(([label, value]) => <div key={label} className="min-w-0 border-b border-gray-100 pb-3">
                            <dt className="text-xs text-gray-500">{label}</dt>
                            <dd className="mt-1 break-words text-sm text-gray-900">{value || '-'}</dd>
                        </div>)}
                    </dl>
                </> : <p role="status" className="text-sm text-gray-600">La valuación no está disponible o no tiene permiso para consultarla.</p>}
            </DialogPanel>
        </div>
    </Dialog>
}
