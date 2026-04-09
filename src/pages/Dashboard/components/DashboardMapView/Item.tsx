import { classNames } from '@/lib/utils'

interface ItemProps {
    label: string;
    value: string;
    capitalize?: boolean;
}

export const Item = ({ label, value, capitalize = false }: ItemProps) => {
    return (
        <div className="flex justify-between items-center rounded bg-gray-100 border border-gray-200 py-2 px-4 sm:col-span-2">
            <p className="text-sm text-gray-700">
                {label}
            </p>

            <p className={classNames("text-sm font-semibold text-gray-900", capitalize ? "capitalize" : "")}>
                {value}
            </p>
        </div>
    )
}