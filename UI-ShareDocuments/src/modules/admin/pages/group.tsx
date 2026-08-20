import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentGroups, useApproveGroup, useRejectGroup } from "@/features/document_group/use_group";
import { useCrudModal } from "@/common/hooks/use_modal";
import { GroupFilter } from "@/features/document_group/components/group_filter";
import { DocumentGroupList } from "@/features/document_group/components/group_list";
import { ApproveGroupDialog } from "@/features/document_group/components/approve_group";
import { RejectGroupDialog } from "@/features/document_group/components/reject_group";
import type { GroupDto, GroupFilterParams } from "@/features/document_group/group_type";

const DEFAULT_FILTERS: GroupFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function DocumentGroupPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<GroupFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<GroupDto>();
    const { data, isLoading } = useDocumentGroups(filters);
    const approveMutation = useApproveGroup();
    const rejectMutation = useRejectGroup();

    const handleView = (group: GroupDto) => {
        navigate(`/admin/document-group/${group.id}/document`, {
            state: { title: group.title, description: group.description },
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Quản lý Nhóm Chủ Đề</h2>
            </div>

            <GroupFilter filters={filters} onChange={setFilters} />

            <DocumentGroupList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onApprove={crud.openDelete} 
                onReject={crud.openEdit}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                onView={handleView}
            />

            <ApproveGroupDialog
                isOpen={crud.deleteDialog.isOpen}
                group={crud.selectedItem ?? undefined}
                isLoading={approveMutation.isPending}
                apiErrors={ crud.actionError ? [{ propertyName: null, errorMessage: crud.actionError }] : null }
                onClose={crud.deleteDialog.close}
                onConfirm={() => crud.submitConfirm(approveMutation.mutate, crud.deleteDialog)}
            />

            <RejectGroupDialog
                isOpen={crud.formModal.isOpen}
                group={crud.selectedItem ?? undefined}
                isLoading={rejectMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onConfirm={(reason: string) => {
                    if (!crud.selectedItem) return;
                    crud.submitForm(rejectMutation.mutate, { id: crud.selectedItem.id, reason });
                }}
            />
        </div>
    );
}