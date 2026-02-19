import * as React from 'react'
import { SearchIcon } from 'lucide-react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

import type { SelectedPlace } from './types'

type PlacesSearchProps = {
    onPlaceSelected: (place: SelectedPlace) => void
    containerClassName?: string
}

export function PlacesSearch({ onPlaceSelected, containerClassName }: PlacesSearchProps) {
    const map = useMap()
    const placesLib = useMapsLibrary('places')
    const inputContainerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        if (!placesLib || !map || !inputContainerRef.current || !google.maps.places.PlaceAutocompleteElement) {
            return
        }

        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
            requestedLanguage: 'es',
        })

        placeAutocomplete.className =
            'bg-white text-gray-700 block w-full rounded-lg [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-200 [&>input]:px-3 [&>input]:py-2 [&>input]:pl-10 [&>input]:text-sm [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-gray-300'
        placeAutocomplete.setAttribute('aria-label', 'Buscar lugar')
        inputContainerRef.current.replaceChildren(placeAutocomplete)

        const handlePlaceSelect = async (event: Event) => {
            const selectedEvent = event as Event & {
                placePrediction?: google.maps.places.PlacePrediction
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
                address: place.formattedAddress ?? undefined,
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
        <div className={containerClassName ?? 'w-full'}>
            <div className="relative rounded-xl bg-white ring-1 ring-gray-200">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-5 -translate-y-1/2 text-gray-400" />
                <div ref={inputContainerRef} className="rounded-lg [&>gmp-place-autocomplete]:block [&>gmp-place-autocomplete]:w-full bg-white text-gray-700" />
            </div>
        </div>
    )
}
