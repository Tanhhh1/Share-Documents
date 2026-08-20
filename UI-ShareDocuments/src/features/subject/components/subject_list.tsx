import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import type { SubjectDto } from "@/features/subject/subject_type";
import type { PageList } from "@/common/types/page_list_type";

interface SubjectListProps {
    pageData?: PageList<SubjectDto>;
    isLoading: boolean;
    onEdit: (subject: SubjectDto) => void;
    onDelete: (subject: SubjectDto) => void;
    onRestore: (subject: SubjectDto) => void;
    onPageChange: (pageIndex: number) => void;
}

export function SubjectList({
    pageData,
    isLoading,
    onEdit,
    onDelete,
    onRestore,
    onPageChange,
}: SubjectListProps) {
    return (
        <>
            <div className="subject-list">
                {pageData?.items.map((subject) => (
                    <CardItem
                        key={subject.id}
                        variant="crud"
                        name={subject.name}
                        createdAt={subject.createdAt}
                        isDeleted={!subject.isActive}
                        onEdit={() => onEdit(subject)}
                        onDelete={() => onDelete(subject)}
                        onRestore={() => onRestore(subject)}
                    />
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Không có môn học nào</p>
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