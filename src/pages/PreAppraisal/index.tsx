import React, { useMemo, useState } from 'react'
import { FilterIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import Spinner from '@/components/layouts/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaginationLinks } from '@/components/widgets/ListView/PaginationLinks'

import { useDebounce } from '@/utils/useDebounce'

import {
    PreAppraisalOrderField,
    SortDirection,
    useListPreAppraisalsQuery
} from '@/generated-types'

import { AdvancedFiltersDrawer } from './components/AdvancedFiltersDrawer'
import { Badge } from './components/Badge'
import { EmptyState } from './components/EmptyState'
import { RowActions } from './components/RowActions'
import {
    CREATE_PATH,
    ITEMS_PER_PAGE,
    initialAdvancedFilters,
    sectorOptions,
    statusMeta,
    statusOptions
} from './components/constants'
import { buildFilter, countActiveAdvancedFilters, getDisplayAddress } from './components/helpers'
import { AdvancedFilters, SectorFilter, StatusFilter } from './components/types'

const PreAppraisalsIndexView = (): React.ReactElement => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState<StatusFilter>('all')
    const [sectorFilter, setSectorFilter] = useState<SectorFilter>('all')
    const [advancedFiltersDrawerOpen, setAdvancedFiltersDrawerOpen] = useState(false)
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(initialAdvancedFilters)
    const debouncedSearchTerm = useDebounce(searchQuery, 500)
    const activeAdvancedFilters = countActiveAdvancedFilters(advancedFilters)

    const filter = useMemo(() => {
        return buildFilter(debouncedSearchTerm, status, sectorFilter, advancedFilters)
    }, [advancedFilters, debouncedSearchTerm, sectorFilter, status])

    const { data, loading, error } = useListPreAppraisalsQuery({
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        variables: {
            first: ITEMS_PER_PAGE,
            page: currentPage,
            filter,
            orderBy: [
                {
                    field: PreAppraisalOrderField.CreatedAt,
                    direction: SortDirection.Desc
                }
            ]
        }
    })

    const preAppraisals = data?.preAppraisals.data ?? []
    const paginatorInfo = data?.preAppraisals.paginatorInfo

    const handleCreate = () => {
        navigate(CREATE_PATH)
    }

    const handleSearchChanged = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    const handleStatusChanged = (value: StatusFilter) => {
        setStatus(value)
        setCurrentPage(1)
    }

    const handleSectorChanged = (value: SectorFilter) => {
        setSectorFilter(value)
        setCurrentPage(1)
    }

    const handleApplyAdvancedFilters = (filters: AdvancedFilters) => {
        setAdvancedFilters(filters)
        setCurrentPage(1)
        setAdvancedFiltersDrawerOpen(false)
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="sm:flex-auto">
                        <h1 className="text-lg font-semibold leading-5 text-gray-900">
                            Preavalúos
                        </h1>
                    </div>

                    <Button type="button" variant="default" size="default" className="bg-[#155a7c] hover:bg-[#104761] cursor-pointer" onClick={handleCreate}>
                        <PlusIcon className="h-4 w-4" />
                        Crear preavalúo
                    </Button>
                </div>

                <div className="mt-8 pointer-events-auto rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
                    <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1fr)_11rem_11rem_auto]">
                        <div className="relative">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                            <Input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => handleSearchChanged(event.target.value)}
                                className="h-10 bg-white pl-10"
                                placeholder="Buscar"
                            />
                        </div>

                        <Select value={status} onValueChange={(value) => handleStatusChanged(value as StatusFilter)}>
                            <SelectTrigger className="h-10 w-full bg-white">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>

                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sectorFilter} onValueChange={(value) => handleSectorChanged(value as SectorFilter)}>
                            <SelectTrigger className="h-10 w-full bg-white">
                                <SelectValue placeholder="Sector" />
                            </SelectTrigger>

                            <SelectContent>
                                {sectorOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 justify-center bg-white"
                            onClick={() => setAdvancedFiltersDrawerOpen(true)}
                        >
                            <FilterIcon className="h-4 w-4" />
                            Filtros avanzados
                            {activeAdvancedFilters > 0 && (
                                <span className="ml-1 rounded-full bg-[#155a7c] px-2 py-0.5 text-xs font-medium text-white">
                                    {activeAdvancedFilters}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-t-lg bg-white">
                    {error ? (
                        <div className="px-6 py-12 text-center">
                            <h3 className="text-base font-semibold text-gray-900">
                                Oops, algo salió mal.
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No pudimos cargar los preavalúos. Intenta nuevamente.
                            </p>
                        </div>
                    ) : loading && !data ? (
                        <div className="py-16">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="flow-root">
                                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <div className="overflow-hidden border border-gray-200 outline-1 outline-black/5 sm:rounded-lg">
                                            <Table className="min-w-[1050px] table-fixed">
                                                <colgroup>
                                                    <col className="w-[10rem]" />
                                                    <col className="w-[14rem]" />
                                                    <col className="w-[7rem]" />
                                                    <col className="w-[7rem]" />
                                                    <col className="w-[10rem]" />
                                                    <col className="w-[6rem]" />
                                                </colgroup>

                                                <TableHeader className="bg-gray-50">
                                                    <TableRow>
                                                        <TableHead className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Referencia</TableHead>
                                                        <TableHead className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Dirección</TableHead>
                                                        <TableHead className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Radio</TableHead>
                                                        <TableHead className="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Muestras</TableHead>
                                                        <TableHead className="px-4 py-3 text-xs font-medium uppercase text-slate-500">Estado</TableHead>
                                                        <TableHead className="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody className="bg-white">
                                                    {preAppraisals.length > 0 ? preAppraisals.map((preAppraisal) => {
                                                        const status = statusMeta[preAppraisal.status]

                                                        return (
                                                            <TableRow key={preAppraisal.id} className="hover:bg-gray-50">
                                                                <TableCell className="px-4 py-4 align-top text-sm font-medium text-[#155a7c]">
                                                                    {preAppraisal.reference || preAppraisal.uuid}
                                                                </TableCell>

                                                                <TableCell className="px-4 py-4 align-top">
                                                                    <div className="max-w-[17rem]">
                                                                        {preAppraisal.name && (
                                                                            <p className="truncate text-sm font-medium text-gray-900" title={preAppraisal.name}>
                                                                                {preAppraisal.name}
                                                                            </p>
                                                                        )}
                                                                        <p className="whitespace-normal text-sm leading-5 text-gray-700" title={getDisplayAddress(preAppraisal)}>
                                                                            {getDisplayAddress(preAppraisal)}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>

                                                                <TableCell className="px-4 py-4 align-top text-sm text-gray-700">
                                                                    {preAppraisal.radiusMeters}m
                                                                </TableCell>

                                                                <TableCell className="px-4 py-4 text-center align-top text-sm text-gray-700">
                                                                    {preAppraisal.sampleCount}
                                                                </TableCell>

                                                                <TableCell className="px-4 py-4 align-top">
                                                                    <Badge className={status.className}>
                                                                        {status.label}
                                                                    </Badge>
                                                                </TableCell>

                                                                <TableCell className="px-4 py-4 text-center align-top">
                                                                    <RowActions preAppraisal={preAppraisal} />
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    }) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6}>
                                                                <EmptyState onCreate={handleCreate} />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {paginatorInfo && (
                                <PaginationLinks
                                    itemsPerPage={ITEMS_PER_PAGE}
                                    currentPage={paginatorInfo.currentPage}
                                    lastPage={paginatorInfo.lastPage}
                                    itemsTotal={paginatorInfo.total}
                                    onPageChanged={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>

                <AdvancedFiltersDrawer
                    open={advancedFiltersDrawerOpen}
                    filters={advancedFilters}
                    onClose={() => setAdvancedFiltersDrawerOpen(false)}
                    onApply={handleApplyAdvancedFilters}
                />
            </div>
        </div>
    )
}

export default PreAppraisalsIndexView
