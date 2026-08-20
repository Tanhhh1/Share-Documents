interface ActionOptions<TData, TResult> {
    mutate: (data: TData, options: { onSuccess: (res: TResult) => void }) => void;
    payload: TData;
    onSuccess: () => void;
    onError: (errors: any) => void;
}

export function handleCrudAction<TData, TResult extends { succeeded: boolean; errors?: any }>({
    mutate,
    payload,
    onSuccess,
    onError,
}: ActionOptions<TData, TResult>) {
    mutate(payload, {
        onSuccess: (result) => {
            if (result.succeeded) {
                onSuccess();
            } else {
                onError(result.errors);
            }
        },
    });
}