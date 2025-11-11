import React, { useEffect, useCallback } from 'react'
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'

import markerImage from '@/assets/marker9.png'

import { isLatLngLiteral, isLatLngClass, isValidLatitude, isValidLongitude } from '@/lib/utils'

export type InmuebleMapPreviewProps = {
    defaultZoom?: number;
    latitude: number | undefined;
    longitude: number | undefined;
    hasPoint: boolean;
    mapHeightClassName?: string;
    onLatLngChange?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: 15.7695458, lng: -86.7902957 }
const FOCUS_ZOOM = 18

export const InmuebleMapPreview = ({ defaultZoom = 13, latitude, longitude, hasPoint, mapHeightClassName = "h-80", onLatLngChange }: InmuebleMapPreviewProps): React.ReactElement => {
    const map = useMap()
    const point = hasPoint ? { lat: latitude!, lng: longitude! } : undefined

    useEffect(() => {
        if (map && hasPoint && point) {
            map.setCenter(point)
            map.setZoom(FOCUS_ZOOM)
        }
    }, [map, hasPoint, point?.lat, point?.lng])

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
                            <img src={markerImage} width={20} height={28} />
                        </AdvancedMarker>
                    )}
                </Map>
            </div>
        </div>
    )
}