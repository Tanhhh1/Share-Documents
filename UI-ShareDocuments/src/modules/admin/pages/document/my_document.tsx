import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyDocuments } from "@/features/document/use_document";
import { DocumentList } from "@/features/document/components/document_list";
import { DocumentFilter } from "@/features/document/components/document_filter";
import "@/styles/admin/document.css";
import type { DocumentFilterParams } from "@/features/document/document_type";

const DEFAULT_FILTERS: DocumentFilterParams = {
    pageIndex: 1,
    pageSize: 12,
};

export default function MyDocumentPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<DocumentFilterParams>(DEFAULT_FILTERS);
    const { data, isLoading } = useMyDocuments(filters);

    return (
        <div className="page">
            <div className="page-header">
                <h2>Tài Liệu Của Tôi</h2>
            </div>

            <DocumentFilter filters={filters} onChange={setFilters} />

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                showStatus={false}
                onCardClick={(id) => navigate(`/admin/document/${id}?from=mine`)}
            />
        </div>
    );
}