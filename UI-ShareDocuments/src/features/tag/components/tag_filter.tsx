import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { TagFilterParams } from "../types/tag_type";

interface TagFilterProps {
    filters: TagFilterParams;
    onChange: (filters: TagFilterParams) => void;
    onClear: () => void;
}

export function TagFilter({ filters, onChange, onClear }: TagFilterProps) {
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
                placeholder="Tìm theo tên tag..."
            />

            <select
                className="page-filter-status"
                value={filters.isDeleted === undefined ? "" : String(filters.isDeleted)}
                onChange={(e) => onChange({ ...filters, isDeleted: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}
            >
                <option value="">Tất cả trạng thái</option>
                <option value="false">Hoạt động</option>
                <option value="true">Đã xóa</option>
            </select>

            <Button className="page-filter-clear" onClick={onClear}>
                Xóa lọc
            </Button>
        </div>
    );
}