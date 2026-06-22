import React, { useCallback, useEffect } from 'react'
import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { LocateFixedIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Circle } from '@/pages/Property/components/Circle'
import { PlacesSearch } from '@/pages/Dashboard/components/DashboardMapView/PlacesSearch'
import { PinContent } from '@/pages/Dashboard/components/DashboardMapView/PinContent'
import { getRiskProfileColor } from '@/pages/Dashboard/components/DashboardMapView/riskProfile'
import type { SelectedPlace } from '@/pages/Dashboard/components/DashboardMapView/types'

import markerPrimary from '@/assets/marker9.png'

import { isLatLngClass, isLatLngLiteral, isValidLatitude, isValidLongitude } from '@/lib/utils'

import { PreAppraisalPreviewSample } from './createTypes'
import { DEFAULT_CENTER } from './createUtils'

interface PreAppraisalCreateMapProps {
    latitude: number | null;
    longitude: number | null;
    radiusMeters: number;
    samples: PreAppraisalPreviewSample[];
    fitRadiusInView?: boolean;
    onPointChanged: (latitude: number, longitude: number) => void;
}

const MAP_ID = '7e4a3d97341b511756649b5f'
const RADIUS_VIEW_PADDING = 16

const MapViewportSync = ({ point, radiusMeters, fitRadiusInView, recenterSignal }: { point: google.maps.LatLngLiteral | null; radiusMeters: number; fitRadiusInView: boolean; recenterSignal: number }) => {
    const map = useMap()

    useEffect(() => {
        if (!map || !point) {
            return
        }

        if (fitRadiusInView && Number.isFinite(radiusMeters) && radiusMeters > 0) {
            const radiusBounds = new google.maps.Circle({
                center: point,
                radius: radiusMeters
            }).getBounds()

            if (radiusBounds) {
                map.fitBounds(radiusBounds, RADIUS_VIEW_PADDING)
                return
            }
        }

        map.panTo(point)
        map.setZoom(16)
    }, [map, point?.lat, point?.lng, radiusMeters, fitRadiusInView, recenterSignal])

    return null
}

export const PreAppraisalCreateMap = ({ latitude, longitude, radiusMeters, samples, fitRadiusInView = false, onPointChanged }: PreAppraisalCreateMapProps): React.ReactElement => {
    const [recenterSignal, setRecenterSignal] = React.useState(0)
    const point = React.useMemo(() => latitude !== null && longitude !== null ? { lat: latitude, lng: longitude } : null, [latitude, longitude])

    const handleMapClick = useCallback((event: any) => {
        const latLng = event?.detail?.latLng

        if (!latLng) {
            return
        }

        let lat: number
        let lng: number

        if (isLatLngClass(latLng)) {
            lat = latLng.lat()
            lng = latLng.lng()
        } else if (isLatLngLiteral(latLng)) {
            lat = latLng.lat
            lng = latLng.lng
        } else if (typeof latLng?.toJSON === 'function') {
            const json = latLng.toJSON()
            lat = json.lat
            lng = json.lng
        } else {
            return
        }

        if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
            return
        }

        onPointChanged(lat, lng)
    }, [onPointChanged])

    const handleDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
        if (!event.latLng) {
            return
        }

        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
            return
        }

        onPointChanged(lat, lng)
    }, [onPointChanged])

    const handlePlaceSelected = (place: SelectedPlace) => {
        onPointChanged(place.position.lat, place.position.lng)
    }

    return (
        <div className="relative h-full min-h-[420px] overflow-hidden bg-gray-100 lg:min-h-0">
            <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex gap-2">
                <PlacesSearch containerClassName="pointer-events-auto flex-1" onPlaceSelected={handlePlaceSelected} />

                <Button type="button" variant="outline" className="pointer-events-auto h-10 w-12 bg-white px-0" onClick={() => setRecenterSignal((value) => value + 1)}>
                    <LocateFixedIcon className="h-4 w-4" />
                </Button>
            </div>

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={13}
                gestureHandling="greedy"
                mapTypeId={'hybrid'}
                mapId={MAP_ID}
                onClick={handleMapClick}
                disableDefaultUI={true}
                zoomControl={true}
                zoomControlOptions={{ position: google.maps.ControlPosition.RIGHT_BOTTOM }}
                fullscreenControl={false}
                style={{ width: '100%', height: '100%' }}
            >
                <MapViewportSync point={point} radiusMeters={radiusMeters} fitRadiusInView={fitRadiusInView} recenterSignal={recenterSignal} />

                {point && (
                    <>
                        <Circle
                            center={point}
                            radius={radiusMeters}
                            fillColor="#155a7c"
                            fillOpacity={0.12}
                            strokeColor="#155a7c"
                            strokeOpacity={0.55}
                            strokeWeight={2}
                        />

                        <AdvancedMarker position={point} draggable={true} onDragEnd={handleDragEnd} zIndex={200}>
                            <img src={markerPrimary} width={28} height={40} alt="Punto seleccionado" />
                        </AdvancedMarker>
                    </>
                )}

                {samples.map((sample, index) => {
                    if (sample.latitude === null || sample.latitude === undefined || sample.longitude === null || sample.longitude === undefined) {
                        return null
                    }

                    const markerColor = getRiskProfileColor(sample.riskProfile)

                    return (
                        <AdvancedMarker key={`${sample.propertyId ?? sample.propertyValuationId ?? index}`} position={{ lat: sample.latitude, lng: sample.longitude }} zIndex={100}>
                            <PinContent scale={0.65} background={markerColor} borderColor="#374151" glyphColor="#ffffff" />
                        </AdvancedMarker>
                    )
                })}
            </Map>
        </div>
    )
}
