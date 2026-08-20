import { useNavigate } from "react-router-dom";
import { Pagination } from "@/common/components/pagination";
import { DocumentCard } from "@/features/document/components/document_card";
import type { DocumentDto } from "../document_type";
import type { PageList } from "@/common/types/page_list_type";

interface DocumentListProps {
    pageData?: PageList<DocumentDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
    showStatus?: boolean;
    getDetailPath?: (id: number) => string;
    onCardClick?: (id: number) => void;
    variant?: "vertical" | "horizontal";
    onEdit?: (document: DocumentDto) => void;
    onDelete?: (document: DocumentDto) => void;
    onRestore?: (document: DocumentDto) => void;
}

export function DocumentList({
    pageData,
    isLoading,
    onPageChange,
    showStatus = true,
    getDetailPath,
    onCardClick,
    variant = "vertical",
    onEdit,
    onDelete,
    onRestore,
}: DocumentListProps) {
    const navigate = useNavigate();

    const handleClick = (id: number) => {
        if (getDetailPath) navigate(getDetailPath(id));
        onCardClick?.(id);
    };

    const listClassName = variant === "horizontal" ? "document-list-horizontal" : "document-list";

    return (
        <>
            <div className={listClassName}>
                {pageData?.items.map((document) =>
                    variant === "horizontal" ? (
                        <DocumentCard
                            key={document.id}
                            variant="horizontal"
                            document={document}
                            showStatus={showStatus}
                            onClick={getDetailPath || onCardClick ? handleClick : undefined}
                            onEdit={onEdit ? () => onEdit(document) : undefined}
                            onDelete={onDelete ? () => onDelete(document) : undefined}
                            onRestore={onRestore ? () => onRestore(document) : undefined}
                        />
                    ) : (
                        <DocumentCard
                            key={document.id}
                            variant="vertical"
                            document={document}
                            showStatus={showStatus}
                            onClick={getDetailPath || onCardClick ? handleClick : undefined}
                        />
                    )
                )}
                {!isLoading && pageData?.items.length === 0 && <p className="card-empty">Không có tài liệu nào</p>}
            </div>

            {pageData && pageData.items.length > 0 && (
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