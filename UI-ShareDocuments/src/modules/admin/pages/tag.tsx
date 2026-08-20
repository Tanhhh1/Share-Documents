import { useState } from "react";
import { useTags, useCreateTag, useUpdateTag, useDeleteTag, useRestoreTag } from "@/features/tag/use_tag";
import { useCrudModal } from "@/common/hooks/use_modal";
import { TagTable } from "@/features/tag/components/tag_table";
import { TagFilter } from "@/features/tag/components/tag_filter";
import { TagFormModal } from "@/features/tag/components/tag_form";
import { ConfirmDialog } from "@/common/components/confirm";
import type { TagDto, TagFilterParams, CreateTagRequest, UpdateTagRequest } from "@/features/tag/tag_type";

const DEFAULT_FILTERS: TagFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function TagPage() {
    const [filters, setFilters] = useState<TagFilterParams>(DEFAULT_FILTERS);

    const crud = useCrudModal<TagDto>();

    const { data, isLoading } = useTags(filters);
    const createMutation = useCreateTag();
    const updateMutation = useUpdateTag();
    const deleteMutation = useDeleteTag();
    const restoreMutation = useRestoreTag();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Quản Lý Thẻ Phân Loại</h2>
                <button className="admin-page-create" onClick={crud.openCreate}>
                    + Tạo Thẻ Phân Loại
                </button>
            </div>

            <TagFilter filters={filters} onChange={setFilters} />

            <TagTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <TagFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateTagRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateTagRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa tag"
                message={`Bạn có chắc muốn xóa tag "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục tag"
                message={`Bạn có chắc muốn khôi phục tag "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}