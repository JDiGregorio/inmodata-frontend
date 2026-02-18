import * as React from 'react'
import { AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps'
import { ExpandIcon, Minimize2Icon } from 'lucide-react'

import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ID } from './constants'
import { TEST_POINTS } from './data'
import { PlacesSearch } from './PlacesSearch'
import { RightPanel } from './RightPanel'
import type { Point, SelectedPlace } from './types'

type MapCanvasProps = {
	expanded: boolean;
	onToggleExpand: () => void;
}

export function MapCanvas({ expanded, onToggleExpand }: MapCanvasProps) {
	const [points] = React.useState<Point[]>(TEST_POINTS)
	const [selectedId, setSelectedId] = React.useState<string | null>(null)
	const [searchPlace, setSearchPlace] = React.useState<SelectedPlace | null>(null)

	const selectedPoint = React.useMemo(() => points.find((p) => p.id === selectedId) ?? null, [points, selectedId])

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
