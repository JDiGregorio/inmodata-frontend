import { useState } from 'react'
import { FilterIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePropertyValuationYearsQuery } from '@/generated-types'

export function PropertyFilters({ year, onApply }: { year?: number; onApply: (year?: number) => void }) {
    const [open, setOpen] = useState(false)
    const [draft, setDraft] = useState('all')
    const { data, loading, error } = usePropertyValuationYearsQuery({ skip: !open, fetchPolicy: 'network-only' })
    const apply = (value?: number) => { onApply(value); setOpen(false) }
    return <>
        <Button variant="outline" className="h-9 gap-2" onClick={() => { setDraft(year ? String(year) : 'all'); setOpen(true) }}>
            <FilterIcon className="size-4" />Filtros{year && <span className="text-xs text-[#155a7c]">{year}</span>}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Filtros</DialogTitle><DialogDescription>Inmuebles por fecha de valuación.</DialogDescription></DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="valuation-year">Año de valuación</Label>
                    <Select value={draft} onValueChange={setDraft} disabled={loading || !!error}>
                        <SelectTrigger id="valuation-year" className="w-full"><SelectValue placeholder={draft === 'all' ? 'Todos los años' : draft} /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los años</SelectItem>
                            {(data?.propertyValuationYears ?? []).map(value => <SelectItem key={value} value={String(value)}>{value}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {loading && <p role="status" className="text-xs text-gray-500">Cargando años...</p>}
                    {error && <p role="alert" className="text-xs text-red-700">No fue posible cargar los años disponibles.</p>}
                    {!loading && !error && data?.propertyValuationYears.length === 0 && <p className="text-xs text-gray-500">No hay años de valuación disponibles.</p>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => apply()}>Limpiar filtros</Button>
                    <Button disabled={loading || !!error} onClick={() => apply(draft === 'all' ? undefined : Number(draft))}>Aplicar filtros</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}
