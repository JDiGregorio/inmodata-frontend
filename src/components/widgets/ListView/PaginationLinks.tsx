import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"
import React, { useEffect, useState } from "react"

interface PaginationLinksProps {
    itemsPerPage: number;
    itemsTotal: number;
    currentPage: number;
    lastPage: number;
    onPageChanged: (page: number) => void;
}

export function PaginationLinks({ currentPage, itemsPerPage, itemsTotal, lastPage, onPageChanged }: PaginationLinksProps) {
    const [curPage, setCurrentPage] = useState<string | number>(1)
    const recordsFrom = ((currentPage - 1) * itemsPerPage) + 1
    const recordsTo = currentPage < lastPage ? (currentPage * itemsPerPage) : itemsTotal

    useEffect(() => {
        setCurrentPage(currentPage)
    }, [currentPage])

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const inputValue = event.target.value
        const newValue = inputValue ? parseInt( inputValue) : ''
        setCurrentPage(newValue)
    }

    const onBlurHandler = (): void => {
        if (!curPage) {
            setCurrentPage(currentPage)
            return;
        }

        if (curPage != currentPage) {
            onPageChanged(parseInt(`${curPage}`))
        }
    }

    const onFirstHandler = (): void => {
        onPageChanged(1)
    }

    const onPreviousHandler = (): void => {
        if (currentPage > 1) {
            onPageChanged(currentPage - 1)
        }
    } 

    const onLastHandler = (): void => {
        onPageChanged(lastPage)
    }

    const onNextHandler = (): void => {
        if (currentPage < lastPage) {
            onPageChanged(currentPage + 1)
        }
    }

    return (
        <nav className="flex items-center justify-between px-4 sm:px-0 mt-4">
            <div>
                <p className="text-sm text-gray-700">
                    Mostrando del <span className="font-medium">{ recordsFrom }</span> al <span className="font-medium">{ recordsTo }</span> de{' '}
                    <span className="font-medium">{ itemsTotal }</span> resultados
                </p>
            </div>

            <div className="hidden md:-mt-px md:flex">
                <Button type="button" variant={"link"} className="p-2 cursor-pointer" onClick={onFirstHandler}>
                    <ChevronFirst className="mr-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Button>

                <Button type="button" variant={"link"} className="p-2 cursor-pointer" onClick={onPreviousHandler}>
                    <ChevronLeft className="mr-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Button>

                <div>
                    <Input
                        id="currentPage"
                        name="currentPage"
                        value={curPage}
                        onBlur={onBlurHandler}
                        onChange={onChangeHandler}
                        className="w-11"
                    />
                </div>

                <span className="leading-9 pl-2 text-sm" >
                    de {lastPage}
                </span>

                <Button type="button" variant={"link"} className="p-2 cursor-pointer" onClick={onNextHandler}>
                    <ChevronRight className="mr-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Button>

                <Button type="button" variant={"link"} className="p-2 cursor-pointer" onClick={onLastHandler}>
                    <ChevronLast className="mr-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Button>

            </div>
        </nav>
    )
}