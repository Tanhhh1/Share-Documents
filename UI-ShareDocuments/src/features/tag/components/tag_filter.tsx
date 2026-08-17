import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { TagFilterParams } from "../tag_type";

interface TagFilterProps {
    filters: TagFilterParams;
    onChange: (filters: TagFilterParams) => void;
}

export function TagFilter({ filters, onChange }: TagFilterProps) {
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onChange({ ...filters, search: debouncedSearch, pageIndex: 1 });
    }, [debouncedSearch]);

    return (
        <div className="page-filter">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên thẻ phân loại..."
            />

            <div className="page-select">
                <select className="page-filter-status" value={filters.isDeleted === undefined ? "" : String(filters.isDeleted)}
                    onChange={(e) => onChange({ ...filters, isDeleted: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="false">Hoạt động</option>
                    <option value="true">Đã xóa</option>
                </select>
            </div>
        </div>
    );
}