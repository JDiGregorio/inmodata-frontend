import { ReactNode, useId } from 'react'

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
    const id = useId()
    return <span className="group relative inline-flex" aria-describedby={id}>
        {children}
        <span id={id} role="tooltip" className="pointer-events-none absolute left-0 top-full z-50 mt-1 hidden whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs font-normal text-white group-hover:block group-focus-within:block">{content}</span>
    </span>
}
