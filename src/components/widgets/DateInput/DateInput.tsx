import React from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export interface DateInputProps {
    id: string;
    value: Date | undefined | string;
    onChange: (date: string | undefined) => void;
    placeholder?: string;
    disabled?: (date: Date) => boolean;
}

export const DateInput = ({ id, value, placeholder, disabled, onChange }: DateInputProps): React.ReactElement => {
    const [open, setOpen] = React.useState(false)

    if (typeof value === 'string') {
        const fechaString = value
        const [year, month, day] = fechaString.split('-').map(Number)
        const fecha = new Date(year, month - 1, day)

        value = fecha
    }

    const handleOnChange = (date: Date | undefined | string) => {
        if (date && date instanceof Date) {
            date = format(date, 'yyyy-MM-dd')
        }

        onChange(date)
        setOpen(false)
    }

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" id={id} className={cn('w-full pl-3 text-left font-normal')}>
                        {value ? format(value, 'dd/LL/yyyy') : <span className="text-gray-300">{placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="z-50 overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        captionLayout="dropdown"
                        onSelect={handleOnChange}
                        disabled={disabled}
                        locale={es}
                        defaultMonth={value}
                        className="w-full"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

