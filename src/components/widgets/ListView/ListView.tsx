import React, { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { LucideProps, SquarePenIcon } from 'lucide-react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { PaginationLinks } from './PaginationLinks'
import { Button } from '@/components/ui/button'

import { classNames } from '@/lib/utils'
import { alignClass, caseClass, ellipsis, colStyle } from './ListView.helpers'

import { ModelDefinition, Header, DataRow, RowAction } from './ListView.types'
import { PaginatorInfo } from '@/generated-types'

const LIST_ITEMS_LENGTH = 10

export interface StatDefinition {
    id: number;
    name: string;
    stat: number | undefined;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    bgColor: string;
}

export interface ListViewProps<T> {
    model: ModelDefinition;
    stats?: StatDefinition[];
    title: string;
    toolbarActions?: ReactNode;
    canCreate: boolean;
    canEdit: boolean;
    headers: Header[];
    rowActions?: RowAction<T>[];
    data: DataRow<T>[];
    searchQuery: string;
    paginatorInfo: Pick<PaginatorInfo, 'currentPage' | 'lastPage' | 'total'>;
    setSearchQuery: (query: string) => void;
    handlePageChanged: (page: number) => void;
}

const ListView = <T,> ({ model, stats, title, toolbarActions, canCreate, canEdit, headers, rowActions, data, paginatorInfo,  searchQuery, setSearchQuery, handlePageChanged }: ListViewProps<T>): React.ReactElement => {
    const navigate = useNavigate()

    const tableHeaders = headers.map((header, index) => {
        return (
            <TableHead key={`th-${index}`} scope="col" className={`px-4 py-2 text-xs text-black font-medium uppercase ${alignClass(header.align)} ${ellipsis}`}>
               {header.label}
            </TableHead>
        )
    })

    const tableRows = data.map((row, index) => {
        return (
            <TableRow key={`${model}-${index}`} className="even:bg-gray-50">
                {headers.map(header =>  {
                    const raw = row.values[header.key]
                    const prefix = typeof header.prefix === "function" ? header.prefix(raw, row.values) : (header.prefix ?? "")
                    const suffix = typeof header.suffix === "function" ? header.suffix(raw, row.values) : (header.suffix ?? "")
                    const display = `${prefix ?? ""}${raw ?? ""}${suffix ?? ""}`

                    return (
                        <TableCell
                            key={header.key}
                            style={colStyle(header)}
                            className={classNames(
                                "px-4 py-2 text-[0.8rem] text-gray-800 font-normal",
                                ellipsis,
                                alignClass(header.align),
                                caseClass(header.textCase)
                            )}
                            title={String(display)}
                        >
                            {display}
                        </TableCell>
                    )
                })}

                <TableCell className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-center gap-2">
                        {rowActions?.map((action) => (
                            <React.Fragment key={action.key}>
                                {action.content(row)}
                            </React.Fragment>
                        ))}

                        {canEdit && (
                            <NavLink to={`/${model.plural}/${row.values.id}/editar`} className="flex justify-center text-orange-600 hover:text-orange-900 items-center" title="Editar">
                                <SquarePenIcon size={18} color="#646464" />
                            </NavLink>
                        )}
                    </div>
                </TableCell>
            </TableRow>
        )
    })

    return (
        <>
            <div className="space-y-6">
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
                    
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-3">
                        {toolbarActions}

                        {canCreate && (
                            <Button type="button" variant={'default'} size="default" onClick={() => navigate(`/${model.plural}/crear`)} className="bg-green-700 hover:bg-green-900 cursor-pointer">
                                Añadir
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                            <Table className="min-w-full table-fixed overflow-hidden">
                                <colgroup>
                                    {headers.map(header => (
                                        <col key={header.key} style={colStyle(header)} />
                                    ))}

                                    <col key="col-__options" style={{ width: "120px" }} />
                                </colgroup>

                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        {tableHeaders}

                                        <TableHead scope="col" className="px-4 py-2 text-xs text-black text-center font-medium uppercase whitespace-nowrap">
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
        </>
    )
}

export default ListView
