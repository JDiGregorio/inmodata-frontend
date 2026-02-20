'use client'
import * as React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Minimize2Icon, FunnelXIcon, ExpandIcon } from 'lucide-react' // SlidersHorizontalIcon
import Cleave from 'cleave.js/react'

import { MapCanvas } from './DashboardMapView/MapCanvas'
import { PlacesSearch } from './DashboardMapView/PlacesSearch'

import type { SelectedPlace } from './DashboardMapView/types'

export default function DashboardMapView() {
    const [searchPlace, setSearchPlace] = React.useState<SelectedPlace | null>(null)
    const [limit, setLimit] = React.useState<number>(500)
    const [expanded, setExpanded] = React.useState<boolean>(false)
    const [selectedId, setSelectedId] = React.useState<string | null>(null)

    const handleToggleExpand = () => {
        setSelectedId(null)
        setExpanded(true)
    }

    const handleClearFilters = () => {
        setLimit(500)
        setSelectedId(null)
    }

    return (
        <div className="py-6 px-8 space-y-6">
            <div className="pointer-events-none  space-y-3">
                <div className="pointer-events-auto rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm">
                    <div className="flex justify-between flex-wrap items-center gap-2">
                        <div>
                            <div className="min-w-[260px] max-w-[500px] w-[500px]">
                                <PlacesSearch
                                    onPlaceSelected={(place) => {
                                        setSearchPlace(place)
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            {/*
                                <button type="button" className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <SlidersHorizontalIcon className="size-4" />
                                    Filtros
                                </button>
                            */}

                            <div className="px-3 flex items-center rounded-xl border space-x-2 bg-gray-50">
                                <p className="text-sm font-normal text-gray-600">
                                    Mostrar
                                </p>

                                <Cleave
                                    id="limit"
                                    name="limit"
                                    placeholder="0"
                                    options={{
                                        numeral: true,
                                        numeralThousandsGroupStyle: 'thousand',
                                        numeralDecimalScale: 2,
                                        noImmediatePrefix: false,
                                        rawValueTrimPrefix: false
                                    }}
                                    value={limit}
                                    onChange={({ target }) => setLimit(parseInt(target.value))}
                                    className="h-7.5 px-1 w-[65px] border text-center bg-white border border-gray-400"
                                />

                                <p className="text-sm font-normal text-gray-600">
                                    puntos
                                </p>
                            </div>
                            
                            <button type="button" onClick={handleClearFilters} className="inline-flex h-11 cursor-pointer items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                <FunnelXIcon className="size-4" />
                            </button>

                            <button type="button" onClick={handleToggleExpand} className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                                {expanded ? <Minimize2Icon className="size-4" /> : <ExpandIcon className="size-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-grow flex-1 rounded">
                {!expanded && (
                    <MapCanvas
                        limit={limit}
                        searchPlace={searchPlace}
                        selectedId={selectedId}
                        setSelected={setSelectedId}
                    />
                )}
            </div>

            <Dialog open={expanded} onClose={setExpanded} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/90" />

                <div className="fixed inset-0 p-3 sm:p-6">
                    <DialogPanel className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
                        {expanded && (
                            <MapCanvas
                                limit={limit}
                                searchPlace={searchPlace}
                                selectedId={selectedId}
                                setSelected={setSelectedId}
                            />
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}
