import type { FieldError } from "@/common/types/api_result_type";

function toCamelCase(propertyName: string): string {
    return propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
}

// các lỗi có propertyName
export function mapFieldErrors<T extends string>(errors?: FieldError[] | null): Partial<Record<T, string>> {
    const result: Partial<Record<T, string>> = {};
    if (!errors) return result;
    for (const err of errors) {
        if (err.propertyName) {
            result[toCamelCase(err.propertyName) as T] = err.errorMessage;
        }
    }
    return result;
}

// các lỗi nghiệp vụ chung
export function getGeneralErrors(errors?: FieldError[] | null): string | undefined {
    if (!errors || errors.length === 0) return undefined;
    return errors.find((e) => !e.propertyName)?.errorMessage;
}