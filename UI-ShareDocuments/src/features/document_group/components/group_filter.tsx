import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import { DocumentStatus, DOCUMENT_STATUS_LABEL } from "@/common/constants/document_status";
import type { GroupFilterParams } from "../group_type";

interface DocumentGroupFilterProps {
    filters: GroupFilterParams;
    onChange: (filters: GroupFilterParams) => void;
}

const STATUS_OPTIONS = Object.values(DocumentStatus);

export function DocumentGroupFilter({ filters, onChange }: DocumentGroupFilterProps) {
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
                placeholder="Tìm theo tiêu đề..."
            />

            <div className="page-select">
                <select
                    className="page-filter-status"
                    value={filters.status ?? ""}
                    onChange={(e) => onChange({ ...filters, status: e.target.value === "" ? undefined : (e.target.value as (typeof STATUS_OPTIONS)[number]), pageIndex: 1 })}>
                    <option value="">Tất cả trạng thái</option>
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {DOCUMENT_STATUS_LABEL[status]}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}