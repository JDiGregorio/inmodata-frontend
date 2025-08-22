import { ReactNode } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { classNames } from '@/lib/utils'

interface DrawerContainerProps {
    children: ReactNode
    disabled: boolean
    footer?: boolean
    titleSubmit?: string
    titleSubmitting?: string
    canDelete?: boolean
    onDelete?: () => void
    onClose: () => void
    onSubmit: () => void
}

export const DrawerContainer = ({ children, disabled, footer = false, titleSubmit = "Guardar", titleSubmitting = "Guardando...", canDelete = false, onDelete, onClose, onSubmit }: DrawerContainerProps) => {
    return (
        <>
            <div className="mx-auto w-full flex-grow overflow-y-hidden">
                <div className="h-full">
                    <ScrollArea className="h-full bg-gray-50">
                        <div className="p-8 pb-10">{children}</div>
                    </ScrollArea>
                </div>
            </div>

            {footer && (
                <div className="border-t border-gray-200 h-16">
                    <div className={classNames(canDelete ? "justify-between" : "justify-end", "flex flex-shrink-0 px-4 py-4")}>
                        {canDelete && (
                            <Button type="button" variant={'ghost'} size={'sm'} className={'w-auto px-4 hover:bg-red-600 hover:text-white'} onClick={onDelete}>
                                Eliminar
                            </Button>
                        )}

                        <div className="flex justify-between space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                            >
                                Cancelar
                            </button>

                            <Button 
                                type="button"
                                variant={"default"}
                                size={'sm'}
                                className="w-auto"
                                onClick={onSubmit}
                                disabled={disabled}
                            >
                                {disabled && <Loader2 aria-hidden="true" className="animate-spin -ml-0.5 mr-1.5 h-5 w-5" />}
                                {disabled ? titleSubmitting : titleSubmit}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}