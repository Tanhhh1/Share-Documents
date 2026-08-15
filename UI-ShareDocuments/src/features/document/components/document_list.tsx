import { Pagination } from "@/common/components/pagination";
import { DocumentCard } from "@/common/components/card_document";
import type { DocumentDto } from "../document_type";
import type { PageList } from "@/common/types/page_list_type";

interface DocumentListProps {
    pageData?: PageList<DocumentDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
}

export function DocumentList({ pageData, isLoading, onPageChange }: DocumentListProps) {
    return (
        <>
            <div className="card-document-grid">
                {pageData?.items.map((document) => (
                    <DocumentCard key={document.id} document={document} />
                ))}
                {!isLoading && pageData?.items.length === 0 && <p className="card-empty">Không có tài liệu nào</p>}
            </div>

            {pageData && (
                <Pagination
                    pageIndex={pageData.pageIndex}
                    totalPages={pageData.totalPages}
                    hasPrevious={pageData.hasPrevious}
                    hasNext={pageData.hasNext}
                    onPageChange={onPageChange}
                />
            )}
        </>
    );
}