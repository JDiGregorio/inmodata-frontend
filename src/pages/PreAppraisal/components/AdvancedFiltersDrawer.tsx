import React, { useEffect, useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/button'
import { DrawerContainer } from '@/components/widgets/Drawer/DrawerContainer'

import { AdvancedFiltersForm } from './AdvancedFiltersForm'
import { initialAdvancedFilters } from './constants'
import { AdvancedFilters } from './types'

interface AdvancedFiltersDrawerProps {
    open: boolean;
    filters: AdvancedFilters;
    onClose: () => void;
    onApply: (filters: AdvancedFilters) => void;
}

export const AdvancedFiltersDrawer = ({ open, filters, onClose, onApply }: AdvancedFiltersDrawerProps): React.ReactElement => {
    const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(filters)

    useEffect(() => {
        if (open) {
            setDraftFilters(filters)
        }
    }, [filters, open])

    const handleClose = () => {
        setDraftFilters(filters)
        onClose()
    }

    const handleSubmit = () => {
        onApply(draftFilters)
    }

    const handleClear = () => {
        setDraftFilters(initialAdvancedFilters)
    }

    const handleChange = (key: keyof AdvancedFilters, value: string) => {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            [key]: value
        }))
    }

    return (
        <Dialog open={open} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0" />

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
                        <DialogPanel transition className="pointer-events-auto w-screen max-w-xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
                            <div className="flex h-full flex-col overflow-hidden bg-white shadow-xl">
                                <div className="py-4 px-6 w-full flex justify-between items-center border-b border-gray-200">
                                    <p className="text-sm text-black font-medium">
                                        Filtros Avanzados
                                    </p>

                                    <Button type="button" variant="ghost" onClick={handleClose} className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-0 cursor-pointer">
                                        <span className="absolute -inset-2.5" />
                                        <span className="sr-only">Cerrar panel</span>
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                                    </Button>
                                </div>

                                <DrawerContainer footer={true} titleSubmit="Aplicar filtros" onSubmit={handleSubmit} onClose={handleClose} disabled={false}>
                                    <AdvancedFiltersForm filters={draftFilters} onChange={handleChange} onClear={handleClear} />
                                </DrawerContainer>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
