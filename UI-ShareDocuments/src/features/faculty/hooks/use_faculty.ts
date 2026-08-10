import { useQuery } from "@tanstack/react-query";
import { facultyApi } from "../faculty_api";
import type { FacultyFilterParams } from "../types/faculty_type";

export function useFaculties(filters: FacultyFilterParams) {
    return useQuery({
        queryKey: ["faculties", filters],
        queryFn: () => facultyApi.getAll(filters),
    });
}