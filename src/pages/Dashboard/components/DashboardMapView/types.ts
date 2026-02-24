export type SelectedPlace = {
	position: google.maps.LatLngLiteral;
	viewport?: google.maps.LatLngBoundsLiteral;
	name?: string;
	address?: string;
}
