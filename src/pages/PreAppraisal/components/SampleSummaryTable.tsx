import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDistance } from './createFormatters'

const SAMPLE_LINKS = gql`
    query PreAppraisalSampleLinks($valuationIds: [ID!]!) {
        preAppraisalSampleLinks(valuationIds: $valuationIds) {
            valuationId
            propertyId
        }
    }
`

type Sample = {
    propertyId?: string | null;
    propertyValuationId?: string | null;
    valuationReference?: string | null;
    exactAddress?: string | null;
    measuredAt?: string | null;
    distanceMeters?: number | null;
}

export function SampleSummaryTable({ samples }: { samples: Sample[] }) {
    const valuationIds = [...new Set(samples.flatMap(sample => sample.propertyValuationId ? [sample.propertyValuationId] : []))]
    const { data, loading, error } = useQuery<{
        preAppraisalSampleLinks: { valuationId: string; propertyId: string }[];
    }>(SAMPLE_LINKS, { variables: { valuationIds }, skip: valuationIds.length === 0, fetchPolicy: 'no-cache' })
    const links = new Map((!loading && !error ? data?.preAppraisalSampleLinks ?? [] : [])
        .map(link => [link.valuationId, link.propertyId]))

    return <>
        {error && <p role="status" className="px-3 py-2 text-sm text-gray-500">No fue posible verificar el acceso a las valuaciones.</p>}
        <Table className="w-full table-fixed">
            <TableHeader className="bg-[#155a7c]">
                <TableRow>
                    {['Referencia', 'Dirección del inmueble', 'Fecha de valuación', 'Distancia'].map(label =>
                        <TableHead key={label} className="whitespace-normal px-2 py-2 text-xs font-medium text-white sm:px-3">{label}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {samples.map((sample, index) => {
                    const propertyId = sample.propertyValuationId ? links.get(sample.propertyValuationId) : undefined
                    const canOpen = propertyId && propertyId === sample.propertyId
                    return <TableRow key={`${sample.propertyValuationId ?? 'sample'}-${index}`}>
                        <TableCell className="break-words whitespace-normal px-2 py-2 text-xs sm:px-3">
                            {canOpen ? <Link target="_blank" rel="noopener noreferrer"
                                className="font-medium text-[#155a7c] underline underline-offset-2"
                                to={`/inmuebles/${encodeURIComponent(propertyId)}/editar?valuation=${encodeURIComponent(sample.propertyValuationId!)}#valuaciones`}>
                                {sample.valuationReference || '-'}
                            </Link> : sample.valuationReference || '-'}
                        </TableCell>
                        <TableCell className="break-words whitespace-normal px-2 py-2 text-xs sm:px-3">{sample.exactAddress || '-'}</TableCell>
                        <TableCell className="px-2 py-2 text-xs sm:px-3">{formatDate(sample.measuredAt)}</TableCell>
                        <TableCell className="break-words whitespace-normal px-2 py-2 text-xs sm:px-3">{formatDistance(sample.distanceMeters)}</TableCell>
                    </TableRow>
                })}
                {samples.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center">No hay propiedades dentro de la muestra.</TableCell></TableRow>}
            </TableBody>
        </Table>
    </>
}
