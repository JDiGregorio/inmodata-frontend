import React from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { PaginationLinks } from "./PaginationLinks"
import { PaginatorInfo } from "@/generated-types"
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { NavLink, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { LucideProps, SquarePenIcon } from "lucide-react"

const LIST_ITEMS_LENGTH = 10

export interface ModelDefinition {
    singular: string,
    plural: string
}

export interface StatDefinition {
    id: number
    name: string
    stat: number | undefined
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    bgColor: string
}

export interface ListViewProps {
    title: string
    canCreate: boolean
    canEdit: boolean
    handlePageChanged: (page: number) => void
    data: string[][]
    headers: string[]
    paginatorInfo: Pick<PaginatorInfo, 'currentPage' | 'lastPage' | 'total'>
    searchQuery: string
    setSearchQuery: (query: string) => void
    model: ModelDefinition
    stats?: StatDefinition[]
}

const ListView = ({ headers, data, model, paginatorInfo, title, searchQuery, canCreate, canEdit, stats, setSearchQuery, handlePageChanged }: ListViewProps): React.ReactElement => {
    const navigate = useNavigate()

    const tableHeaders = headers.map((header, index) => {
        const classNames = index === 0 ? 'sm:pl-6 pl-4 pr-3' : 'px-3'

        return (
            <TableHead key={`th-${index}`} scope="col" className={`py-3.5 text-left text-sm font-semibold text-gray-900 ${classNames}`}>
                {header}
            </TableHead>
        )
    })

    const tableRows = data.map((row, index) => {
        return (
            <TableRow key={`${model}-${index}`} className="even:bg-gray-50">
                {row.map((cells, index) => {
                    if (index !== 0) {
                        const style = index === 1 ? "whitespace-wrap pl-4 pr-3 font-medium text-gray-900 sm:pl-6" : "max-w-xs py-4 text-sm whitespace-wrap px-3 text-gray-500"

                        return (
                            <TableCell key={`cell-${index}`} className={`py-4 text-sm ${style}`}>
                                {cells}
                            </TableCell>
                        )
                    }
                })}

                {canEdit && (
                    <TableCell className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <NavLink to={`/${model.plural}/${row[0]}/editar`} className="flex justify-center text-orange-600 hover:text-orange-900 items-center">
                            <SquarePenIcon size={18} color="#646464" />
                        </NavLink>
                    </TableCell>
                )}
            </TableRow>
        )
    })

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6 space-y-6">
                <div className="sm:flex-auto">
                    <h1 className="text-lg font-semibold leading-5 text-gray-900">
                        {title}
                    </h1>
                </div>

                <div className="inline-block min-w-full align-middle">
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats && stats.map((item) => (
                            <div key={item.id} className="relative overflow-hidden rounded-lg bg-white px-4 shadow-sm sm:px-6 py-6">
                                <dt>
                                    <div className={`absolute rounded-md ${item.bgColor} p-3`}>
                                        <item.icon aria-hidden="true" className="size-6 text-white" />
                                    </div>

                                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                                        {item.name}
                                    </p>
                                </dt>

                                <dd className="ml-16 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {item.stat}
                                    </p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div className="sm:flex sm:items-center">
                    <div className="flex flex-1">
                        <div className="w-full max-w-lg lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">
                                Buscar
                            </label>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>

                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Buscar"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value) }}
                                />
                            </div>
                        </div>
                    </div>

                    {canCreate && (
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <Button type="button" variant={'default'} size="sm" onClick={() => navigate(`/${model.plural}/crear`)} className="cursor-pointer">
                                Añadir
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                            <Table className="min-w-full">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        {tableHeaders}

                                        <TableHead scope="col" className="w-20 relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Acciones</span>
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody className="bg-white">
                                    {data.length > 0 ? (
                                        tableRows
                                    ) : (
                                        <TableRow className="even:bg-gray-50">
                                            <TableCell colSpan={(headers.length + 1)}>
                                                <div className="relative card bg-white dark:bg-gray-700">
                                                    <div className="flex flex-col justify-center items-center px-6 py-8">
                                                        <div className="text-center">
                                                            <p className="text-base text-80 font-normal text-gray-600 dark:text-gray-400">
                                                                No hay datos que mostrar
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="overflow-hidden overflow-x-auto relative"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>

            <PaginationLinks
                itemsPerPage={LIST_ITEMS_LENGTH}
                currentPage={paginatorInfo.currentPage}
                lastPage={paginatorInfo.lastPage}
                onPageChanged={handlePageChanged}
                itemsTotal={paginatorInfo.total}
            />
        </div>
    )
}

export default ListView
