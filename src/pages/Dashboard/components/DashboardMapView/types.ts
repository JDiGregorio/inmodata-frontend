export type Point = {
	id: string;
	name: string;
	position: google.maps.LatLngLiteral;
	address?: string;
	notes?: string;
}

export type SelectedPlace = {
	position: google.maps.LatLngLiteral;
	name?: string;
	address?: string;
}
