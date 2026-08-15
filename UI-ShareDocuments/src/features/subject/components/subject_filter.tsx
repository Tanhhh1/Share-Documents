import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { useDebounce } from "@/common/hooks/use_debounce";
import { EDUCATION_LEVEL_LABEL, GENERAL_EDUCATION_LEVELS, type EducationLevel } from "@/common/constants/education_level";
import type { SubjectFilterParams } from "../subject_type";

interface SubjectFilterProps {
    filters: SubjectFilterParams;
    onChange: (filters: SubjectFilterParams) => void;
    onClear: () => void;
}

export function SubjectFilter({ filters, onChange, onClear }: SubjectFilterProps) {
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
                placeholder="Tìm theo tên môn học..."
            />

            <select
                className="page-filter-status"
                value={filters.educationLevel ?? ""}
                onChange={(e) => onChange({ ...filters, educationLevel: (e.target.value as EducationLevel) || undefined, pageIndex: 1 })}
            >
                {GENERAL_EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                        {EDUCATION_LEVEL_LABEL[level]}
                    </option>
                ))}
            </select>

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