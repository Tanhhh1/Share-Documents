import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { DocumentList } from "@/features/document/components/document_list";
import { PublishedDocumentFilter } from "@/features/document/components/document_filter";
import { usePublishedDocuments } from "@/features/document/use_document";
import type { PublishedDocumentFilterParams } from "@/features/document/document_type";

const PAGE_SIZE = 12;

type ListVariant = "vertical" | "horizontal";

export default function DocumentResultPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [variant, setVariant] = useState<ListVariant>("horizontal");

    const groupName = (location.state as { groupName?: string } | null)?.groupName;

    const [filters, setFilters] = useState<PublishedDocumentFilterParams>(() => ({
        keyword: searchParams.get("keyword") ?? undefined,
        groupId: searchParams.get("groupId") ? Number(searchParams.get("groupId")) : undefined,
        pageIndex: 1,
        pageSize: PAGE_SIZE,
    }));

    useEffect(() => {
        const keyword = searchParams.get("keyword") ?? undefined;
        const groupId = searchParams.get("groupId") ? Number(searchParams.get("groupId")) : undefined;
        setFilters((prev) =>
            prev.keyword === keyword && prev.groupId === groupId
                ? prev
                : { ...prev, keyword, groupId, pageIndex: 1 }
        );
    }, [searchParams]);

    const { data, isLoading } = usePublishedDocuments(filters);

    const handlePageChange = (pageIndex: number) => {
        setFilters((prev) => ({ ...prev, pageIndex }));
    };

    const title = filters.groupId
        ? `Tài liệu thuộc nhóm "${groupName ?? "..."}"`
        : filters.keyword
          ? `Kết quả từ khoá "${filters.keyword}"`
          : "Danh sách tài liệu";

    return (
        <div className="document-result-page">
            <div className="document-result-header">
                <PublishedDocumentFilter filters={filters} onChange={setFilters} />
            </div>

            <div className="document-result-list-header">
                <div className="document-result-title-group">
                    <h2 className="document-result-title">{title}</h2>
                </div>

                <div className="document-result-variant-toggle">
                    <button
                        type="button"
                        className={`variant-toggle-btn ${variant === "horizontal" ? "active" : ""}`}
                        title="Dạng danh sách"
                        onClick={() => setVariant("horizontal")}>
                        <i className="bx bx-list-ul"></i>
                    </button>
                    <button
                        type="button"
                        className={`variant-toggle-btn ${variant === "vertical" ? "active" : ""}`}
                        title="Dạng lưới"
                        onClick={() => setVariant("vertical")}>
                        <i className="bx bx-grid-alt"></i>
                    </button>
                </div>
            </div>

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                showStatus={false}
                variant={variant}
                getDetailPath={(id) => `/document/${id}`}
            />
        </div>
    );
}