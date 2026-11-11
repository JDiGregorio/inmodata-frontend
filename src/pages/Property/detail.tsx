import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import TabsPanel from '@/components/widgets/TabsPanel/TabsPanel'
import Spinner from '@/components/layouts/Spinner'
import { usePermissions } from '@/hooks/usePermissions'
import { Property, useGetPropertyByIdQuery } from '@/generated-types'
import Page404 from '../404'
import { ValuationsTable } from './components/ValuationsTable'
import { ValuationDetailModal } from './components/ValuationDetailModal'
import { ValuationHistoryDashboard } from './components/ValuationHistoryDashboard'
import { PropertyMapLink } from './components/PropertyMapLink'
import { InmuebleMapPreview } from './components/InmuebleMapPreview'
import { isValidLatLng } from '@/lib/utils'

export default function PropertyDetail() {
    const { id } = useParams()
    const permissions = usePermissions()
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const canViewValuations = permissions.canView('valuation')
    const { data, loading, error } = useGetPropertyByIdQuery({
        variables: { id: id!, includeValuations: canViewValuations }, fetchPolicy: 'network-only', skip: !id,
    })
    if (loading) return <Spinner />
    if (error) return <p role="alert" className="p-6 text-sm text-red-700">No fue posible consultar el inmueble.</p>
    if (!data?.propertyById) return <Page404 />
    const property = data.propertyById as Property
    const valuationId = params.get('valuation')
    const openValuation = (value?: string) => {
        const next = new URLSearchParams(params)
        if (value) next.set('valuation', value)
        else next.delete('valuation')
        navigate({ pathname: location.pathname, search: next.toString(), hash: '#valuaciones' }, { replace: true })
    }
    const fields = [
        ['Referencia', property.name], ['Clave Catastral', property.cadastralKey],
        ['Dirección', property.exactAddress], ['Latitud', property.latitude], ['Longitud', property.longitude],
    ]
    return <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <TabsPanel tabs={[
            { view: true, name: 'Información General', hash: '#informacion-general', active: true,
                content: <section className="mx-auto max-w-3xl py-8">
                    <h1 className="text-base font-semibold text-gray-900">Información General</h1>
                    <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        {fields.map(([label, value]) => <div key={String(label)} className={`min-w-0 border-b border-gray-100 pb-4 ${label === 'Dirección' ? 'sm:col-span-2' : ''}`}>
                            <dt className="text-sm text-gray-500">{label}</dt>
                            <dd className="mt-1 break-words text-sm text-gray-900">{value ?? '-'}</dd>
                        </div>)}
                    </dl>
                    <div className="mt-6">
                        <h2 className="mb-3 text-sm font-medium text-gray-900">Mapa de ubicación</h2>
                        <InmuebleMapPreview readOnly currentPropertyId={property.id}
                            latitude={property.latitude} longitude={property.longitude}
                            hasPoint={isValidLatLng(property.latitude, property.longitude)} />
                    </div>
                </section> },
            ...(canViewValuations ? [{ view: true, name: 'Valuaciones', hash: '#valuaciones', active: true,
                content: <div className="mt-6 px-4 py-5">
                    <ValuationHistoryDashboard history={property.valuationHistory} />
                    <ValuationsTable property={property} valuations={property.valuations} canCreate={false} canEdit={false} onView={valuation => openValuation(valuation.id)} />
                    {valuationId && <ValuationDetailModal valuation={property.valuations?.find(value => value?.id === valuationId) ?? undefined} onClose={() => openValuation()} />}
                </div> }] : []),
        ]} actions={<PropertyMapLink property={property} />} />
    </div>
}
