import { useState } from "react";
import { useReports } from "@/features/report/hooks/use_report";
import { ReportTable } from "@/features/report/components/report_table";
import { ReportFilter } from "@/features/report/components/report_filter";
import "@/styles/admin/page.css";
import type { ReportFilterParams } from "@/features/report/types/report_type";

const DEFAULT_FILTERS: ReportFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function ReportPage() {
    const [filters, setFilters] = useState<ReportFilterParams>(DEFAULT_FILTERS);
    const { data, isLoading } = useReports(filters);

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản lý báo cáo</h2>
            </div>

            <ReportFilter filters={filters} onChange={setFilters} />

            <ReportTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />
        </div>
    );
}