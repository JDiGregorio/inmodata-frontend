import { PreviewPreAppraisalQuery } from '@/generated-types'

export type PreAppraisalPreview = PreviewPreAppraisalQuery['previewPreAppraisal']
export type PreAppraisalPreviewSample = PreAppraisalPreview['samples'][number]

export type PreAppraisalCreateForm = {
    name: string;
    targetAddress: string;
    targetLatitude: number | null;
    targetLongitude: number | null;
    targetPropertyId: string | null;
    radiusMeters: string;
    sectorFilter: string;
    valuationDate: string;
}

export type ChartPoint = {
    year: string;
    value: number;
}
