import { useQuery } from "@tanstack/react-query";
import { tagApi } from "../tag_api";
import type { TagFilterParams } from "../types/tag_type";

export function useTags(filters: TagFilterParams) {
    return useQuery({
        queryKey: ["tags", filters],
        queryFn: () => tagApi.getAll(filters),
    });
}