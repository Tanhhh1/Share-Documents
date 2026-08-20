import { useState } from "react";
import { useMyDocumentGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, useRestoreGroup } from "@/features/document_group/use_group";
import { useCrudModal } from "@/common/hooks/use_modal";
import { GroupFilter } from "@/features/document_group/components/group_filter";
import { MyGroupList } from "@/features/document_group/components/group_list";
import { GroupFormModal } from "@/features/document_group/components/group_form";
import { ConfirmDialog } from "@/common/components/confirm";
import type { GroupDto, GroupFilterParams, CreateGroupRequest, UpdateGroupRequest } from "@/features/document_group/group_type";

const DEFAULT_FILTERS: GroupFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function MyGroupPage() {
    const [filters, setFilters] = useState<GroupFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<GroupDto>();

    const { data, isLoading } = useMyDocumentGroups(filters);
    const createMutation = useCreateGroup();
    const updateMutation = useUpdateGroup();
    const deleteMutation = useDeleteGroup();
    const restoreMutation = useRestoreGroup();

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Nhóm Chủ Đề Của Tôi <a onClick={crud.openCreate}>+</a></h2>
                <p>Quản lý các nhóm chủ đề bạn đã tạo</p>
                <GroupFilter filters={filters} onChange={setFilters} />
            </div>

            <MyGroupList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <GroupFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateGroupRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateGroupRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa nhóm chủ đề"
                message={`Bạn có chắc muốn xóa nhóm "${crud.selectedItem?.title}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục nhóm chủ đề"
                message={`Bạn có chắc muốn khôi phục nhóm "${crud.selectedItem?.title}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}