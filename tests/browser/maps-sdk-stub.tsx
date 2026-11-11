/* eslint-disable react-refresh/only-export-components -- SDK test double must expose both hooks and components; no Fast Refresh here. */
import type { ReactNode } from 'react'

// Provider boundary only: the real InmuebleMapPreview still decides handlers/props.
export function Map({ children, defaultCenter, defaultZoom, onClick }: {
    children: ReactNode; defaultCenter: unknown; defaultZoom: number; onClick?: (event: unknown) => void;
}) {
    return <div data-testid="map" data-center={JSON.stringify(defaultCenter)} data-zoom={defaultZoom}
        data-click-handler={Boolean(onClick)} style={{ height: '100%', background: '#edf0f2', position: 'relative' }}
        onClick={() => onClick?.({ detail: { latLng: { lat: 15, lng: -88 } } })}>{children}</div>
}
export function AdvancedMarker({ position, draggable, onDragEnd, children }: {
    position: unknown; draggable?: boolean; onDragEnd?: (event: unknown) => void; children: ReactNode;
}) {
    return <div data-testid="marker" data-position={JSON.stringify(position)} data-draggable={Boolean(draggable)}
        data-drag-handler={Boolean(onDragEnd)} style={{ position: 'absolute', top: '50%', left: '50%' }}
        onDoubleClick={() => onDragEnd?.({ latLng: { lat: () => 16, lng: () => -89 } })}>{children}</div>
}
export function useMap() { return null }
export function InfoWindow() { return null }
