// src/pages/document/list_document.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "@/features/document/use_document";
import { DocumentList } from "@/features/document/components/document_list";
import { DocumentFilter } from "@/features/document/components/document_filter";
import type { DocumentFilterParams } from "@/features/document/document_type";
import "@/styles/admin/document.css";

const DEFAULT_FILTERS: DocumentFilterParams = {
    pageIndex: 1,
    pageSize: 12,
};

export default function DocumentPage() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<DocumentFilterParams>(DEFAULT_FILTERS);
    const { data, isLoading } = useDocuments(filters);

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản Lý Tài Liệu</h2>
                <button className="page-create" onClick={() => navigate("/admin/document/create")}>
                    + Tạo tài liệu mới
                </button>

            </div>

            <DocumentFilter filters={filters} onChange={setFilters} />

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                getDetailPath={(id) => `/admin/document/${id}`}
            />
        </div>
    );
}