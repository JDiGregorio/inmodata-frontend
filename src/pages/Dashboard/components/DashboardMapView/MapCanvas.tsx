import * as React from 'react'
import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { ShrinkIcon } from 'lucide-react'

import { PinContent } from './PinContent'
import { RightPanel } from './RightPanel'


import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ID } from './constants'

import { getRiskProfileColor } from './riskProfile'

import markerPrimary from '@/assets/marker9.png'

import type { SelectedPlace } from './types'
import {
    usePropertiesWithinBoundsLazyQuery,
    PropertyPointFieldsFragment
} from '@/generated-types'

type Property = PropertyPointFieldsFragment

type MapCanvasProps = {
    limit: number;
    expanded: boolean;
    searchPlace: SelectedPlace | null;
    selectedId: string | null;
    focusTarget: { lat: number; lng: number; zoom: number } | null;
    setSelected: React.Dispatch<React.SetStateAction<string | null>>;
    handleToggleExpand: (value: boolean) => void;
}

const VIEWPORT_FETCH_DEBOUNCE_MS = 250
const DEFAULT_PIN_SCALE = 0.85
const SELECTED_MARKER_WIDTH = 30
const SELECTED_MARKER_HEIGHT = 46

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

function LimitChangeListener({ limit, requestForBounds }: { limit: number; requestForBounds: (bounds: google.maps.LatLngBounds) => void }) {
    const map = useMap()

    React.useEffect(() => {
        if (!map) {
            return
        }

        const bounds = map.getBounds()

        if (!bounds) {
            return
        }

        requestForBounds(bounds)
    }, [limit, map, requestForBounds])

    return null
}

function SelectedPointViewportAdjuster({ selectedPoint }: { selectedPoint: Property | null }) {
    const map = useMap()

    React.useEffect(() => {
        if (!map || !selectedPoint) {
            return
        }

        map.panTo({ lat: selectedPoint.latitude, lng: selectedPoint.longitude })

        const mapWidth = map.getDiv().clientWidth
        const horizontalOffset = Math.max(Math.round(mapWidth * 0.2), 180)

        map.panBy(horizontalOffset, 0)
    }, [map, selectedPoint])

    return null
}

function SearchPlaceViewportAdjuster({ searchPlace }: { searchPlace: SelectedPlace | null }) {
    const map = useMap()

    React.useEffect(() => {
        if (!map || !searchPlace?.position) {
            return
        }

        if (searchPlace.viewport) {
            map.fitBounds(searchPlace.viewport, 60)
            return
        }

        map.panTo(searchPlace.position)
        map.setZoom(17)
    }, [map, searchPlace])

    return null
}

function FocusTargetViewportAdjuster({ focusTarget }: { focusTarget: { lat: number; lng: number; zoom: number } | null }) {
    const map = useMap()
    const hasAppliedFocusRef = React.useRef<boolean>(false)

    React.useEffect(() => {
        if (!map || !focusTarget || hasAppliedFocusRef.current) {
            return
        }

        map.panTo({ lat: focusTarget.lat, lng: focusTarget.lng })
        map.setZoom(focusTarget.zoom)
        hasAppliedFocusRef.current = true
    }, [focusTarget, map])

    return null
}

export function MapCanvas({ limit, expanded, searchPlace, selectedId, focusTarget, setSelected, handleToggleExpand }: MapCanvasProps) {
    const [points, setPoints] = React.useState<Property[]>([])
    const [selectedSnapshot, setSelectedSnapshot] = React.useState<Property | null>(null)
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
            latestFinancialValuation: property.latestFinancialValuation,
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

    React.useEffect(() => {
        if (!selectedId) {
            setSelectedSnapshot(null)
            return
        }

        const point = points.find((p) => p.id === selectedId) ?? null

        if (point) {
            setSelectedSnapshot(point)
        }
    }, [points, selectedId])

    const selectedPoint = React.useMemo(() => {
        const point = points.find((p) => p.id === selectedId) ?? selectedSnapshot

        return point
            ? {
                  ...point,
                  position: {
                      lat: point.latitude,
                      lng: point.longitude,
                  },
              }
            : null
    }, [points, selectedId, selectedSnapshot])

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
                    limit: limit
                },
            })
        },
        [fetchWithinBounds, limit],
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
        setSelected(null)
    }, [setSelected])

    return (
        <div className="relative h-full w-full overflow-hidden rounded-2xl border-0">
            {expanded && (
                <button type="button" onClick={() => handleToggleExpand(false)} className="absolute bottom-36 left-2.5 z-20 inline-flex cursor-pointer items-center gap-2 bg-white/95 px-2.5 py-2.5 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-white">
                    <ShrinkIcon className="size-5" /> 
                </button>
            )}

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                mapTypeId={'hybrid'}
                mapId={MAP_ID}
                style={{ width: '100%', height: '100%' }}
                disableDefaultUI={true}
                zoomControl={true}
                zoomControlOptions={{ position: google.maps.ControlPosition.LEFT_BOTTOM }}
                fullscreenControl={false}
            >
                <ViewportListener onBoundsChange={handleBoundsChange} />
                <LimitChangeListener limit={limit} requestForBounds={requestForBounds} />
                <SelectedPointViewportAdjuster selectedPoint={selectedPoint} />
                <SearchPlaceViewportAdjuster searchPlace={searchPlace} />
                <FocusTargetViewportAdjuster focusTarget={focusTarget} />

                {points.map((point) => {
                    const isSelected = selectedId === point.id
                    const markerColor = getRiskProfileColor(point.latestFinancialValuation?.riskProfile)

                    return (
                        <AdvancedMarker
                            key={point.id}
                            position={{ lat: point.latitude, lng: point.longitude }}
                            zIndex={isSelected ? 200 : 100}
                            clickable
                            onClick={() => {
                                setSelected(point.id)
                                setSelectedSnapshot(point)
                            }}
                        >
                            {isSelected ? (
                                <img
                                    src={markerPrimary}
                                    width={SELECTED_MARKER_WIDTH}
                                    height={SELECTED_MARKER_HEIGHT}
                                    alt="Marcador seleccionado"
                                />
                            ) : (
                                <PinContent
                                    scale={DEFAULT_PIN_SCALE}
                                    background={markerColor}
                                    borderColor={"#374151"}
                                    glyphColor="#ffffff"
                                />
                            )}
                        </AdvancedMarker>
                    )
                })}
            </Map>

            <RightPanel point={selectedPoint} expanded={expanded} onClose={handleClosePanel} />

            {!hasLoadedOnce && loading && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/45">
                    <div className="rounded-xl bg-white/95 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5">
                        Cargando propiedades...
                    </div>
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
