import "@/styles/component/pagination.css";

interface PaginationProps {
    pageIndex: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
    onPageChange: (pageIndex: number) => void;
}

export function Pagination({
    pageIndex,
    totalPages,
    hasPrevious,
    hasNext,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="pagination">
            <button className="pagination-btn" onClick={() => onPageChange(pageIndex - 1)} disabled={!hasPrevious}>
                Trước
            </button>
            <span className="pagination-info">
                Trang {pageIndex} / {totalPages}
            </span>
            <button className="pagination-btn" onClick={() => onPageChange(pageIndex + 1)} disabled={!hasNext}>
                Sau
            </button>
        </div>
    );
}