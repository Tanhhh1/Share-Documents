import { useNavigate } from "react-router-dom";
import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import type { FacultyDto } from "@/features/faculty/faculty_type";
import type { PageList } from "@/common/types/page_list_type";

interface FacultyListProps {
    pageData?: PageList<FacultyDto>;
    isLoading: boolean;
    onEdit: (faculty: FacultyDto) => void;
    onDelete: (faculty: FacultyDto) => void;
    onRestore: (faculty: FacultyDto) => void;
    onPageChange: (pageIndex: number) => void;
}

export function FacultyList({
    pageData,
    isLoading,
    onEdit,
    onDelete,
    onRestore,
    onPageChange,
}: FacultyListProps) {
    const navigate = useNavigate();

    return (
        <>
            <div className="card-grid">
                {pageData?.items.map((faculty) => (
                    <CardItem
                        key={faculty.id}
                        variant="crud"
                        name={faculty.name}
                        createdAt={faculty.createdAt}
                        isDeleted={!faculty.isActive}
                        onEdit={() => onEdit(faculty)}
                        onDelete={() => onDelete(faculty)}
                        onRestore={() => onRestore(faculty)}
                        onClick={() => navigate(`/admin/faculty/${faculty.id}/major`)}
                    />
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Không có khoa nào</p>
                )}
            </div>

            {pageData && (
                <Pagination
                    pageIndex={pageData.pageIndex}
                    totalPages={pageData.totalPages}
                    hasPrevious={pageData.hasPrevious}
                    hasNext={pageData.hasNext}
                    onPageChange={onPageChange}
                />
            )}
        </>
    );
}