import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { CommentFilterParams } from "../comment_type";

interface CommentFilterProps {
    filters: CommentFilterParams;
    onChange: (filters: CommentFilterParams) => void;
    onClear: () => void;
}

export function CommentFilter({ filters, onChange, onClear }: CommentFilterProps) {
    const [keyword, setKeyword] = useState(filters.keyword ?? "");
    const debouncedKeyword = useDebounce(keyword, 500);

    useEffect(() => {
        onChange({ ...filters, keyword: debouncedKeyword, pageIndex: 1 });
    }, [debouncedKeyword]);

    return (
        <div className="page-filter">
            <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo nội dung bình luận..."
            />

            <input
                type="date"
                className="page-filter-input"
                value={filters.fromDate ?? ""}
                onChange={(e) => onChange({ ...filters, fromDate: e.target.value || undefined, pageIndex: 1 })}
            />

            <span className="comment-filter-date-separator">-</span>

            <input
                type="date"
                className="page-filter-input"
                value={filters.toDate ?? ""}
                min={filters.fromDate ?? undefined}
                onChange={(e) => onChange({ ...filters, toDate: e.target.value || undefined, pageIndex: 1 })}
            />

            <select
                className="page-filter-status"
                value={filters.isDeleted === undefined ? "" : String(filters.isDeleted)}
                onChange={(e) => onChange({ ...filters, isDeleted: e.target.value === "" ? undefined : e.target.value === "true",  pageIndex: 1 })}
            >
                <option value="">Tất cả trạng thái</option>
                <option value="false">Hiển thị</option>
                <option value="true">Đã ẩn</option>
            </select>

            <Button className="page-filter-clear" onClick={onClear}>
                Xóa lọc
            </Button>
        </div>
    );
}