interface ItemProps {
    label: string;
    value: string; 
}

export const Item = ({ label, value }: ItemProps) => {
    return (
        <div className="flex justify-between items-center rounded bg-gray-100 border border-gray-200 py-2 px-4 sm:col-span-2">
            <p className="text-xs text-gray-600">
                {label}
            </p>

            <p className="text-sm font-semibold text-gray-900">
                {value}
            </p>
        </div>
    )
}