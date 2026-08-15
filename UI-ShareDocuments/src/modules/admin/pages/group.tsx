import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentGroups } from "@/features/document_group/use_group";
import { useApproveGroup, useRejectGroup } from "@/features/document_group/use_group";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { DocumentGroupFilter } from "@/features/document_group/components/group_filter";
import { DocumentGroupList } from "@/features/document_group/components/group_list";
import { ApproveGroupDialog } from "@/features/document_group/components/approve_group";
import { RejectGroupDialog } from "@/features/document_group/components/reject_group";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { GroupDto, GroupFilterParams } from "@/features/document_group/group_type";
import type { FieldError } from "@/common/types/api_result_type";

import "@/styles/admin/group.css";

const DEFAULT_FILTERS: GroupFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function DocumentGroupPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<GroupFilterParams>(DEFAULT_FILTERS);
    const [selectedGroup, setSelectedGroup] = useState<GroupDto | null>(null);
    const [approveError, setApproveError] = useState<string | undefined>();
    const [rejectErrors, setRejectErrors] = useState<FieldError[] | null>(null);

    const approveDialog = useDisclosure();
    const rejectDialog = useDisclosure();

    const { data, isLoading } = useDocumentGroups(filters);
    const approveMutation = useApproveGroup();
    const rejectMutation = useRejectGroup();

    const handleView = (group: GroupDto) => {
        navigate(`/admin/document-group/${group.id}/document`, {
            state: { title: group.title, description: group.description },
        });
    };

    const handleOpenApprove = (group: GroupDto) => {
        setSelectedGroup(group);
        setApproveError(undefined);
        approveDialog.open();
    };

    const handleOpenReject = (group: GroupDto) => {
        setSelectedGroup(group);
        setRejectErrors(null);
        rejectDialog.open();
    };

    const handleConfirmApprove = () => {
        if (!selectedGroup) return;
        setApproveError(undefined);
        approveMutation.mutate(selectedGroup.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    approveDialog.close();
                } else {
                    setApproveError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleSubmitReject = (reason: string) => {
        if (!selectedGroup) return;
        setRejectErrors(null);
        rejectMutation.mutate(
            { id: selectedGroup.id, reason },
            {
                onSuccess: (result) => {
                    if (result.succeeded) {
                        rejectDialog.close();
                    } else {
                        setRejectErrors(result.errors ?? null);
                    }
                },
            }
        );
    };

    const handleClearFilter = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản lý nhóm chủ đề</h2>
            </div>

            <DocumentGroupFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <DocumentGroupList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onApprove={handleOpenApprove}
                onReject={handleOpenReject}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                onView={handleView}
            />

            <ApproveGroupDialog
                isOpen={approveDialog.isOpen}
                group={selectedGroup ?? undefined}
                isLoading={approveMutation.isPending}
                apiErrors={approveError ? [{ propertyName: null, errorMessage: approveError }] : null}
                onClose={approveDialog.close}
                onConfirm={handleConfirmApprove}
            />

            <RejectGroupDialog
                isOpen={rejectDialog.isOpen}
                group={selectedGroup ?? undefined}
                isLoading={rejectMutation.isPending}
                apiErrors={rejectErrors}
                onClose={rejectDialog.close}
                onConfirm={handleSubmitReject}
            />
        </div>
    );
}