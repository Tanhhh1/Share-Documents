export interface FieldError {
    propertyName: string | null;
    errorMessage: string;
}

export interface ApiResult<T> {
    succeeded: boolean;
    result: T | null;
    errors?: FieldError[];
}