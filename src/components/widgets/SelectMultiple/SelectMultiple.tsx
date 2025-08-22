import { ReactElement, useState } from 'react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { PopoverAnchor } from '@radix-ui/react-popover'
import { CommandLoading } from 'cmdk'
import { differenceBy } from 'lodash'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Pill } from '../Pill'

interface Identifiable {
    id: string
}

interface SelectMultipleProps<T> {
    searchPlaceholder: string
    emptyMessage?: string
    options: T[]
    selectedOptions: T[] | undefined | null
    loading?: boolean
    onInputChange: (query: string) => void
    displayValue: (item: T) => string
    onOptionDelete: (id: string) => void
    onOptionSelected: (item: T) => void
}

export const SelectMultiple = <T extends Identifiable>({
    searchPlaceholder,
    emptyMessage,
    options,
    selectedOptions,
    loading = false,
    onInputChange,
    displayValue,
    onOptionDelete,
    onOptionSelected,
}: SelectMultipleProps<T>): ReactElement => {
    const [open, setOpen] = useState(false)

    const filteredOptions = selectedOptions ? differenceBy(options, selectedOptions, 'id') : options

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div aria-expanded={open} className="bg-white ring-1 ring-inset ring-gray-300 rounded-md p-1 flex flex-row">
                <div className="flex-grow">{selectedOptions?.map((option) => <Pill value={displayValue(option)} id={option.id} key={option.id} onRemove={onOptionDelete} />)}</div>
                <div className="flex justify-center items-center pr-1">
                    <PopoverTrigger asChild>
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400 hover:cursor-pointer" aria-hidden="true" />
                    </PopoverTrigger>
                </div>
            </div>
            <PopoverAnchor />

            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onInputChange} />
                    <CommandList>
                        {loading && <CommandLoading>Cargando..</CommandLoading>}
                        <CommandEmpty>{emptyMessage ? emptyMessage : 'Sin resultados.'}</CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.id}
                                    onSelect={() => {
                                        onOptionSelected(option)
                                        setOpen(false)
                                    }}
                                >
                                    {displayValue(option)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}