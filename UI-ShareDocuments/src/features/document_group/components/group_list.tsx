import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import { documentStatusBadgeClass } from "@/features/document_group/group_type";
import { DocumentStatus, DOCUMENT_STATUS_LABEL } from "@/common/constants/document_status";
import type { GroupDto } from "@/features/document_group/group_type";
import type { PageList } from "@/common/types/page_list_type";

interface DocumentGroupListProps {
    pageData?: PageList<GroupDto>;
    isLoading: boolean;
    onApprove: (group: GroupDto) => void;
    onReject: (group: GroupDto) => void;
    onPageChange: (pageIndex: number) => void;
    onView?: (group: GroupDto) => void;
}

export function DocumentGroupList({
    pageData,
    isLoading,
    onApprove,
    onReject,
    onPageChange,
    onView,
}: DocumentGroupListProps) {
    return (
        <>
            <div className="card-grid">
                {pageData?.items.map((group) => (
                    <CardItem
                        key={group.id}
                        variant="moderation"
                        name={group.title}
                        createdAt={group.createdAt}
                        isPending={group.status === DocumentStatus.Pending}
                        statusLabel={DOCUMENT_STATUS_LABEL[group.status]}
                        statusClassName={documentStatusBadgeClass(group.status)}
                        onApprove={() => onApprove(group)}
                        onReject={() => onReject(group)}
                        onClick={onView ? () => onView(group) : undefined}
                    />
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Không có nhóm chủ đề nào</p>
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