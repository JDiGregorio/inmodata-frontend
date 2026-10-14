import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { SelectMultiple } from '@/components/widgets/SelectMultiple/SelectMultiple'
import { useListInstitutionsQuery } from '@/generated-types'
import { useDebounce } from '@/utils/useDebounce'

export type SelectedInstitution = { id: string; name: string }

type Props = {
    value: SelectedInstitution[];
    onChange: (institutions: SelectedInstitution[]) => void;
}

export function InstitutionsField({ value, onChange }: Props) {
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)
    const { data, loading, error } = useListInstitutionsQuery({
        variables: { first: 20, search: debouncedSearch },
        fetchPolicy: 'network-only'
    })

    return (
        <div className="sm:col-span-6 space-y-2">
            <Label>
                Instituciones
            </Label>

            <SelectMultiple
                searchPlaceholder="Buscar instituciones..."
                options={data?.institutions?.data ?? []}
                selectedOptions={value}
                loading={loading}
                onInputChange={setSearch}
                displayValue={(institution) => institution.name}
                onOptionDelete={(id) => onChange(value.filter((institution) => institution.id !== id))}
                onOptionSelected={(institution) => {
                    if (!value.some((selected) => selected.id === institution.id)) {
                        onChange([...value, institution])
                    }
                }}
            />
            
            {error && (
                <p role="alert" className="text-sm text-red-600">
                    No fue posible cargar las instituciones.
                </p>
            )}
        </div>
    )
}
