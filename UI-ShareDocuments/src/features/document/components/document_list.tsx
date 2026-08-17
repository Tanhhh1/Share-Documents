import { useNavigate } from "react-router-dom";
import { Pagination } from "@/common/components/pagination";
import { DocumentCard } from "@/common/components/card_document";
import type { DocumentDto } from "../document_type";
import type { PageList } from "@/common/types/page_list_type";

interface DocumentListProps {
    pageData?: PageList<DocumentDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
    showStatus?: boolean;
    getDetailPath?: (id: number) => string;
    onCardClick?: (id: number) => void;
}

export function DocumentList({
    pageData,
    isLoading,
    onPageChange,
    showStatus = true,
    getDetailPath,
    onCardClick,
}: DocumentListProps) {
    const navigate = useNavigate();

    const handleClick = (id: number) => {
        if (getDetailPath) navigate(getDetailPath(id));
        onCardClick?.(id);
    };

    return (
        <>
            <div className="card-document-grid">
                {pageData?.items.map((document) => (
                    <DocumentCard
                        key={document.id}
                        document={document}
                        showStatus={showStatus}
                        onClick={getDetailPath || onCardClick ? handleClick : undefined}
                    />
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