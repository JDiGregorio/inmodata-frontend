import * as React from 'react'
import { AdvancedMarker, Map, Pin, useMap } from '@vis.gl/react-google-maps'
import { ExpandIcon, ListFilterIcon, Minimize2Icon, SquareSplitHorizontalIcon } from 'lucide-react'

import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ID } from './constants'
import { PlacesSearch } from './PlacesSearch'
import { RightPanel } from './RightPanel'
import { getRiskProfileColor } from './riskProfile'
import type { SelectedPlace } from './types'

import { usePropertiesWithinBoundsLazyQuery, PropertyPointFieldsFragment } from '@/generated-types'

type Property = PropertyPointFieldsFragment

type MapCanvasProps = {
    expanded: boolean
    onToggleExpand: () => void
}

const VIEWPORT_LIMIT = 500
const VIEWPORT_FETCH_DEBOUNCE_MS = 250

function ViewportListener({ onBoundsChange }: { onBoundsChange: (bounds: google.maps.LatLngBounds) => void }) {
    const map = useMap()

    React.useEffect(() => {
        if (!map) {
            return
        }

        const listener = map.addListener('idle', () => {
            const bounds = map.getBounds()

            if (!bounds) {
                return
            }

            onBoundsChange(bounds)
        })

        return () => {
            listener.remove()
        }
    }, [map, onBoundsChange])

    return null
}

export function MapCanvas({ expanded, onToggleExpand }: MapCanvasProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [searchPlace, setSearchPlace] = React.useState<SelectedPlace | null>(null)
    const [points, setPoints] = React.useState<Property[]>([])
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState<boolean>(false)
    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const [fetchWithinBounds, { data, loading }] = usePropertiesWithinBoundsLazyQuery({
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
    })

    const mappedPoints = React.useMemo<Property[]>(() => {
        const properties = data?.propertiesWithinBounds ?? []

        return properties.map((property) => ({
            id: property.id,
            name: property.name?.trim() || 'Sin nombre',
            exactAddress: property.exactAddress?.trim() || 'Sin dirección',
            cadastralKey: property.cadastralKey,
            quantity: property.quantity,
            latestValuation: property.latestValuation,
            latitude: property.latitude,
            longitude: property.longitude,
        }))
    }, [data])

    React.useEffect(() => {
        if (!data) {
            return
        }

        setPoints(mappedPoints)
        setHasLoadedOnce(true)
    }, [data, mappedPoints])

    const selectedPoint = React.useMemo(() => {
        const point = points.find((p) => p.id === selectedId) ?? null

        return point
            ? {
                  ...point,
                  position: {
                      lat: point.latitude,
                      lng: point.longitude,
                  },
              }
            : null
    }, [points, selectedId])

    const requestForBounds = React.useCallback(
        (bounds: google.maps.LatLngBounds) => {
            const northEast = bounds.getNorthEast()
            const southWest = bounds.getSouthWest()

            fetchWithinBounds({
                variables: {
                    northLatitude: northEast.lat(),
                    eastLongitude: northEast.lng(),
                    southLatitude: southWest.lat(),
                    westLongitude: southWest.lng(),
                    limit: VIEWPORT_LIMIT,
                },
            })
        },
        [fetchWithinBounds],
    )

    const handleBoundsChange = React.useCallback(
        (bounds: google.maps.LatLngBounds) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }

            debounceTimerRef.current = setTimeout(() => {
                requestForBounds(bounds)
            }, VIEWPORT_FETCH_DEBOUNCE_MS)
        },
        [requestForBounds],
    )

    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    const handleClosePanel = React.useCallback(() => {
        setSelectedId(null)
    }, [])

    const handleToggleExpand = React.useCallback(() => {
        setSelectedId(null)
        onToggleExpand()
    }, [onToggleExpand])

    return (
        <div className="relative h-full w-full border-0">
            <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 space-y-3">
                <div className="pointer-events-auto flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Mapa de inmuebles</h2>
                        <p className="mt-1 text-sm text-gray-600">Explora los puntos en el mapa y revisa el detalle del inmueble seleccionado.</p>
                    </div>

                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center rounded-xl border border-gray-200 bg-white/95 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-white"
                    >
                        Exportar
                    </button>
                </div>

                <div className="pointer-events-auto rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="min-w-[260px] flex-1">
                            <PlacesSearch
                                onPlaceSelected={(place) => {
                                    setSearchPlace(place)
                                }}
                            />
                        </div>

                        <button
                            type="button"
                            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <ListFilterIcon className="size-4" />
                            Filtros
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 cursor-pointer items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Mostrar {VIEWPORT_LIMIT} puntos
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 cursor-pointer items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Limpiar filtros
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            onClick={handleToggleExpand}
                        >
                            {expanded ? <Minimize2Icon className="size-4" /> : <SquareSplitHorizontalIcon className="size-4" />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={handleToggleExpand}
                className="absolute bottom-4 right-4 z-20 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-white"
            >
                {expanded ? <Minimize2Icon className="size-6" /> : <ExpandIcon className="size-6" />}
            </button>

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                mapTypeId={'hybrid'}
                mapId={MAP_ID}
                style={{ width: '100%', height: '100%' }}
                disableDefaultUI={true}
                zoomControl={true}
                fullscreenControl={false}
            >
                <ViewportListener onBoundsChange={handleBoundsChange} />

                {points.map((p) => {
                    const isSelected = selectedId === p.id
                    const markerColor = getRiskProfileColor(p.latestValuation?.riskProfile)

                    return (
                        <AdvancedMarker key={p.id} position={{ lat: p.latitude, lng: p.longitude }} onClick={() => setSelectedId(p.id)}>
                            <Pin
                                scale={isSelected ? 1.25 : 0.85}
                                background={isSelected ? '#D4AF37' : markerColor}
                                borderColor={isSelected ? '#8B6B1F' : '#374151'}
                                glyphColor="#ffffff"
                            />
                        </AdvancedMarker>
                    )
                })}

                {searchPlace?.position && <AdvancedMarker position={searchPlace.position} />}
            </Map>

            <RightPanel point={selectedPoint} onClose={handleClosePanel} />

            {!hasLoadedOnce && loading && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/45">
                    <div className="rounded-xl bg-white/95 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5">Cargando propiedades...</div>
                </div>
            )}

            {hasLoadedOnce && loading && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-gray-700 shadow ring-1 ring-black/5">
                    Actualizando resultados...
                </div>
            )}
        </div>
    )
}
