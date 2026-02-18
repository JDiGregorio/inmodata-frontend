import * as React from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { AdvancedMarker, Map, Pin, useMap } from '@vis.gl/react-google-maps'
import { ExpandIcon, Minimize2Icon } from 'lucide-react'

import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ID } from './constants'
import { PlacesSearch } from './PlacesSearch'
import { RightPanel } from './RightPanel'
import type { Point, PointValuation, SelectedPlace } from './types'

type MapCanvasProps = {
	expanded: boolean;
	onToggleExpand: () => void;
}

const VIEWPORT_LIMIT = 500
const VIEWPORT_FETCH_DEBOUNCE_MS = 250

const PROPERTIES_WITHIN_BOUNDS_DOCUMENT = gql`
	query PropertiesWithinBounds(
		$northLatitude: Float!
		$eastLongitude: Float!
		$southLatitude: Float!
		$westLongitude: Float!
		$limit: Int
	) {
		propertiesWithinBounds(
			northLatitude: $northLatitude
			eastLongitude: $eastLongitude
			southLatitude: $southLatitude
			westLongitude: $westLongitude
			limit: $limit
		) {
			id
			name
			exactAddress
			cadastralKey
			latitude
			longitude
			quantity
			latestValuation {
				sector
				averageValue
				landArea
				improvementArea
				landValue
				utilizationRatio
				averageSquareYard
				averageSquareMeter
				riskProfile
				measuredAt
			}
		}
	}
`

type PropertiesWithinBoundsQueryResponse = {
	propertiesWithinBounds: Array<{
		id: string;
		name?: string | null;
		exactAddress?: string | null;
		cadastralKey?: string | null;
		latitude: number;
		longitude: number;
		quantity?: number | null;
		latestValuation?: PointValuation | null;
	}>;
}

type PropertiesWithinBoundsQueryVariables = {
	northLatitude: number;
	eastLongitude: number;
	southLatitude: number;
	westLongitude: number;
	limit?: number;
}

function ViewportListener({
	onBoundsChange,
}: {
	onBoundsChange: (bounds: google.maps.LatLngBounds) => void;
}) {
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

export function MapCanvas({ expanded, onToggleExpand }: MapCanvasProps) {
	const [selectedId, setSelectedId] = React.useState<string | null>(null)
	const [searchPlace, setSearchPlace] = React.useState<SelectedPlace | null>(null)
	const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

	const [fetchWithinBounds, { data }] = useLazyQuery<
		PropertiesWithinBoundsQueryResponse,
		PropertiesWithinBoundsQueryVariables
	>(PROPERTIES_WITHIN_BOUNDS_DOCUMENT, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
	})

	const points = React.useMemo<Point[]>(() => {
		const properties = data?.propertiesWithinBounds ?? []

		return properties.map((property) => ({
			id: property.id,
			name: property.name?.trim() || 'Sin nombre',
			address: property.exactAddress?.trim() || 'Sin dirección',
			cadastralKey: property.cadastralKey,
			quantity: property.quantity,
			latestValuation: property.latestValuation,
			position: {
				lat: property.latitude,
				lng: property.longitude,
			},
		}))
	}, [data])

	const selectedPoint = React.useMemo(() => points.find((p) => p.id === selectedId) ?? null, [points, selectedId])

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
					limit: VIEWPORT_LIMIT,
				},
			})
		},
		[fetchWithinBounds],
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

	return (
		<div className="relative h-full w-full border-0">
			<PlacesSearch
				onPlaceSelected={(place) => {
					setSearchPlace(place)
				}}
			/>

			<RightPanel point={selectedPoint} onClose={() => setSelectedId(null)} />

			<button type="button" onClick={onToggleExpand} className="absolute top-4 right-4 z-10 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-white">
				{expanded ? <Minimize2Icon className="size-6" /> : <ExpandIcon className="size-6" />}
			</button>

			<Map
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={DEFAULT_ZOOM}
				gestureHandling="greedy"
				mapTypeId={'hybrid'}
				mapId={MAP_ID}
				style={{ width: '100%', height: '100%' }}
				disableDefaultUI={true}
				zoomControl={true}
				fullscreenControl={false}
			>
				<ViewportListener onBoundsChange={handleBoundsChange} />

				{points.map((p) => {
					const isSelected = selectedId === p.id

					return (
						<AdvancedMarker key={p.id} position={p.position} onClick={() => setSelectedId(p.id)}>
							<Pin
								scale={isSelected ? 1.2 : 1}
								background={isSelected ? '#2563eb' : '#4b5563'}
								borderColor={isSelected ? '#1e3a8a' : '#1f2937'}
								glyphColor="#ffffff"
							/>
						</AdvancedMarker>
					)
				})}

				{searchPlace?.position && <AdvancedMarker position={searchPlace.position} />}
			</Map>
		</div>
	)
}
