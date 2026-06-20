import React from 'react'
import { RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { PreAppraisalSectorFilter } from '@/generated-types'

import { sectorLabels } from './createFormatters'
import { PreAppraisalCreateForm } from './createTypes'

interface PreAppraisalConfigurationPanelProps {
    form: PreAppraisalCreateForm;
    validationErrors: Partial<Record<keyof PreAppraisalCreateForm, string>>;
    previewLoading: boolean;
    onChange: (patch: Partial<PreAppraisalCreateForm>) => void;
    onRecalculate: () => void;
}

export const PreAppraisalConfigurationPanel = ({ form, validationErrors, previewLoading, onChange, onRecalculate }: PreAppraisalConfigurationPanelProps): React.ReactElement => {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Configuración del análisis
                </h2>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Nombre de Referencia</Label>
                <Input id="name" value={form.name} onChange={(event) => onChange({ name: event.target.value })} placeholder="PRE-2026-006" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="targetAddress">Dirección</Label>
                <Input id="targetAddress" value={form.targetAddress} onChange={(event) => onChange({ targetAddress: event.target.value })} placeholder="Colonia Escalón, San Salvador" />
                {validationErrors.targetAddress && <p className="text-xs text-red-600">{validationErrors.targetAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="radiusMeters">Radio (Metros)</Label>
                    <Input id="radiusMeters" type="number" min="1" value={form.radiusMeters} onChange={(event) => onChange({ radiusMeters: event.target.value })} />
                    {validationErrors.radiusMeters && <p className="text-xs text-red-600">{validationErrors.radiusMeters}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sectorFilter">Sector</Label>
                    <Select value={form.sectorFilter} onValueChange={(value) => onChange({ sectorFilter: value })}>
                        <SelectTrigger id="sectorFilter" className="w-full bg-white">
                            <SelectValue placeholder="Sector" />
                        </SelectTrigger>

                        <SelectContent>
                            {Object.values(PreAppraisalSectorFilter).map((sector) => (
                                <SelectItem key={sector} value={sector}>
                                    {sectorLabels[sector]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="valuationDate">Fecha de Análisis</Label>
                <Input id="valuationDate" type="date" value={form.valuationDate} onChange={(event) => onChange({ valuationDate: event.target.value })} />
                {validationErrors.valuationDate && <p className="text-xs text-red-600">{validationErrors.valuationDate}</p>}
            </div>

            {validationErrors.targetLatitude && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
                    {validationErrors.targetLatitude}
                </p>
            )}

            <Button type="button" className="w-full bg-[#155a7c] hover:bg-[#104761]" onClick={onRecalculate} disabled={previewLoading}>
                <RefreshCwIcon className={previewLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                Recalcular Muestra
            </Button>
        </div>
    )
}
