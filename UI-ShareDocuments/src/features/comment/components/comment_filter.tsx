import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { CommentFilterParams } from "../comment_type";

interface CommentFilterProps {
    filters: CommentFilterParams;
    onChange: (filters: CommentFilterParams) => void;
}

export function CommentFilter({ filters, onChange }: CommentFilterProps) {
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

            <div className="page-select">
                <input type="date" className="page-filter-input" value={filters.createdDate ?? ""}
                    onChange={(e) => onChange({ ...filters, createdDate: e.target.value || undefined, pageIndex: 1 })}
                />

                <select className="page-filter-status" value={filters.isDeleted === undefined ? "" : String(filters.isDeleted)}
                    onChange={(e) => onChange({ ...filters, isDeleted: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="false">Hiển thị</option>
                    <option value="true">Đã ẩn</option>
                </select>
            </div>
        </div>
    );
}