import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Map, AdvancedMarker, useMap, InfoWindow } from '@vis.gl/react-google-maps'
import { NavLink } from 'react-router'
import { MapPinHouseIcon, ArrowUpRightIcon } from 'lucide-react'

import { Circle } from './Circle'
import { toast } from '@/utils/toast'

import markerPrimary from '@/assets/marker9.png'
import markerSecondary from '@/assets/marker10.png'

import { isLatLngLiteral, isLatLngClass, isValidLatitude, isValidLongitude } from '@/lib/utils'

import {
    useGetPropertiesWithinRadiusQuery
} from '@/generated-types'

export type InmuebleMapPreviewProps = {
    defaultZoom?: number;
    currentPropertyId?: string | number;
    latitude: number | undefined;
    longitude: number | undefined;
    hasPoint: boolean;
    mapHeightClassName?: string;
    onLatLngChange?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: 15.7695458, lng: -86.7902957 }
const FOCUS_ZOOM = 20
const RADIUS_METER = 25

export const InmuebleMapPreview = ({ defaultZoom = 13, currentPropertyId, latitude, longitude, hasPoint, mapHeightClassName = "h-95", onLatLngChange }: InmuebleMapPreviewProps): React.ReactElement => {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [showFullAddress, setShowFullAddress] = useState<boolean>(false)

    const map = useMap()
    const point = hasPoint ? { lat: latitude!, lng: longitude! } : undefined

    const { data, loading } = useGetPropertiesWithinRadiusQuery({
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
        variables: {
            latitude: latitude!,
            longitude: longitude!,
            radiusMeters: RADIUS_METER
        },
        skip: !hasPoint
    })

    useEffect(() => {
        const items = data?.propertiesWithinRadius ?? []
        const nearby = currentPropertyId !== null ? items.filter(point => String(point.id) !== String(currentPropertyId)) : items

        if (nearby.length > 0) {
            toast.warning("Existen inmuebles cercanos a menos de 25 metros ya registrados, por favor valide que el que quiere ingresar no sea el mismo.")
        }
    }, [data])

    useEffect(() => {
        setShowFullAddress(false)
    }, [selectedId])

    useEffect(() => {
        if (map && hasPoint && point) {
            map.setCenter(point)
            map.setZoom(FOCUS_ZOOM)
        }
    }, [map, hasPoint, point?.lat, point?.lng])

    useEffect(() => {
        setSelectedId(null)
    }, [latitude, longitude])

    const handleMapClick = useCallback((e: any) => {
        const ll = e?.detail?.latLng
        if (!ll) return

        let lat: number, lng: number

        if (isLatLngClass(ll)) {
            lat = ll.lat()
            lng = ll.lng()
        } else if (isLatLngLiteral(ll)) {
            lat = ll.lat
            lng = ll.lng
        } else if (typeof ll?.toJSON === 'function') {
            const j = ll.toJSON()
            lat = j.lat
            lng = j.lng
        } else {
            return;
        }

        if (isValidLatitude(lat) && isValidLongitude(lng)) {
            onLatLngChange?.(lat, lng)
        }
    }, [onLatLngChange])

    const handleDragEnd = useCallback((event: any) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        }

        if (isValidLatitude(newPosition.lat) && isValidLongitude(newPosition.lng)) {
            onLatLngChange?.(newPosition.lat, newPosition.lng)
        }
    }, [onLatLngChange])

    const nearby = useMemo(() => {
        const items = data?.propertiesWithinRadius ?? []

        if (currentPropertyId == null) {
            return items
        }

        return items.filter(point => String(point.id) !== String(currentPropertyId))
    }, [data, currentPropertyId])

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className={`overflow-hidden rounded border bg-white shadow ${mapHeightClassName}`}>
                <Map
                    defaultCenter={DEFAULT_CENTER}
                    defaultZoom={defaultZoom}
                    mapTypeId={'hybrid'}
                    mapId="7e4a3d97341b511756649b5f"
                    onClick={handleMapClick}
                    disableDefaultUI={true}
                    zoomControl={true}
                    fullscreenControl={true}
                >
                    {hasPoint && (
                        <AdvancedMarker
                            position={point}
                            draggable={true}
                            onDragEnd={handleDragEnd}
                        >
                            <img src={markerPrimary} width={20} height={28} />
                        </AdvancedMarker>
                    )}

                    {hasPoint && (
                        <Circle
                            center={point}
                            radius={RADIUS_METER}
                            fillColor='#BF0411'
                            fillOpacity={0.2}
                            strokeColor='#BF0411'
                            strokeOpacity={0.8}
                            strokeWeight={1}
                        />
                    )}

                    {hasPoint && !loading && (
                        nearby.map((point: any) => {
                            const position = { lat: point.latitude, lng: point.longitude };

                            return (
                                <React.Fragment key={point.id}>
                                    <AdvancedMarker
                                        position={position}
                                        onClick={() => setSelectedId(point.id)}
                                    >
                                        <img src={markerSecondary} width={20} height={28} />
                                    </AdvancedMarker>

                                    {selectedId === point.id && (
                                        <InfoWindow
                                            position={position}
                                            headerContent={
                                                <div className="flex space-x-2">
                                                    <MapPinHouseIcon size={15} color="#aaaaaa" />
                                                    <h3 className="text-md font-semibold text-black">
                                                        {point.name}
                                                    </h3>
                                                </div>
                                            }
                                            onCloseClick={() => setSelectedId(null)}
                                            minWidth={250}
                                            className="px-0 py-0"
                                        >
                                            <div className="max-w-[320px]">
                                                <div className="pt-2 space-y-6 border-t border-gray-200">
                                                    <div className="space-y-2">
                                                        <div className="px-2 flex justify-between gap-3">
                                                            <p className="text-md font-medium text-black">
                                                                Clave Catastral:
                                                            </p>

                                                            <p className="text-md text-gray-500 truncate max-w-[160px]">
                                                                {point.cadastral_key ?? "-"}
                                                            </p>
                                                        </div>

                                                        <div className="px-2 flex flex-col gap-1">
                                                            <p className="text-md font-medium text-black">
                                                                Dirección
                                                            </p>

                                                            <p className={["text-md text-gray-500 break-words", showFullAddress ? "" : "line-clamp-2"].join(" ")}>
                                                                {point.exactAddress ?? "-"}
                                                            </p>

                                                            {point.exactAddress && point.exactAddress.length > 60 && (
                                                                <button type="button" onClick={() => setShowFullAddress(v => !v)} className="self-start text-sm font-medium text-blue-900 hover:text-blue-600 cursor-pointer">
                                                                    {showFullAddress ? "Ver menos" : "Ver más"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <NavLink to={`/inmuebles/${point.id}/editar#informacion-general`} className="flex justify-center text-gray-600 hover:text-gray-900 items-center uppercase space-x-2">
                                                        <span className="font-medium text-blue-900 hover:text-blue-600">
                                                            Ver inmueble
                                                        </span>
                                                        <ArrowUpRightIcon size={15} />
                                                    </NavLink>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </React.Fragment>
                            )
                        })
                    )}
                </Map>
            </div>
        </div>
    )
}