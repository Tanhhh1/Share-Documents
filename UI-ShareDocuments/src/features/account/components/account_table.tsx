import { Table, type TableColumn } from "@/common/components/table";
import { Pagination } from "@/common/components/pagination";
import type { AccountDto } from "../account_type";
import type { PageList } from "@/common/types/page_list_type";

interface AccountTableProps {
    pageData?: PageList<AccountDto>;
    isLoading: boolean;
    onEdit: (account: AccountDto) => void;
    onLock: (account: AccountDto) => void;
    onUnlock: (account: AccountDto) => void;
    onPageChange: (pageIndex: number) => void;
}

export function AccountTable({
    pageData,
    isLoading,
    onEdit,
    onLock,
    onUnlock,
    onPageChange,
}: AccountTableProps) {
    const columns: TableColumn<AccountDto>[] = [
        { key: "id", header: "ID", render: (row) => row.id },
        { key: "userName", header: "Tài khoản", render: (row) => row.userName },
        { key: "email", header: "Email", render: (row) => row.email },
        { key: "fullName", header: "Họ tên", render: (row) => row.fullName },
        { key: "roles", header: "Vai trò", render: (row) => row.roles.join(", ") },
        {
            key: "isActive",
            header: "Trạng thái",
            render: (row) => (
                <span className={row.isActive ? "badge badge-active" : "badge badge-locked"}>
                    {row.isActive ? "Hoạt động" : "Đã khóa"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Hành động",
            render: (row) => (
                <div className="table-actions">
                    <button type="button" className="table-action-btn edit" title="Sửa" onClick={() => onEdit(row)}>
                        <i className="bx bx-edit-alt"></i>
                    </button>
                    {row.isActive ? (
                        <button type="button" className="table-action-btn lock" title="Khóa tài khoản" onClick={() => onLock(row)}>
                            <i className="bx bx-lock-alt"></i>
                        </button>
                    ) : (
                        <button type="button" className="table-action-btn unlock" title="Mở khóa tài khoản" onClick={() => onUnlock(row)}>
                            <i className="bx bx-lock-open-alt"></i>
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
                emptyMessage="Không có tài khoản nào"
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