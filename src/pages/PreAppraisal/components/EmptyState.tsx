import React from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
    onCreate: () => void;
}

export const EmptyState = ({ onCreate }: EmptyStateProps): React.ReactElement => (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <h3 className="text-base font-semibold text-gray-900">
            No hay preavalúos
        </h3>

        <p className="mt-1 text-sm text-gray-500">
            Crea tu primer preavalúo desde un punto geográfico.
        </p>

        <Button type="button" className="mt-5 bg-[#155a7c] hover:bg-[#104761]" onClick={onCreate}>
            <PlusIcon className="h-4 w-4" />
            Crear preavalúo
        </Button>
    </div>
)
