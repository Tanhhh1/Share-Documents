import { Pagination } from "@/common/components/pagination";
import { MyDocumentCard } from "@/common/components/card_document";
import type { DocumentDto } from "../document_type";
import type { PageList } from "@/common/types/page_list_type";

interface MyDocumentListProps {
    pageData?: PageList<DocumentDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
    onCardClick?: (id: number) => void;
}

export function MyDocumentList({ pageData, isLoading, onPageChange, onDelete, onRestore, onCardClick }: MyDocumentListProps) {
    return (
        <>
            <div className="card-document-list">
                {pageData?.items.map((document) => (
                    <MyDocumentCard
                        key={document.id}
                        document={document}
                        onClick={onCardClick}
                        onDelete={onDelete}
                        onRestore={onRestore}
                    />
                ))}
                {!isLoading && pageData?.items.length === 0 && (
                    <p className="card-empty">Không có tài liệu nào</p>
                )}
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