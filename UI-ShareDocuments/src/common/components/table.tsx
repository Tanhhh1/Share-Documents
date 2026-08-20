import type { ReactNode } from "react";

export interface TableColumn<T> {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    width?: string;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    isLoading?: boolean;
    getRowKey: (row: T) => string | number;
    emptyMessage?: string;
}

export function Table<T>({
    columns,
    data,
    isLoading = false,
    getRowKey,
    emptyMessage = "Không có dữ liệu",
}: TableProps<T>) {
    return (
        <table className="table">
            <thead>
                <tr>{columns.map((column) => (<th key={column.key} style={{ width: column.width }}>{column.header}</th>))}</tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={columns.length} className="table-state">
                            Đang tải dữ liệu...
                        </td>
                    </tr>
                ) : data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="table-state">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    data.map((row) => (
                        <tr key={getRowKey(row)}>
                            {columns.map((column) => (
                                <td key={column.key}>{column.render(row)}</td>
                            ))}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}