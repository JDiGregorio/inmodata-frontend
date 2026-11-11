import React, { useEffect, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { filter } from 'lodash'

type Styles = {
    container: string;
}

interface Identifiable {
    id: number | string;
    secondaryText?: string;
}

export interface ComboBoxProps<T extends Identifiable> {
    label?: string;
    styles?: Styles;
    options: T[];
    searchQuery?: string;
    id: string;
    placeholder?: string;
    selectedOption: T | undefined | null;
    creatable?: boolean;
    loading?: boolean;
    onChange: (item: T | null) => void;
    displayValue: (item: T) => string;
    displaySecondary?: (item: T) => string | undefined;
    onInputChange?: (query: string) => void;
    onCreate?: (inputValue: string) => void;
    onClear?: () => void;
}

export const ComboBox = <T extends Identifiable>({
    label,
    styles,
    options,
    id,
    placeholder,
    searchQuery,
    creatable = false,
    loading = false,
    selectedOption: _selectedOption,
    onCreate,
    onChange,
    onClear,
    displayValue,
    displaySecondary,
    onInputChange,
}: ComboBoxProps<T>): React.ReactElement => {
    const [query, setQuery] = useState(searchQuery ?? '')
    const [queryChanged, setQueryChanged] = useState(false)

    useEffect(() => {
        setQueryChanged(true)
        if (query.length > 0) {
            onInputChange?.(query)
        }
    }, [query, onInputChange])

    useEffect(() => {
        setQueryChanged(false)
    }, [options])

    const handleOnCreate = () => {
        onCreate?.(query)
        setQuery('')
    }

    if (query.length > 0 && !onInputChange) {
        options = filter(options, (option) => {
            const label = displayValue(option).toLowerCase()

            return label.includes(query)
        })
    }

    const handleClearSelection = () => {
        onChange(null)
        onClear?.()
    }

    return (
        <Combobox
            as="div"
            value={_selectedOption}
            className={styles?.container}
            onChange={(option: T) => {
                setQuery('')
                onChange(option)
            }}
        >
            {label && (
                <Label className="block text-sm font-medium leading-6 text-gray-900">
                    {label}
                </Label>
            )}

            <div className="relative mt-2">
                <ComboboxInput
                    id={id}
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6 placeholder:text-gray-300"
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery('')}
                    displayValue={(option: T) => {
                        return option ? displayValue(option) : ''
                    }}
                    placeholder={placeholder}
                    spellCheck={false}
                />

                {_selectedOption && (
                    <div className="absolute inset-y-0 right-5 flex items-center rounded-r-md px-2 focus:outline-none hover:cursor-pointer text-gray-400 hover:text-red-600" onClick={handleClearSelection}>
                        <XMarkIcon className="h-5 w-5 text-inherit" aria-hidden="true" />
                    </div>
                )}

                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>

                {loading && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <div className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-orange-600 data-[focus]:text-white">
                            <span className="block truncate group-data-[selected]:font-semibold">
                                Cargando...
                            </span>
                        </div>
                    </ComboboxOptions>
                )}

                {options.length > 0 && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <ComboboxOption key={option.id} value={option} className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-orange-600 data-[focus]:text-white">
                                <div className="flex items-center">
                                    <span className="block truncate group-data-[selected]:font-semibold" title={displayValue(option)}>
                                        {displayValue(option)}
                                    </span>

                                    {displaySecondary && (
                                        <span className="ml-2 truncate text-xs text-gray-500 group-data-[focus]:text-orange-100">
                                            {displaySecondary(option)}
                                        </span>
                                    )}
                                </div>

                                <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-orange-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                )}

                {options.length === 0 && creatable && query.length > 0 && !loading && !queryChanged && (
                    <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <div className="relative cursor-default select-none text-gray-900 data-[focus]:bg-orange-600 data-[focus]:text-white">
                            <div className="">
                                <div className="rounded-md bg-blue-50 px-4 py-2">
                                    <div className="flex">
                                        <div className="flex-1 md:flex md:justify-between">
                                            <div className="text-sm text-inherit">
                                                <span>No se pudo encontrar el elemento </span>
                                                <br />
                                                <b>
                                                    <span className="text-blue-700">
                                                        {`"${query.trim()}"`}
                                                    </span>
                                                </b>
                                            </div>

                                            <p className="mt-3 text-sm md:ml-6 md:mt-0 pt-2">
                                                <a onClick={() => handleOnCreate()} className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 hover:underline hover:cursor-pointer">
                                                    Crear
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ComboboxOptions>
                )}
            </div>
        </Combobox>
    )
}