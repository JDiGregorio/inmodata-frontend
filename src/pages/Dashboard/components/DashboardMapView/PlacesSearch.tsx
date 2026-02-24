import * as React from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

import type { SelectedPlace } from './types'

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
    const inputContainerRef = React.useRef<HTMLDivElement | null>(null)

    const autocompleteRef = React.useRef<google.maps.places.PlaceAutocompleteElement | null>(null)

    React.useEffect(() => {
        if (!placesLib || !map || !inputContainerRef.current || !google.maps.places.PlaceAutocompleteElement) {
            return
        }

        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            requestedLanguage: "es"
        })

        autocompleteRef.current = placeAutocomplete

        placeAutocomplete.className =
            "h-10 bg-white text-gray-700 block w-full rounded-lg " +
            "[&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-200 " +
            "[&>input]:px-3 [&>input]:py-2 [&>input]:pl-10 [&>input]:text-sm " +
            "[&>input]:outline-none [&>input]:focus:ring-none [&>input]:focus:ring-gray-300";

        placeAutocomplete.setAttribute("aria-label", "Buscar lugar")
        inputContainerRef.current.replaceChildren(placeAutocomplete)

        const styleClearButton = () => {
            const clearBtn = placeAutocomplete
                .shadowRoot
                ?.querySelector('button.clear-button') as HTMLButtonElement | null

            if (!clearBtn) {
                return
            }

            clearBtn.style.width = '24px'
            clearBtn.style.height = '24px'
            clearBtn.style.minWidth = '24px'
            clearBtn.style.minHeight = '24px'
            clearBtn.style.padding = '0px'
            clearBtn.style.margin = '0px'
            clearBtn.style.borderRadius = '6px'
            clearBtn.style.background = 'transparent'
            clearBtn.style.border = 'none'
            clearBtn.style.display = 'inline-flex'
            clearBtn.style.alignItems = 'center'
            clearBtn.style.justifyContent = 'center'

            const icon = clearBtn.querySelector('svg') as SVGElement | null

            if (icon) {
                icon.setAttribute('width', '16')
                icon.setAttribute('height', '16')
            }

            const hoverIn = () => {
                clearBtn.style.background = '#e5e7eb'
            }

            const hoverOut = () => {
                clearBtn.style.background = 'transparent'
            }

            clearBtn.onmouseenter = hoverIn
            clearBtn.onmouseleave = hoverOut
        }

        const observer = new MutationObserver(() => {
            styleClearButton()
        })

        observer.observe(placeAutocomplete, { childList: true, subtree: true })
        styleClearButton()

        const handlePlaceSelect = async (event: Event) => {
            const selectedEvent = event as Event & { placePrediction?: google.maps.places.PlacePrediction }
            const prediction = selectedEvent.placePrediction

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

            map.panTo(position)
            map.setZoom(16)
        }

        placeAutocomplete.addEventListener("gmp-placeselect", handlePlaceSelect)

        const tryCoordsSearch = async (rawValue: string) => {
            const coords = parseLatLng(rawValue)

            if (!coords) {
                return
            }

            const geocoder = new google.maps.Geocoder()
            const result = await geocoder.geocode({ location: coords })

            const best = result.results?.[0]

            onPlaceSelected({
                position: coords,
                name: best?.address_components?.[0]?.long_name ?? "Coordenadas",
                address: best?.formatted_address ?? `${coords.lat}, ${coords.lng}`
            })

            map.panTo(coords)
            map.setZoom(16)
        }

        const attachKeyListener = () => {
            const innerInput = placeAutocomplete.querySelector("input") as HTMLInputElement | null

            if (!innerInput) {
                return
            }

            const onKeyDown = (e: KeyboardEvent) => {
                if (e.key !== "Enter") {
                    return
                }

                void tryCoordsSearch(innerInput.value)
            }

            innerInput.addEventListener("keydown", onKeyDown)

            return () => innerInput.removeEventListener("keydown", onKeyDown)
        }

        const detach = attachKeyListener()

        return () => {
            placeAutocomplete.removeEventListener("gmp-placeselect", handlePlaceSelect)

            if (detach) {
                detach()
            }

            observer.disconnect()

            placeAutocomplete.remove()
            autocompleteRef.current = null
        }
    }, [placesLib, map, onPlaceSelected])

    return (
        <div className={containerClassName ?? "w-full"}>
            <div className="relative bg-transparent">
                <div ref={inputContainerRef} 
                    className="
                        rounded-lg bg-white text-gray-700 border border-gray-400 overflow-visible
                        [&>gmp-place-autocomplete]:block
                        [&>gmp-place-autocomplete]:w-full
                        [&>gmp-place-autocomplete]:overflow-visible
                        [&_gmp-place-autocomplete]:overflow-visible

                        [&_gmp-place-autocomplete_.suggestions-container]:z-[9999]
                        [&_gmp-place-autocomplete_.suggestions-container]:shadow-xl
                        [&_gmp-place-autocomplete_.suggestions-container]:rounded-b-lg

                        [&_gmp-place-autocomplete_button.clear-button]:!w-6
                        [&_gmp-place-autocomplete_button.clear-button]:!h-6
                        [&_gmp-place-autocomplete_button.clear-button]:![min-width:24px]
                        [&_gmp-place-autocomplete_button.clear-button]:![min-height:24px]
                        [&_gmp-place-autocomplete_button.clear-button]:!p-0
                        [&_gmp-place-autocomplete_button.clear-button]:!m-0
                        [&_gmp-place-autocomplete_button.clear-button]:!bg-gray-800
                        [&_gmp-place-autocomplete_button.clear-button]:!text-white
                        [&_gmp-place-autocomplete_button.clear-button]:!border
                        [&_gmp-place-autocomplete_button.clear-button]:!border-white/25
                        [&_gmp-place-autocomplete_button.clear-button]:rounded-md
                        [&_gmp-place-autocomplete_button.clear-button]:[display:inline-flex]
                        [&_gmp-place-autocomplete_button.clear-button]:[align-items:center]
                        [&_gmp-place-autocomplete_button.clear-button]:[justify-content:center]
                        [&_gmp-place-autocomplete_button.clear-button:hover]:!bg-gray-700
                        [&_gmp-place-autocomplete_button.clear-button:hover]:!border-white/40

                        [&_gmp-place-autocomplete_button.clear-button_svg]:!w-4
                        [&_gmp-place-autocomplete_button.clear-button_svg]:!h-4
                        [&_gmp-place-autocomplete_button.clear-button_svg_path]:![fill:#ffffff]
                    "
                />
            </div>
        </div>
    )
}
