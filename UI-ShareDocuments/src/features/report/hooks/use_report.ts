import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../report_api";
import type { ReportFilterParams } from "../types/report_type";

export function useReports(filters: ReportFilterParams) {
    return useQuery({
        queryKey: ["reports", filters],
        queryFn: () => reportApi.getAll(filters),
    });
}