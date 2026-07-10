import { PreviewPreAppraisalQuery } from '@/generated-types'

export type PreAppraisalPreview = PreviewPreAppraisalQuery['previewPreAppraisal']
export type PreAppraisalPreviewSample = PreAppraisalPreview['samples'][number]

export type PreAppraisalCreateForm = {
    targetAddress: string;
    targetLatitude: number | null;
    targetLongitude: number | null;
    targetPropertyId: string | null;
    radiusMeters: string;
    sectorFilter: string;
}

export type ChartPoint = {
    year: number;
    value: number;
    valuationCount?: number;
    propertyCount?: number;
}
