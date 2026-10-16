import { useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const OPTIONS = gql`
    query PreAppraisalInstitutionOptions {
        preAppraisalInstitutionOptions {
            canSelectNone
            institutions { id name }
        }
    }
`

type Props = {
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    preserveUnassigned?: boolean;
}

export function PreAppraisalInstitutionSelect({ value, onChange, preserveUnassigned = false }: Props) {
    const { data, loading, error, refetch } = useQuery<{
        preAppraisalInstitutionOptions: { canSelectNone: boolean; institutions: { id: string; name: string }[] };
    }>(OPTIONS)
    const options = data?.preAppraisalInstitutionOptions

    useEffect(() => {
        if (value !== undefined || !options) return
        if (options.canSelectNone) onChange(null)
        else if (options.institutions.length === 1) onChange(options.institutions[0].id)
    }, [value, options, onChange])

    return <div className="space-y-2">
        <Label htmlFor="preAppraisalInstitution">Institución</Label>
        <Select value={value === null ? 'none' : value ?? ''} onValueChange={id => onChange(id === 'none' ? null : id)} disabled={loading || !!error}>
            <SelectTrigger id="preAppraisalInstitution" className="w-full bg-white">
                <SelectValue placeholder={loading ? 'Cargando...' : 'Seleccionar institución'} />
            </SelectTrigger>
            <SelectContent>
                {(options?.canSelectNone || preserveUnassigned) && <SelectItem value="none">Sin institución</SelectItem>}
                {options?.institutions.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
            </SelectContent>
        </Select>
        {error && <Button type="button" variant="outline" onClick={() => void refetch()}>Reintentar cargar instituciones</Button>}
    </div>
}
