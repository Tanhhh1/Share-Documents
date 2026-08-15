import { useState } from "react";
import { useTags } from "@/features/tag/use_tag";
import { useCreateTag, useUpdateTag, useDeleteTag, useRestoreTag } from "@/features/tag/use_tag";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { TagTable } from "@/features/tag/components/tag_table";
import { TagFilter } from "@/features/tag/components/tag_filter";
import { TagFormModal } from "@/features/tag/components/tag_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { TagDto, TagFilterParams, CreateTagRequest, UpdateTagRequest } from "@/features/tag/tag_type";
import type { FieldError } from "@/common/types/api_result_type";

type FormMode = "create" | "update";

const DEFAULT_FILTERS: TagFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function TagPage() {
    const [filters, setFilters] = useState<TagFilterParams>(DEFAULT_FILTERS);
    const [selectedTag, setSelectedTag] = useState<TagDto | null>(null);
    const [formMode, setFormMode] = useState<FormMode>("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [restoreError, setRestoreError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

    const { data, isLoading } = useTags(filters);
    const createMutation = useCreateTag();
    const updateMutation = useUpdateTag();
    const deleteMutation = useDeleteTag();
    const restoreMutation = useRestoreTag();

    const handleOpenCreate = () => {
        setFormMode("create");
        setSelectedTag(null);
        setFormErrors(null);
        formModal.open();
    };

    const handleOpenEdit = (tag: TagDto) => {
        setFormMode("update");
        setSelectedTag(tag);
        setFormErrors(null);
        formModal.open();
    };

    const handleSubmitForm = (payload: CreateTagRequest | UpdateTagRequest) => {
        setFormErrors(null);
        const onSettled = (result: { succeeded: boolean; errors?: FieldError[] }) => {
            if (result.succeeded) {
                formModal.close();
            } else {
                setFormErrors(result.errors ?? null);
            }
        };

        if (formMode === "create") {
            createMutation.mutate(payload as CreateTagRequest, { onSuccess: onSettled });
        } else {
            updateMutation.mutate(payload as UpdateTagRequest, { onSuccess: onSettled });
        }
    };

    const handleOpenDelete = (tag: TagDto) => {
        setSelectedTag(tag);
        setDeleteError(undefined);
        deleteDialog.open();
    };

    const handleOpenRestore = (tag: TagDto) => {
        setSelectedTag(tag);
        setRestoreError(undefined);
        restoreDialog.open();
    };

    const handleConfirmDelete = () => {
        if (!selectedTag) return;
        setDeleteError(undefined);
        deleteMutation.mutate(selectedTag.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    deleteDialog.close();
                } else {
                    setDeleteError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleConfirmRestore = () => {
        if (!selectedTag) return;
        setRestoreError(undefined);
        restoreMutation.mutate(selectedTag.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    restoreDialog.close();
                } else {
                    setRestoreError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleClearFilter = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản Lý Thẻ Phân Loại</h2>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Thẻ Phân Loại
                </button>
            </div>

            <TagFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <TagTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onRestore={handleOpenRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <TagFormModal
                isOpen={formModal.isOpen}
                mode={formMode}
                initialValues={selectedTag ?? undefined}
                isLoading={formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xóa tag"
                message={`Bạn có chắc muốn xóa tag "${selectedTag?.name}"?`}
                error={deleteError}
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
                onCancel={deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={restoreDialog.isOpen}
                title="Khôi phục tag"
                message={`Bạn có chắc muốn khôi phục tag "${selectedTag?.name}"?`}
                error={restoreError}
                isLoading={restoreMutation.isPending}
                onConfirm={handleConfirmRestore}
                onCancel={restoreDialog.close}
            />
        </div>
    );
}