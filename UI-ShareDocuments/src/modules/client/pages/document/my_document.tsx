import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyDocuments, useDeleteDocument, useRestoreDocument } from "@/features/document/use_document";
import { useCrudModal } from "@/common/hooks/use_modal";
import { DocumentList } from "@/features/document/components/document_list";
import { DocumentFilter } from "@/features/document/components/document_filter";
import { ConfirmDialog } from "@/common/components/confirm";
import type { DocumentDto, DocumentFilterParams } from "@/features/document/document_type";

const DEFAULT_FILTERS: DocumentFilterParams = {
    pageIndex: 1,
    pageSize: 12,
};

export default function MyDocumentPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<DocumentFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<DocumentDto>();

    const { data, isLoading } = useMyDocuments(filters);
    const deleteMutation = useDeleteDocument();
    const restoreMutation = useRestoreDocument();

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Tài Liệu Của Tôi</h2>
                <p>Quản lý các tài liệu bạn đã tải lên</p>
                <DocumentFilter filters={filters} onChange={setFilters} />
            </div>

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                showStatus={false}
                variant="horizontal"
                onCardClick={(id) => navigate(`/document/${id}`)}
                onEdit={(document) => navigate(`/document/${document.id}/edit`)}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa tài liệu"
                message={`Bạn có chắc muốn xóa tài liệu "${crud.selectedItem?.title}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục tài liệu"
                message={`Bạn có chắc muốn khôi phục tài liệu "${crud.selectedItem?.title}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}