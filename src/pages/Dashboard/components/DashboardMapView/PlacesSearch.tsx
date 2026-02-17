import * as React from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

import type { SelectedPlace } from './types'

type PlacesSearchProps = {
	onPlaceSelected: (place: SelectedPlace) => void;
}

export function PlacesSearch({ onPlaceSelected }: PlacesSearchProps) {
	const map = useMap()
	const placesLib = useMapsLibrary('places')
	const inputContainerRef = React.useRef<HTMLDivElement | null>(null)

	React.useEffect(() => {
		if (!placesLib || !map || !inputContainerRef.current || !google.maps.places.PlaceAutocompleteElement) {
			return
		}

		const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
			requestedLanguage: 'es'
		})

		placeAutocomplete.className = 'bg-white boder text-gray-700 block w-full rounded-lg [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-gray-200 [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-gray-300'
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
		<div className="absolute left-4 top-4 z-10 w-[min(420px,calc(100%-2rem))]">
			<div className="rounded-lg bg-white/95 shadow-lg ring-1 ring-black/5 border-0">
				<div className="relative">
					<div ref={inputContainerRef} className="rounded-lg [&>gmp-place-autocomplete]:block [&>gmp-place-autocomplete]:w-full [&>gmp-place-autocomplete>input]:pl-8 bg-white text-gray-700" />
				</div>
			</div>
		</div>
	)
}
