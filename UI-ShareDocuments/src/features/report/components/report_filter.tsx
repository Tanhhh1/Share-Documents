import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { ReportFilterParams } from "../types/report_type";

interface ReportFilterProps {
    filters: ReportFilterParams;
    onChange: (filters: ReportFilterParams) => void;
}

export function ReportFilter({ filters, onChange }: ReportFilterProps) {
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
                placeholder="Tìm theo lý do, nội dung..."
            />
        </div>
    );
}