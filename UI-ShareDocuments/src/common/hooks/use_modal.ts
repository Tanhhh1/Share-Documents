import { useState } from "react";
import { useDisclosure } from "./use_disclosure";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";

export function useCrudModal<T>() {
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const [formMode, setFormMode] = useState<"create" | "update">("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [actionError, setActionError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

    const openCreate = () => {
        setFormMode("create");
        setSelectedItem(null);
        setFormErrors(null);
        formModal.open();
    };

    const openEdit = (item: T) => {
        setFormMode("update");
        setSelectedItem(item);
        setFormErrors(null);
        formModal.open();
    };

    const openDelete = (item: T) => {
        setSelectedItem(item);
        setActionError(undefined);
        deleteDialog.open();
    };

    const openRestore = (item: T) => {
        setSelectedItem(item);
        setActionError(undefined);
        restoreDialog.open();
    };

    const submitForm = <TPayload, TResult extends { succeeded: boolean; errors?: FieldError[] }>(
        mutateFn: (payload: TPayload, options: { onSuccess: (res: TResult) => void }) => void,
        payload: TPayload
    ) => {
        setFormErrors(null);
        mutateFn(payload, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    formModal.close();
                } else {
                    setFormErrors(result.errors ?? null);
                }
            },
        });
    };

    const submitConfirm = <TResult extends { succeeded: boolean; errors?: any }>(
        mutateFn: (id: any, options: { onSuccess: (res: TResult) => void }) => void,
        dialog: ReturnType<typeof useDisclosure>
    ) => {
        if (!selectedItem) return;
        setActionError(undefined);
        mutateFn((selectedItem as any).id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    dialog.close();
                } else {
                    setActionError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    return { selectedItem, formMode, formErrors, actionError, formModal, deleteDialog,
        restoreDialog, openCreate, openEdit, openDelete, openRestore, submitForm, submitConfirm,
    };
}