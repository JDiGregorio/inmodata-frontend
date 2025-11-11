'use client'
import React from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XIcon } from 'lucide-react'
import type { AxiosError } from 'axios'

import { ExcelImportUploader } from './ExcelImportUploader'
import { Button } from '@/components/ui/button'
import { toast } from '@/utils/toast'

type ImportModalProps = {
    open: boolean;
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ImportModal = ({ open, setModalOpen }: ImportModalProps): React.ReactElement => {
    const handleUploaded = (response: any) => {
        toast.success(response?.message || 'Archivo importado correctamente.')
        setModalOpen(false)
    }

    const handleError = (error: AxiosError | Error) => {
        if ('response' in error && error.response) {
            const msg = (error.response.data as any)?.message || `Error ${error.response.status} al importar el archivo.`
            toast.error(msg)
        } else {
            toast.error('Ocurrió un error al importar el archivo.')
        }
    }

    return (
        <Dialog open={open} onClose={(value) => setModalOpen(value)} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
                    <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100">
                        <DialogTitle className="text-base font-semibold text-gray-900">
                            Importar Inmuebles
                        </DialogTitle>

                        <Button type="button" onClick={() => setModalOpen(false)} size="icon" className="py-1 px-2 bg-white shadow-none hover:bg-transparent cursor-pointer">
                            <span className="sr-only">Remove</span>
                            <XIcon size={18} color="#646464" />
                        </Button>
                    </div>

                    <div className="px-4 py-6">
                        <ExcelImportUploader
                            onUploaded={handleUploaded}
                            onError={handleError}
                        />
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}