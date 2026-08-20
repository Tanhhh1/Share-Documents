import { useState } from "react";
import type { FieldError } from "@/common/types/api_result_type";

export function useFormAction<TParams>(
    mutationFn: (variables: TParams, options?: any) => void,
    successMessage: string
) {
    const [success, setSuccess] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldError[] | null>(null);

    const submit = (payload: TParams) => {
        setErrors(null);
        setSuccess(null);
        
        mutationFn(payload, {
            onSuccess: (result: any) => {
                if (result.succeeded) {
                    setSuccess(successMessage);
                } else {
                    setErrors(result.errors ?? null);
                }
            },
        });
    };

    return { success, errors, submit };
}