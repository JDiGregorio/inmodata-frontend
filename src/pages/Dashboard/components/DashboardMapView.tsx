"use client"
import * as React from 'react'
import { Map, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

type Point = {
    id: string;
    name: string;
    position: google.maps.LatLngLiteral;
    address?: string;
    notes?: string;
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 15.7597, lng: -86.7822 }
const DEFAULT_ZOOM = 13

const TEST_POINTS: Point[] = [
    {
        id: "p1",
        name: "Parque Central La Ceiba",
        position: { lat: 15.778485, lng: -86.792049 },
        address: "Parque Central, La Ceiba",
        notes: "Punto de prueba #1"
    },
    {
        id: "p2",
        name: "Muelle de Cabotaje",
        position: { lat: 15.789391, lng: -86.796726 },
        address: "Zona portuaria, La Ceiba",
        notes: "Punto de prueba #2"
    },
    {
        id: "p3",
        name: "Estadio Municipal Ceibeño",
        position: { lat: 15.773787, lng: -86.812155 },
        address: "Estadio Ceibeño",
        notes: "Punto de prueba #3"
    }
]

function PlacesSearch({ onPlaceSelected }: { onPlaceSelected: (place: google.maps.places.PlaceResult) => void; }) {
    const map = useMap()
    const placesLib = useMapsLibrary("places")
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    React.useEffect(() => {
        if (!placesLib || !map || !inputRef.current) {
            return
        }

        const autocomplete = new placesLib.Autocomplete(inputRef.current, {
            fields: ["geometry", "formatted_address", "name"]
        })

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace()

            if (!place?.geometry?.location) {
                return
            }

            onPlaceSelected(place)

            const loc = place.geometry.location

            map.panTo({ lat: loc.lat(), lng: loc.lng() })
            map.setZoom(16)
        })

        return () => {
            // no-op (Google no expone un "destroy" oficial del Autocomplete)
        }
    }, [placesLib, map, onPlaceSelected])

    return (
        <div className="absolute left-4 top-4 z-10 w-[min(520px,calc(100%-2rem))]">
            <div className="rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 p-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Buscar lugar
                </label>

                <input
                    ref={inputRef}
                    placeholder="Escribe una dirección o lugar (ej: La Ceiba, Atlántida)"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />

                <p className="mt-2 text-xs text-gray-500">
                    Tip: selecciona una sugerencia para centrar el mapa.
                </p>
            </div>
        </div>
    )
}

function RightPanel({ point, onClose } : { point: Point | null; onClose: () => void; }) {
    return (
        <div
            className={[
                "absolute right-4 top-4 z-10 w-[360px] max-w-[calc(100%-2rem)]",
                "transition-all duration-200",
                point ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none",
            ].join(" ")}
        >
            <div className="rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/5 overflow-hidden">
                <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {point?.name ?? "Detalle"}
                        </h3>

                        <p className="text-xs text-gray-500">
                            {point?.address ?? "Sin dirección"}
                        </p>
                    </div>

                    <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                        Cerrar
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-600">
                            Coordenadas
                        </p>

                        <p className="text-sm font-medium text-gray-900">
                            {point ? `${point.position.lat.toFixed(6)}, ${point.position.lng.toFixed(6)}` : "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-600">
                            Notas
                        </p>

                        <p className="text-sm text-gray-900">
                            {point?.notes ?? "Sin notas"}
                        </p>
                    </div>

                    <button className="w-full rounded-xl bg-gray-900 text-white text-sm font-semibold py-2 hover:bg-gray-800"
                        onClick={() => {
                            if (!point) {
                                return;
                            }

                            const url = `https://www.google.com/maps?q=${point.position.lat},${point.position.lng}`;

                            window.open(url, "_blank", "noopener,noreferrer");
                        }}
                    >
                        Abrir en Google Maps
                    </button>
                </div>
            </div>
        </div>
    );
}

function MapCanvas() {
    const [points] = React.useState<Point[]>(TEST_POINTS)
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [searchPlace, setSearchPlace] = React.useState<google.maps.places.PlaceResult | null>(null)

    const selectedPoint = React.useMemo(() => points.find((p) => p.id === selectedId) ?? null, [points, selectedId])

    return (
        <div className="relative h-full w-full">
            <PlacesSearch
                onPlaceSelected={(place) => {
                    setSearchPlace(place)
                }}
            />

            <RightPanel point={selectedPoint} onClose={() => setSelectedId(null)} />

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                // Si quieres Advanced Markers sin warnings, agrega un mapId válido:
                // mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                style={{ width: "100%", height: "100%" }}
            >
                {points.map((p) => (
                    <AdvancedMarker
                        key={p.id}
                        position={p.position}
                        onClick={() => setSelectedId(p.id)}
                    />
                ))}

                {selectedPoint && (
                    <InfoWindow position={selectedPoint.position} onCloseClick={() => setSelectedId(null)}>
                        <div className="space-y-1">
                            <div className="font-semibold text-sm">
                                {selectedPoint.name}
                            </div>

                            <div className="text-xs text-gray-600">
                                {selectedPoint.address ?? ""}
                            </div>
                        </div>
                    </InfoWindow>
                )}

                {searchPlace?.geometry?.location && (
                    <AdvancedMarker
                        position={{
                            lat: searchPlace.geometry.location.lat(),
                            lng: searchPlace.geometry.location.lng()
                        }}
                    />
                )}
            </Map>
        </div>
    );
}

export default function DashboardMapView() {
    return (
        <MapCanvas />
    )
}
