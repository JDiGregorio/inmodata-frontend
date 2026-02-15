"use client"
import * as React from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Map, AdvancedMarker, InfoWindow, useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { ExpandIcon, Minimize2Icon, SearchIcon, XIcon } from 'lucide-react'

type Point = {
    id: string;
    name: string;
    position: google.maps.LatLngLiteral;
    address?: string;
    notes?: string;
};

const DEFAULT_CENTER: google.maps.LatLngLiteral = { lat: 15.7597, lng: -86.7822 }
const DEFAULT_ZOOM = 13
const MAP_ID = '7e4a3d97341b511756649b5f'

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

type SelectedPlace = {
    position: google.maps.LatLngLiteral;
    name?: string;
    address?: string;
}

function PlacesSearch({ onPlaceSelected }: { onPlaceSelected: (place: SelectedPlace) => void; }) {
    const map = useMap()
    const placesLib = useMapsLibrary("places")
    const inputContainerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        if (!placesLib || !map || !inputContainerRef.current || !google.maps.places.PlaceAutocompleteElement) {
            return
        }

        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            requestedLanguage: 'es'
        })

        placeAutocomplete.className = 'block w-full [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-200 [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-gray-300'
        placeAutocomplete.setAttribute('aria-label', 'Buscar lugar')
        inputContainerRef.current.replaceChildren(placeAutocomplete)

        const handlePlaceSelect = async (event: Event) => {
            const selectedEvent = event as Event & {
                placePrediction?: google.maps.places.PlacePrediction;
            }
            const prediction = selectedEvent.placePrediction

            if (!prediction) {
                return
            }

            const place = prediction.toPlace()
            await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] })

            if (!place.location) {
                return
            }

            const position = place.location.toJSON()

            onPlaceSelected({
                position,
                name: place.displayName ?? undefined,
                address: place.formattedAddress ?? undefined
            })

            map.panTo(position)
            map.setZoom(16)
        }

        placeAutocomplete.addEventListener('gmp-placeselect', handlePlaceSelect)

        return () => {
            placeAutocomplete.removeEventListener('gmp-placeselect', handlePlaceSelect)
            placeAutocomplete.remove()
        }
    }, [placesLib, map, onPlaceSelected])

    return (
        <div className="absolute left-4 top-4 z-10 w-[min(520px,calc(100%-2rem))]">
            <div className="rounded-xl bg-white/95 shadow-lg ring-1 ring-black/5 p-3">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                    Buscar lugar
                </label>

                <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-2.5 z-10 size-4 text-gray-400" />
                    <div ref={inputContainerRef} className="[&>gmp-place-autocomplete]:block [&>gmp-place-autocomplete]:w-full [&>gmp-place-autocomplete>input]:pl-8" />
                </div>

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

function MapCanvas({ expanded, onToggleExpand }: { expanded: boolean; onToggleExpand: () => void; }) {
    const [points] = React.useState<Point[]>(TEST_POINTS)
    const [selectedId, setSelectedId] = React.useState<string | null>(null)
    const [searchPlace, setSearchPlace] = React.useState<SelectedPlace | null>(null)

    const selectedPoint = React.useMemo(() => points.find((p) => p.id === selectedId) ?? null, [points, selectedId])

    return (
        <div className="relative h-full w-full">
            <PlacesSearch
                onPlaceSelected={(place) => {
                    setSearchPlace(place)
                }}
            />

            <RightPanel point={selectedPoint} onClose={() => setSelectedId(null)} />

            <button
                type="button"
                onClick={onToggleExpand}
                className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-white"
            >
                {expanded ? <Minimize2Icon className="size-4" /> : <ExpandIcon className="size-4" />}
                {expanded ? 'Salir de vista ampliada' : 'Expandir mapa'}
            </button>

            <Map
                defaultCenter={DEFAULT_CENTER}
                defaultZoom={DEFAULT_ZOOM}
                gestureHandling="greedy"
                disableDefaultUI={false}
                mapId={MAP_ID}
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

                {searchPlace?.position && (
                    <AdvancedMarker
                        position={searchPlace.position}
                    />
                )}
            </Map>
        </div>
    );
}

export default function DashboardMapView() {
    const [expanded, setExpanded] = React.useState(false)

    return (
        <>
            <MapCanvas expanded={false} onToggleExpand={() => setExpanded(true)} />

            <Dialog open={expanded} onClose={setExpanded} className="relative z-50">
                <DialogBackdrop className="fixed inset-0 bg-black/50" />

                <div className="fixed inset-0 p-3 sm:p-6">
                    <DialogPanel className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setExpanded(false)}
                            className="absolute right-3 top-3 z-20 rounded-lg bg-white/95 p-2 text-gray-600 shadow ring-1 ring-black/5 transition hover:bg-white"
                        >
                            <XIcon className="size-4" />
                        </button>

                        <MapCanvas expanded onToggleExpand={() => setExpanded(false)} />
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
