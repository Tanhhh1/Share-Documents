import { useState } from "react";
import { useMyBookmarks, useDeleteBookmark } from "@/features/bookmark/use_bookmark";
import { BookmarkList } from "@/features/bookmark/components/bookmark_list";

const PAGE_SIZE = 10;

export default function BookmarkPage() {
    const [pageIndex, setPageIndex] = useState(1);

    const { data, isLoading } = useMyBookmarks({ pageIndex, pageSize: PAGE_SIZE });
    const deleteBookmark = useDeleteBookmark();

    const handleUnbookmark = (documentId: number) => {
        deleteBookmark.mutate(documentId);
    };

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Tài Liệu Đã Lưu</h2>
                <p>Danh sách tài liệu mà bạn có thể xem lại</p>
            </div>

            <BookmarkList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={setPageIndex}
                onUnbookmark={handleUnbookmark}
                unbookmarkingId={deleteBookmark.isPending ? deleteBookmark.variables : undefined}
            />
        </div>
    );
}