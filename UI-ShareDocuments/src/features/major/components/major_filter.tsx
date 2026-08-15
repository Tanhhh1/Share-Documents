import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { MajorFilterParams } from "../major_type";

interface MajorFilterProps {
    filters: MajorFilterParams;
    onChange: (filters: MajorFilterParams) => void;
    onClear: () => void;
}

export function MajorFilter({ filters, onChange, onClear }: MajorFilterProps) {
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
                placeholder="Tìm theo tên ngành..."
            />

            <select
                className="page-filter-status"
                value={filters.isActive === undefined ? "" : String(filters.isActive)}
                onChange={(e) => onChange({ ...filters, isActive: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}
            >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Đã xóa</option>
            </select>

            <Button className="page-filter-clear" onClick={onClear}>
                Xóa lọc
            </Button>
        </div>
    );
}