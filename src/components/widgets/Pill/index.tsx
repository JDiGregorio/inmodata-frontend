import React from 'react'

interface PillProps {
    id: string;
    value: string;
    onRemove?: (key: string) => void;
}

export const Pill = ({ id, value, onRemove }: PillProps): React.ReactElement => {
    return (
        <span className="inline-flex items-center gap-x-0.5 rounded-md bg-blue-100 ml-1 mb-[1px] px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {value}
            <button type="button" onClick={() => onRemove?.(id)} className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-blue-600/20">
                <span className="sr-only">Remove</span>
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-blue-800/50 group-hover:stroke-blue-800/75">
                    <path d="M4 4l6 6m0-6l-6 6" />
                </svg>
                <span className="absolute -inset-1" />
            </button>
        </span>
    )
}