import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { riskOptions } from './constants'
import { AdvancedFilters } from './types'

interface AdvancedFiltersFormProps {
    filters: AdvancedFilters;
    onChange: (key: keyof AdvancedFilters, value: string) => void;
    onClear: () => void;
}

export const AdvancedFiltersForm = ({ filters, onChange, onClear }: AdvancedFiltersFormProps): React.ReactElement => {
    return (
        <form className="space-y-8">
            <div>
                <span className="font-normal text-sm text-gray-700">
                    Refina el listado por fechas, rangos de cálculo y perfil de riesgo esperado.
                </span>
            </div>

            <div className="space-y-6">
                <div className="relative space-y-2">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>

                    <div className="relative flex justify-start">
                        <span className="bg-gray-50 pr-3 text-base font-semibold leading-6 text-gray-900">
                            Fechas
                        </span>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="createdFrom">Creación desde</Label>
                        <Input id="createdFrom" type="date" value={filters.createdFrom} onChange={(event) => onChange('createdFrom', event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="createdTo">Creación hasta</Label>
                        <Input id="createdTo" type="date" value={filters.createdTo} onChange={(event) => onChange('createdTo', event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="generatedFrom">Generación desde</Label>
                        <Input id="generatedFrom" type="date" value={filters.generatedFrom} onChange={(event) => onChange('generatedFrom', event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="generatedTo">Generación hasta</Label>
                        <Input id="generatedTo" type="date" value={filters.generatedTo} onChange={(event) => onChange('generatedTo', event.target.value)} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative space-y-2">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>

                    <div className="relative flex justify-start">
                        <span className="bg-gray-50 pr-3 text-base font-semibold leading-6 text-gray-900">
                            Rangos
                        </span>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="radiusMin">Radio mínimo</Label>
                        <Input id="radiusMin" type="number" min="0" value={filters.radiusMin} onChange={(event) => onChange('radiusMin', event.target.value)} placeholder="0" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="radiusMax">Radio máximo</Label>
                        <Input id="radiusMax" type="number" min="0" value={filters.radiusMax} onChange={(event) => onChange('radiusMax', event.target.value)} placeholder="0" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recommendedPriceMin">Precio recomendado mínimo</Label>
                        <Input id="recommendedPriceMin" type="number" min="0" value={filters.recommendedPriceMin} onChange={(event) => onChange('recommendedPriceMin', event.target.value)} placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recommendedPriceMax">Precio recomendado máximo</Label>
                        <Input id="recommendedPriceMax" type="number" min="0" value={filters.recommendedPriceMax} onChange={(event) => onChange('recommendedPriceMax', event.target.value)} placeholder="0.00" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sampleCountMin">Muestras mínimas</Label>
                        <Input id="sampleCountMin" type="number" min="0" value={filters.sampleCountMin} onChange={(event) => onChange('sampleCountMin', event.target.value)} placeholder="0" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sampleCountMax">Muestras máximas</Label>
                        <Input id="sampleCountMax" type="number" min="0" value={filters.sampleCountMax} onChange={(event) => onChange('sampleCountMax', event.target.value)} placeholder="0" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative space-y-2">
                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>

                    <div className="relative flex justify-start">
                        <span className="bg-gray-50 pr-3 text-base font-semibold leading-6 text-gray-900">
                            Riesgo
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="expectedRiskProfile">Riesgo esperado</Label>
                    <Select value={filters.expectedRiskProfile} onValueChange={(value) => onChange('expectedRiskProfile', value)}>
                        <SelectTrigger id="expectedRiskProfile" className="w-full bg-white">
                            <SelectValue placeholder="Riesgo esperado" />
                        </SelectTrigger>

                        <SelectContent>
                            {riskOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="button" variant="outline" className="bg-white" onClick={onClear}>
                Limpiar filtros
            </Button>
        </form>
    )
}
