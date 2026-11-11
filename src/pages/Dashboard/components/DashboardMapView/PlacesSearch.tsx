import * as React from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import type { SelectedPlace } from './types'
import { SearchIcon } from 'lucide-react'

type PlacesSearchProps = {
    containerClassName?: string;
    onPlaceSelected: (place: SelectedPlace) => void;
}

function parseLatLng(input: string): google.maps.LatLngLiteral | null {
    const cleaned = input.trim().replace(/\s+/g, " ")
    const match = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*,?\s*(-?\d+(?:\.\d+)?)$/)

    if (!match) {
        return null
    }

    const lat = Number(match[1])
    const lng = Number(match[2])

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null
    }

    if (lat < -90 || lat > 90) {
        return null
    }

    if (lng < -180 || lng > 180) {
        return null
    }

    return { lat, lng }
}

export function PlacesSearch({ containerClassName, onPlaceSelected }: PlacesSearchProps) {
    const map = useMap()
    const placesLib = useMapsLibrary("places")

    const [value, setValue] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [items, setItems] = React.useState<google.maps.places.AutocompleteSuggestion[]>([])

    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const rootRef = React.useRef<HTMLDivElement | null>(null)

    const skipFetchRef = React.useRef(false)

    const mapRef = React.useRef<google.maps.Map | null>(null)

    React.useEffect(() => {
        mapRef.current = map ?? null
    }, [map])

    const fetchSuggestions = React.useCallback(async (q: string) => {
        if (!map || !placesLib) {
            return
        }

        if (skipFetchRef.current) {
            return
        }

        if (!q.trim()) {
            setItems([])
            setOpen(false)

            return
        }

        if (parseLatLng(q)) {
            setItems([])
            setOpen(false)

            return
        }

        setLoading(true)

        try {
            const bounds = map.getBounds()

            const { AutocompleteSuggestion } = google.maps.places as any

            const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input: q,
                includedRegionCodes: ["HN"],
                locationBias: bounds ?? undefined,
                language: "es"
            })

            const suggestions = res?.suggestions ?? []

            setItems(suggestions)
            setOpen(suggestions.length > 0)
        } catch (e) {
            console.error(e)
            setItems([])
            setOpen(false)
        } finally {
            setLoading(false)
        }
    }, [map, placesLib])

    React.useEffect(() => {
        const t = window.setTimeout(() => void fetchSuggestions(value), 250)

        return () => window.clearTimeout(t)
    }, [value, fetchSuggestions])

    React.useEffect(() => {
        const onDocMouseDown = (e: MouseEvent) => {
            const root = rootRef.current

            if (!root) {
                return
            }

            if (!root.contains(e.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", onDocMouseDown)

        return () => document.removeEventListener("mousedown", onDocMouseDown)
    }, [])

    const handleSelectSuggestion = async (s: google.maps.places.AutocompleteSuggestion) => {
        setOpen(false)

        skipFetchRef.current = true

        try {
            const prediction = (s as any).placePrediction as google.maps.places.PlacePrediction | undefined
            
            if (!prediction) {
                return
            }

            const place = prediction.toPlace()
            await place.fetchFields({ fields: ["displayName", "formattedAddress", "location", "viewport"] })

            if (!place.location) {
                return
            }

            const position = place.location.toJSON()

            onPlaceSelected({
                position,
                viewport: place.viewport?.toJSON(),
                name: place.displayName ?? undefined,
                address: place.formattedAddress ?? undefined
            })

            setValue(place.displayName ?? place.formattedAddress ?? "")

            const m = mapRef.current

            if (m) {
                if (place.viewport) {
                    m.fitBounds(place.viewport)
                } else {
                    m.panTo(position)
                    m.setZoom(16)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            window.setTimeout(() => {
                skipFetchRef.current = false
            }, 0)
        }
    }

    const tryCoordsSearch = async (rawValue: string) => {
        const coords = parseLatLng(rawValue)
        const m = mapRef.current

        if (!coords || !m) {
            return
        }

        setOpen(false)
        skipFetchRef.current = true

        try {
            const geocoder = new google.maps.Geocoder()
            const result = await geocoder.geocode({ location: coords })
            const best = result.results?.[0]

            onPlaceSelected({
                position: coords,
                name: best?.address_components?.[0]?.long_name ?? "Coordenadas",
                address: best?.formatted_address ?? `${coords.lat}, ${coords.lng}`
            })

            m.panTo(coords)
            m.setZoom(16)
        } finally {
            window.setTimeout(() => {
                skipFetchRef.current = false
            }, 0)
        }
    }

    return (
        <div ref={rootRef} className={containerClassName ?? "w-full"}>
            <div className="relative">
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        skipFetchRef.current = false
                    }}
                    onFocus={() => {
                        if (items.length > 0) {
                            setOpen(true)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            void tryCoordsSearch(value)
                        }

                        if (e.key === "Escape") {
                            setOpen(false)
                        }
                    }}
                    placeholder="Buscar dirección (o coordenadas: 15.77, -86.79)"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white text-gray-700 px-3 py-2 pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                />

                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon size={16} />
                </div>

                <button
                    type="button"
                    aria-label="Borrar"
                    onClick={() => {
                        setValue("")
                        setItems([])
                        setOpen(false)
                        skipFetchRef.current = false
                        inputRef.current?.focus()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-transparent transition-colors hover:bg-gray-200 cursor-pointer"
                    style={{ visibility: value ? "visible" : "hidden" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M6 6l8 8M14 6l-8 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                {open && (
                    <div className="absolute left-0 right-0 mt-1 z-[9999] rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden">
                        {loading && (
                            <div className="px-3 py-2 text-xs text-gray-500">
                                Buscando…
                            </div>
                        )}

                        {!loading && items.length === 0 && (
                            <div className="px-3 py-2 text-xs text-gray-500">
                                Sin resultados
                            </div>
                        )}

                        {!loading && items.slice(0, 8).map((s, idx) => {
                            const mainText = (s as any).placePrediction?.mainText?.text ?? (s as any).placePrediction?.text?.text ?? "Resultado"
                            const secondary = (s as any).placePrediction?.secondaryText?.text ?? ""

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        void handleSelectSuggestion(s);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                    <div className="text-sm text-gray-900">
                                        {mainText}
                                    </div>

                                    {secondary ? (
                                        <div className="text-xs text-gray-500">
                                            {secondary}
                                        </div>
                                    ) : (null)}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}