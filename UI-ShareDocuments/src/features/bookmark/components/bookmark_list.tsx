import { Pagination } from "@/common/components/pagination";
import { BookmarkCard } from "./bookmark_card";
import type { BookmarkDto } from "../bookmark_type";
import type { PageList } from "@/common/types/page_list_type";

interface BookmarkListProps {
    pageData?: PageList<BookmarkDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
    onUnbookmark: (documentId: number) => void;
    unbookmarkingId?: number;
}

export function BookmarkList({ pageData, isLoading, onPageChange, onUnbookmark, unbookmarkingId }: BookmarkListProps) {
    return (
        <>
            <div className="bookmark-grid">
                {pageData?.items.map((bookmark) => (
                    <BookmarkCard
                        key={bookmark.id}
                        bookmark={bookmark}
                        onUnbookmark={onUnbookmark}
                        isUnbookmarking={unbookmarkingId === bookmark.documentId}
                    />
                ))}

                {!isLoading && pageData?.items.length === 0 && (
                    <p className="card-empty">Bạn chưa lưu tài liệu nào</p>
                )}
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