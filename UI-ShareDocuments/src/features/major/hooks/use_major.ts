import { useQuery } from "@tanstack/react-query";
import { majorApi } from "../major_api";
import type { MajorFilterParams } from "../types/major_type";

export function useMajors(filters: MajorFilterParams) {
    return useQuery({
        queryKey: ["majors", filters],
        queryFn: () => majorApi.getAll(filters),
    });
}