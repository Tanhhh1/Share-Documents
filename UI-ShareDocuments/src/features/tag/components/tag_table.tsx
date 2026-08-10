import { Table, type TableColumn } from "@/common/components/table";
import { Pagination } from "@/common/components/pagination";
import type { TagDto } from "../types/tag_type";
import type { PageList } from "@/common/types/page_list_type";

interface TagTableProps {
    pageData?: PageList<TagDto>;
    isLoading: boolean;
    onEdit: (tag: TagDto) => void;
    onDelete: (tag: TagDto) => void;
    onRestore: (tag: TagDto) => void;
    onPageChange: (pageIndex: number) => void;
}

function formatDate(value: string | null): string {
    if (!value) return "-";
    return new Date(value).toLocaleString("vi-VN");
}

export function TagTable({ pageData, isLoading, onEdit, onDelete, onRestore, onPageChange }: TagTableProps) {
    const columns: TableColumn<TagDto>[] = [
        { key: "id", header: "ID", render: (row) => row.id },
        { key: "name", header: "Tên tag", render: (row) => row.name },
        {
            key: "isDeleted",
            header: "Trạng thái",
            render: (row) => (
                <span className={row.isDeleted ? "badge badge-locked" : "badge badge-active"}>
                    {row.isDeleted ? "Đã xóa" : "Hoạt động"}
                </span>
            ),
        },
        { key: "createdAt", header: "Ngày tạo", render: (row) => formatDate(row.createdAt) },
        { key: "updatedAt", header: "Cập nhật", render: (row) => formatDate(row.updatedAt) },
        {
            key: "actions",
            header: "Hành động",
            render: (row) => (
                <div className="table-actions">
                    {!row.isDeleted && (
                        <button type="button" className="table-action-btn edit" title="Sửa" onClick={() => onEdit(row)}>
                            <i className="bx bx-edit-alt"></i>
                        </button>
                    )}
                    {row.isDeleted ? (
                        <button type="button" className="table-action-btn unlock" title="Khôi phục" onClick={() => onRestore(row)}>
                            <i className="bx bx-undo"></i>
                        </button>
                    ) : (
                        <button type="button" className="table-action-btn lock" title="Xóa" onClick={() => onDelete(row)}>
                            <i className="bx bx-trash"></i>
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
                emptyMessage="Không có thẻ phân loại nào"
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