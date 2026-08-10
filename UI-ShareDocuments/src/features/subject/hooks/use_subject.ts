import { useQuery } from "@tanstack/react-query";
import { subjectApi } from "../subject_api";
import type { SubjectFilterParams } from "../types/subject_type";

export function useSubjects(filters: SubjectFilterParams) {
    return useQuery({
        queryKey: ["subjects", filters],
        queryFn: () => subjectApi.getAll(filters),
    });
}