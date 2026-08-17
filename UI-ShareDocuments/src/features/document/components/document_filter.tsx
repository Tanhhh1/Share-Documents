import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import { DOCUMENT_STATUS_LABEL, DOCUMENT_STATUSES } from "@/common/constants/document_status";
import { ACCESS_LEVEL_LABEL, ACCESS_LEVELS } from "@/common/constants/access_level";
import { SubjectSelect } from "@/features/subject/components/subject_select";
import { TagMultiSelect } from "@/features/tag/components/tag_select";
import type { DocumentFilterParams } from "../document_type";

interface DocumentFilterProps {
    filters: DocumentFilterParams;
    onChange: (filters: DocumentFilterParams) => void;
}

export function DocumentFilter({ filters, onChange }: DocumentFilterProps) {
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
                placeholder="Tìm theo tiêu đề tài liệu..."
            />
            <div className="page-select">
                <select className="page-filter-status" value={filters.accessLevel ?? ""}
                    onChange={(e) => onChange({ ...filters, accessLevel: e.target.value === "" ? undefined : (e.target.value as DocumentFilterParams["accessLevel"]), pageIndex: 1 })}
                >
                    <option value="">Tất cả gói</option>
                    {ACCESS_LEVELS.map((level) => (
                        <option key={level} value={level}>
                            {ACCESS_LEVEL_LABEL[level]}
                        </option>
                    ))}
                </select>

                <select className="page-filter-status" value={filters.status ?? ""}
                    onChange={(e) => onChange({ ...filters, status: e.target.value === "" ? undefined : (e.target.value as DocumentFilterParams["status"]), pageIndex: 1 })}
                >
                    <option value="">Tất cả trạng thái</option>
                    {DOCUMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                            {DOCUMENT_STATUS_LABEL[status]}
                        </option>
                    ))}
                </select>

                <select className="page-filter-status" value={filters.isDeleted === undefined ? "" : filters.isDeleted ? "true" : "false"}
                    onChange={(e) => { const val = e.target.value; onChange({ ...filters, isDeleted: val === "" ? undefined : val === "true", pageIndex: 1 }) }}
                >
                    <option value="">Tất cả lưu trữ</option>
                    <option value="false">Đang hoạt động</option>
                    <option value="true">Đã xóa</option>
                </select>

                <SubjectSelect
                    value={filters.subjectId}
                    onChange={(subjectId) => onChange({ ...filters, subjectId, pageIndex: 1 })}
                />

                <TagMultiSelect
                    value={filters.tagIds}
                    onChange={(tagIds) => onChange({ ...filters, tagIds, pageIndex: 1 })}
                />
            </div>
        </div>
    );
}