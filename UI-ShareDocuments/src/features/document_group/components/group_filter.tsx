import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import { DocumentStatus, DOCUMENT_STATUS_LABEL } from "@/common/constants/document_status";
import type { GroupFilterParams } from "../group_type";
import type { GetPublishedGroupParams } from "../group_type";


interface GroupFilterProps {
    filters: GroupFilterParams;
    onChange: (filters: GroupFilterParams) => void;
}

const STATUS_OPTIONS = Object.values(DocumentStatus);

export function GroupFilter({ filters, onChange }: GroupFilterProps) {
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onChange({ ...filters, search: debouncedSearch, pageIndex: 1 });
    }, [debouncedSearch]);

    return (
        <div className="data-filter">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tiêu đề..."
            />

            <div className="data-select">
                <select
                    className="data-filter-status"
                    value={filters.status ?? ""}
                    onChange={(e) => onChange({ ...filters, status: e.target.value === "" ? undefined : (e.target.value as (typeof STATUS_OPTIONS)[number]), pageIndex: 1 })}>
                    <option value="">Tất cả trạng thái</option>
                    {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                            {DOCUMENT_STATUS_LABEL[status]}
                        </option>
                    ))}
                </select>

                <select className="data-filter-status" value={filters.isDeleted === undefined ? "" : String(filters.isDeleted)}
                    onChange={(e) => onChange({ ...filters, isDeleted: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}>
                    <option value="">Tất cả lưu trữ</option>
                    <option value="false">Chưa xóa</option>
                    <option value="true">Đã xóa</option>
                </select>
            </div>
        </div>
    );
}


interface PublishedGroupFilterProps {
    filters: GetPublishedGroupParams;
    onChange: (filters: GetPublishedGroupParams) => void;
}

export function PublishedGroupFilter({ filters, onChange }: PublishedGroupFilterProps) {
    const [search, setSearch] = useState(filters.search ?? "");
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        onChange({ ...filters, search: debouncedSearch, pageIndex: 1 });
    }, [debouncedSearch]);

    return (
        <div className="data-filter">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tiêu đề..."
            />
        </div>
    );
}