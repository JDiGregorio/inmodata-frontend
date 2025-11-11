export interface ModelDefinition {
    singular: string;
    plural: string;
}

export type Align = "left" | "center" | "right"
export type TextCase = "normal" | "upper" | "lower" | "capitalize"
type CellAffix = | string | ((value: any, row: any) => string | number | null | undefined)

export type Header = {
    key: string;
    label: string;
    sortable: boolean;
    filterable: boolean;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    align?: Align;
    textCase?: TextCase;
    prefix?: CellAffix;
    suffix?: CellAffix;
}

export type DataRow<T> = {
    row?: T;
    values: Record<string, string | number | undefined>;
}