import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyDocuments, useCreateDocument, useDeleteDocument, useRestoreDocument } from "@/features/document/use_document";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { MyDocumentList } from "@/features/document/components/my_document_list";
import { MyDocumentFilter } from "@/features/document/components/document_filter";
import { DocumentFormModal } from "@/features/document/components/document_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import "@/styles/admin/document.css";
import type { DocumentFilterParams, CreateDocumentRequest } from "@/features/document/document_type";
import type { FieldError } from "@/common/types/api_result_type";

const DEFAULT_FILTERS: DocumentFilterParams = {
    pageIndex: 1,
    pageSize: 12,
};

export default function MyDocumentPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<DocumentFilterParams>(DEFAULT_FILTERS);
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
    const [selectedRestoreId, setSelectedRestoreId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [restoreError, setRestoreError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

    const { data, isLoading } = useMyDocuments(filters);
    const createMutation = useCreateDocument();
    const deleteMutation = useDeleteDocument();
    const restoreMutation = useRestoreDocument();

    const handleCardClick = (id: number) => {
        navigate(`/admin/document/${id}`);
    };

    const handleSubmitForm = (payload: CreateDocumentRequest) => {
        setFormErrors(null);
        createMutation.mutate(payload, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    formModal.close();
                } else {
                    setFormErrors(result.errors ?? null);
                }
            },
        });
    };

    const handleOpenDeleteConfirm = (id: number) => {
        setSelectedDeleteId(id);
        setDeleteError(undefined);
        deleteDialog.open();
    };

    const handleOpenRestoreConfirm = (id: number) => {
        setSelectedRestoreId(id);
        setRestoreError(undefined);
        restoreDialog.open();
    };

    const handleConfirmDelete = () => {
        if (!selectedDeleteId) return;
        setDeleteError(undefined);
        deleteMutation.mutate(selectedDeleteId, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    deleteDialog.close();
                    setSelectedDeleteId(null);
                } else {
                    setDeleteError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleConfirmRestore = () => {
        if (!selectedRestoreId) return;
        setRestoreError(undefined);
        restoreMutation.mutate(selectedRestoreId, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    restoreDialog.close();
                    setSelectedRestoreId(null);
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
                <h2>Tài Liệu Của Tôi</h2>
            </div>

            <MyDocumentFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <MyDocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                onDelete={handleOpenDeleteConfirm}
                onRestore={handleOpenRestoreConfirm}
                onCardClick={handleCardClick}
            />

            <DocumentFormModal
                isOpen={formModal.isOpen}
                isLoading={createMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xóa tài liệu"
                message="Bạn có chắc chắn muốn xóa tài liệu này không?"
                confirmText="Xóa"
                cancelText="Hủy"
                error={deleteError}
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
                onCancel={deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={restoreDialog.isOpen}
                title="Khôi phục tài liệu"
                message="Bạn có chắc chắn muốn khôi phục tài liệu này không?"
                confirmText="Khôi phục"
                cancelText="Hủy"
                error={restoreError}
                isLoading={restoreMutation.isPending}
                onConfirm={handleConfirmRestore}
                onCancel={restoreDialog.close}
            />
        </div>
    );
}