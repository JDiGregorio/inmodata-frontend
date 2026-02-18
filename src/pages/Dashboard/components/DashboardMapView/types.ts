export type PointValuation = {
	sector?: string | null;
	averageValue?: number | null;
	landArea?: number | null;
	improvementArea?: number | null;
	landValue?: number | null;
	utilizationRatio?: number | null;
	averageSquareYard?: number | null;
	averageSquareMeter?: number | null;
	riskProfile?: string | null;
	measuredAt?: string | null;
}

export type Point = {
	id: string;
	name: string;
	position: google.maps.LatLngLiteral;
	address?: string;
	cadastralKey?: string | null;
	quantity?: number | null;
	latestValuation?: PointValuation | null;
}

export type SelectedPlace = {
	position: google.maps.LatLngLiteral;
	name?: string;
	address?: string;
}
