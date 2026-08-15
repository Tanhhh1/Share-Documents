import { useNavigate } from "react-router-dom";
import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import type { MajorDto } from "@/features/major/major_type";
import type { PageList } from "@/common/types/page_list_type";

interface MajorListProps {
    pageData?: PageList<MajorDto>;
    isLoading: boolean;
    onEdit: (major: MajorDto) => void;
    onDelete: (major: MajorDto) => void;
    onRestore: (major: MajorDto) => void;
    onPageChange: (pageIndex: number) => void;
}

export function MajorList({
    pageData,
    isLoading,
    onEdit,
    onDelete,
    onRestore,
    onPageChange,
}: MajorListProps) {
    const navigate = useNavigate();

    return (
        <>
            <div className="card-grid">
                {pageData?.items.map((major) => (
                    <CardItem
                        key={major.id}
                        variant="crud"
                        name={major.name}
                        createdAt={major.createdAt}
                        isDeleted={!major.isActive}
                        onEdit={() => onEdit(major)}
                        onDelete={() => onDelete(major)}
                        onRestore={() => onRestore(major)}
                        onClick={() => navigate(`/admin/major/${major.id}/subject`)}
                    />
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Không có ngành nào</p>
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