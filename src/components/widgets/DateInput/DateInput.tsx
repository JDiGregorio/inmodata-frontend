import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import React from 'react'

export interface DateInputProps {
    value: Date | undefined | string
    onChange: (date: string | undefined) => void
    placeholder?: string
    disabled?: (date: Date) => boolean
}

export const DateInput = ({ value, placeholder, disabled, onChange }: DateInputProps): React.ReactElement => {
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
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !value && 'text-muted-foreground')}>
                        {value ? format(value, 'dd/LL/yyyy') : <span>{placeholder}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={value} onSelect={handleOnChange} disabled={disabled} locale={es} defaultMonth={value} />
                </PopoverContent>
            </Popover>
        </>
    )
}
