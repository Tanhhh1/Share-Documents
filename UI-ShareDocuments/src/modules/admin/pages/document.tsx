import { useState } from "react";
import { useDocuments, useCreateDocument } from "@/features/document/use_document";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { DocumentList } from "@/features/document/components/document_list";
import { DocumentFilter } from "@/features/document/components/document_filter";
import { DocumentFormModal } from "@/features/document/components/document_form";
import "@/styles/admin/document.css";
import type { DocumentFilterParams, CreateDocumentRequest } from "@/features/document/document_type";
import type { FieldError } from "@/common/types/api_result_type";

const DEFAULT_FILTERS: DocumentFilterParams = {
    pageIndex: 1,
    pageSize: 12,
};

export default function DocumentPage() {
    const [filters, setFilters] = useState<DocumentFilterParams>(DEFAULT_FILTERS);
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);

    const formModal = useDisclosure();

    const { data, isLoading } = useDocuments(filters);
    const createMutation = useCreateDocument();

    const handleOpenCreate = () => {
        setFormErrors(null);
        formModal.open();
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

    const handleClearFilter = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản Lý Tài Liệu</h2>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Tài Liệu
                </button>
            </div>

            <DocumentFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <DocumentFormModal
                isOpen={formModal.isOpen}
                isLoading={createMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />
        </div>
    );
}