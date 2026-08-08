import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { ReportDto, ReportFilterParams } from "./types/report_type";

export const reportApi = {
    getAll: async (params: ReportFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<ReportDto>>>(endpoints.report.list, { params });
        return data;
    },
};