import React, { useState } from 'react'
import { ChevronDownIcon, DownloadIcon, UploadIcon } from 'lucide-react'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import moment from 'moment'

import { HandleRefetchingProps, SearchableTable } from '@/components/widgets/ListView/SearchableTable'
import { ImportModal } from './components/ImportModal'

import { defineModel } from '@/utils/modelUtils'
import { PermissionHelpers, usePermissions } from '@/hooks/usePermissions'
import { useDownloadTemplate } from './components/useDownloadTemplate'

import type { Header } from '@/components/widgets/ListView/ListView.types'
import {
    RiskAggregates,
    Property,
    useListPropertiesQuery,
} from '@/generated-types'

const Properties = (): React.ReactElement => {
    return (
        <PropertiesListView />
    )
}

export type AggregateOption = {
    id: number;
    value: RiskAggregates;
    label: string;
}

export const risks: AggregateOption[] = [
    {
        id: 1,
        label: 'R1 - Excelente',
        value: RiskAggregates.Excellent
    },
    {
        id: 2,
        label: 'R2 - Muy Bueno',
        value: RiskAggregates.VeryGood
    },
    {
        id: 3,
        label: 'R3 - Bueno',
        value: RiskAggregates.Good
    },
    {
        id: 4,
        label: 'R4 - Regular',
        value: RiskAggregates.Fair
    },
    {
        id: 5,
        label: 'R5 - Riesgo Alto',
        value: RiskAggregates.HighRisk
    }
]

const PropertiesActionsDropdown = ({ loading, progress, permissions, onDownloadTemplate, onImport } : { loading: boolean; progress: number | null; permissions: PermissionHelpers; onDownloadTemplate: () => void; onImport: () => void; }) => {
    return loading ? ( 
        <div className="h-9 px-3 py-2 inline-flex min-w-[8rem] justify-center items-center rounded-md border border-gray-300 bg-white">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {`Procesando${progress !== null ? ` ${progress}%` : '...'}`}
            </span>
        </div>
    ) : (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="h-9 w-32 px-3 py-2 inline-flex items-center justify-between rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                Acciones
                <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" aria-hidden="true" />
            </MenuButton>

            <MenuItems transition className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded bg-white shadow-lg ring-0 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75">
                {permissions.canView("export-format") && (
                    <MenuItem>
                        {({ close }) => (
                            <button type="button" onClick={() => { onDownloadTemplate(); close() }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <DownloadIcon className="h-4 w-4 text-gray-500" />
                                Descargar formato de inmuebles
                            </button>
                        )}
                    </MenuItem>
                )}

                {permissions.canView("import-data") && (
                    <MenuItem>
                        {({ close }) => (
                            <button type="button" onClick={() => { onImport(); close() }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                <UploadIcon className="h-4 w-4 text-gray-500" />
                                Importar Inmuebles
                            </button>
                        )}
                    </MenuItem>
                )}
            </MenuItems>
        </Menu>
    )
}

const PropertiesListView = (): React.ReactElement => {
    const [modal, setModal] = useState<boolean>(false)
    const permissions = usePermissions()
    const { download, loading: loadingDownload, progress } = useDownloadTemplate()

    const { data, loading, error, refetch } = useListPropertiesQuery({
        fetchPolicy: 'network-only',
        variables: {
            first: 10,
            page: 1
        }
    })

    const handleRefetching = (args: HandleRefetchingProps) => {
        refetch(args)
    }

    const handleDownloadTemplate = () => {
        download()
    }

    const handleImport = () => {
        setModal(true)
    }

    const headers: Header[] = [
        { key: "name", label: "Nombre", sortable: false, filterable: false, width: 100, align: "center" },
        { key: "exactAddress", label: "Dirección", sortable: false, filterable: false, width: "16rem", align: "left" },
        { key: "latitude", label: "Latitud", sortable: false, filterable: false, width: 100, align: "center" },
        { key: "longitude", label: "Longitud", sortable: false, filterable: false, width: 100, align: "center" },
        { key: "measuredAt", label: "Fecha de Valuación", sortable: false, filterable: false, width: 120, align: "center" },
        { key: "quantity", label: "Valuaciones", sortable: false, filterable: false, width: 100, align: "center" }
    ]

    const properties = data?.properties.data
    const paginatorInfo = data?.properties.paginatorInfo
    const parsedColumns = properties ? properties.map(property => {

        const measuredAt = property.latestValuation?.measuredAt

        return {
            values: {
                id: property.id,
                name: property.name ?? '',
                exactAddress: property.exactAddress ?? '',
                latitude: property.latitude,
                longitude: property.longitude,
                measuredAt: moment(measuredAt).format("DD/MM/YYYY") ?? '',
                quantity: property.quantity
            }
        }
    }) : []

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="pt-6">
                <SearchableTable<Property>
                    model={defineModel('inmueble')}
                    title="Inmuebles"
                    toolbarActions={
                        <PropertiesActionsDropdown
                            loading={loadingDownload}
                            progress={progress}
                            permissions={permissions}
                            onDownloadTemplate={handleDownloadTemplate}
                            onImport={handleImport}
                        />
                    }
                    canCreate={permissions.canCreate("property")}
                    canEdit={permissions.canEdit("property")}
                    headers={headers}
                    data={parsedColumns}
                    loading={loading}
                    error={error}
                    paginatorInfo={paginatorInfo}
                    refetch={handleRefetching}
                />

                <ImportModal
                    open={modal}
                    setModalOpen={setModal}
                />
            </div>
        </div>
    )
}

export default Properties