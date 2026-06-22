import React from 'react'
import { Loader2Icon, MapPinnedIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { PreAppraisalSectorFilter } from '@/generated-types'

import { formatDate, sectorLabels } from './createFormatters'
import { PreAppraisalCreateForm } from './createTypes'

interface PreAppraisalConfigurationPanelProps {
    form: PreAppraisalCreateForm;
    readOnlyName?: string | null;
    valuationDate?: string | null;
    validationErrors: Partial<Record<keyof PreAppraisalCreateForm, string>>;
    previewLoading: boolean;
    addressAutofillLoading: boolean;
    onChange: (patch: Partial<PreAppraisalCreateForm>) => void;
    onAutofillAddress: () => void;
    onRecalculate: () => void;
}

export const PreAppraisalConfigurationPanel = ({ form, readOnlyName, valuationDate, validationErrors, previewLoading, addressAutofillLoading, onChange, onAutofillAddress, onRecalculate }: PreAppraisalConfigurationPanelProps): React.ReactElement => {
    const hasSelectedPoint = form.targetLatitude !== null && form.targetLongitude !== null

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Configuración del análisis
                </h2>
            </div>

            {readOnlyName && (
                <div className="space-y-2">
                    <Label htmlFor="preAppraisalName">Nombre</Label>
                    <Input id="preAppraisalName" value={readOnlyName} readOnly className="bg-slate-50 text-slate-600" />
                </div>
            )}

            {valuationDate && (
                <div className="space-y-2">
                    <Label htmlFor="valuationDate">Fecha de valuación</Label>
                    <Input id="valuationDate" value={formatDate(valuationDate)} readOnly className="bg-slate-50 text-slate-600" />
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="targetAddress">
                        Dirección
                    </Label>

                    {hasSelectedPoint && (
                        <Button type="button" variant="outline" size="sm" className="h-8 bg-white" onClick={onAutofillAddress} disabled={addressAutofillLoading}>
                            {addressAutofillLoading ? <Loader2Icon className="h-3.5 w-3.5 animate-spin" /> : <MapPinnedIcon className="h-3.5 w-3.5" />}
                            Autocompletar
                        </Button>
                    )}
                </div>

                <Textarea id="targetAddress" cols={2} value={form.targetAddress} onChange={(event) => onChange({ targetAddress: event.target.value })} placeholder="Dirección" />
                
                {validationErrors.targetAddress && (
                    <p className="text-xs text-red-600">
                        {validationErrors.targetAddress}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="radiusMeters">
                        Radio (Metros)
                    </Label>

                    <Input id="radiusMeters" type="number" min="1" value={form.radiusMeters} onChange={(event) => onChange({ radiusMeters: event.target.value })} />
                    
                    {validationErrors.radiusMeters && (
                        <p className="text-xs text-red-600">
                            {validationErrors.radiusMeters}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sectorFilter">
                        Sector
                    </Label>

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
