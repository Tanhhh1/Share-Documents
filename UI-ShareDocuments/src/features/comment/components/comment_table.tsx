import { Table, type TableColumn } from "@/common/components/table";
import { Pagination } from "@/common/components/pagination";
import type { ListCommentDto } from "../comment_type";
import type { PageList } from "@/common/types/page_list_type";

interface CommentTableProps {
    pageData?: PageList<ListCommentDto>;
    isLoading: boolean;
    onHide: (comment: ListCommentDto) => void;
    onUnhide: (comment: ListCommentDto) => void;
    onPageChange: (pageIndex: number) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("vi-VN");
}

export function CommentTable({ pageData, isLoading, onHide, onUnhide, onPageChange }: CommentTableProps) {
    const columns: TableColumn<ListCommentDto>[] = [
        { key: "id", header: "ID", render: (row) => row.id },
        { key: "documentTitle", header: "Tài liệu", render: (row) => row.documentTitle },
        { key: "userName", header: "Người bình luận", render: (row) => row.userName },
        {
            key: "content",
            header: "Nội dung",
            render: (row) => (
                <span className="comment-content-cell" title={row.content}>
                    {row.content}
                </span>
            ),
        },
        {
            key: "parentCommentId",
            header: "Trả lời",
            render: (row) => (row.parentCommentId ? `#${row.parentCommentId}` : "-"),
        },
        {
            key: "isDeleted",
            header: "Trạng thái",
            render: (row) => (
                <span className={row.isDeleted ? "badge badge-locked" : "badge badge-active"}>
                    {row.isDeleted ? "Đã ẩn" : "Hiển thị"}
                </span>
            ),
        },
        { key: "createdAt", header: "Thời gian", render: (row) => formatDate(row.createdAt) },
        {
            key: "actions",
            header: "Hành động",
            render: (row) => (
                <div className="table-actions">
                    {row.isDeleted ? (
                        <button type="button" className="table-action-btn unlock" title="Bỏ ẩn bình luận" onClick={() => onUnhide(row)}>
                            <i className="bx bx-show"></i>
                        </button>
                    ) : (
                        <button type="button" className="table-action-btn lock" title="Ẩn bình luận" onClick={() => onHide(row)}>
                            <i className="bx bx-hide"></i>
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="table-wrapper">
            <Table
                columns={columns}
                data={pageData?.items ?? []}
                isLoading={isLoading}
                getRowKey={(row) => row.id}
                emptyMessage="Không có bình luận nào"
            />
            {pageData && (
                <Pagination
                    pageIndex={pageData.pageIndex}
                    totalPages={pageData.totalPages}
                    hasPrevious={pageData.hasPrevious}
                    hasNext={pageData.hasNext}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}