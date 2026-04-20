export const MAP_VIEW_FOCUS_ZOOM = 18

export const buildMapViewFocusHref = ({
    id,
    latitude,
    longitude,
}: {
    id: string;
    latitude: number;
    longitude: number;
}) => {
    const params = new URLSearchParams({
        propertyId: id,
        lat: latitude.toString(),
        lng: longitude.toString(),
        zoom: MAP_VIEW_FOCUS_ZOOM.toString(),
    })

    return `/inicio?${params.toString()}`
}
