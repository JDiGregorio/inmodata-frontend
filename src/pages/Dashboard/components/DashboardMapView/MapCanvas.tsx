import * as React from 'react'
import { AdvancedMarker, InfoWindow, Map } from '@vis.gl/react-google-maps'
import { ExpandIcon, Minimize2Icon } from 'lucide-react'

import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_ID } from './constants'
import { TEST_POINTS } from './data'
import { PlacesSearch } from './PlacesSearch'
import { RightPanel } from './RightPanel'
import type { Point, SelectedPlace } from './types'

type MapCanvasProps = {
  expanded: boolean
  onToggleExpand: () => void
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

      <button
        type="button"
        onClick={onToggleExpand}
        className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 transition hover:bg-white"
      >
        {expanded ? <Minimize2Icon className="size-4" /> : <ExpandIcon className="size-4" />}
        {expanded ? 'Salir de vista ampliada' : 'Expandir mapa'}
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
        {points.map((p) => (
          <AdvancedMarker key={p.id} position={p.position} onClick={() => setSelectedId(p.id)} />
        ))}

        {selectedPoint && (
          <InfoWindow position={selectedPoint.position} onCloseClick={() => setSelectedId(null)}>
            <div className="space-y-1">
              <div className="font-semibold text-sm">{selectedPoint.name}</div>

              <div className="text-xs text-gray-600">{selectedPoint.address ?? ''}</div>
            </div>
          </InfoWindow>
        )}

        {searchPlace?.position && <AdvancedMarker position={searchPlace.position} />}
      </Map>
    </div>
  )
}
