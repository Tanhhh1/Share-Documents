export interface PageListParams {
    pageIndex: number;
    pageSize: number;
}

export interface PageList<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}