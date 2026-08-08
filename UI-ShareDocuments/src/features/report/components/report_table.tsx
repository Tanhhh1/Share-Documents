import { Table, type TableColumn } from "@/common/components/table";
import { Pagination } from "@/common/components/pagination";
import type { ReportDto } from "../types/report_type";
import type { PageList } from "@/common/types/page_list_type";

interface ReportTableProps {
    pageData?: PageList<ReportDto>;
    isLoading: boolean;
    onPageChange: (pageIndex: number) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("vi-VN");
}

export function ReportTable({ pageData, isLoading, onPageChange }: ReportTableProps) {
    const columns: TableColumn<ReportDto>[] = [
        { key: "id", header: "ID", render: (row) => row.id },
        { key: "documentTitle", header: "Tài liệu", render: (row) => row.documentTitle },
        { key: "userName", header: "Người báo cáo", render: (row) => row.userName },
        { key: "reason", header: "Lý do", render: (row) => row.reason },
        {
            key: "content",
            header: "Nội dung",
            render: (row) => (
                <span className="report-content-cell" title={row.content}>
                    {row.content}
                </span>
            ),
        },
        { key: "createdAt", header: "Thời gian", render: (row) => formatDate(row.createdAt) },
    ];

    return (
        <div className="table-wrapper">
            <Table
                columns={columns}
                data={pageData?.items ?? []}
                isLoading={isLoading}
                getRowKey={(row) => row.id}
                emptyMessage="Không có báo cáo nào"
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