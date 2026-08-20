import { useState } from "react";
import { useComments, useHideComment, useUnhideComment } from "@/features/comment/use_comment";
import { useCrudModal } from "@/common/hooks/use_modal";
import { CommentTable } from "@/features/comment/components/comment_table";
import { CommentFilter } from "@/features/comment/components/comment_filter";
import { ConfirmDialog } from "@/common/components/confirm";
import type { ListCommentDto, CommentFilterParams } from "@/features/comment/comment_type";

const DEFAULT_FILTERS: CommentFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function CommentPage() {
    const [filters, setFilters] = useState<CommentFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<ListCommentDto>();
    const { data, isLoading } = useComments(filters);
    const hideMutation = useHideComment();
    const unhideMutation = useUnhideComment();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Quản Lý Bình Luận</h2>
            </div>

            <CommentFilter filters={filters} onChange={setFilters} />

            <CommentTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onHide={crud.openDelete}
                onUnhide={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Ẩn bình luận"
                message="Bạn có chắc muốn ẩn bình luận này?"
                error={crud.actionError}
                isLoading={hideMutation.isPending}
                onConfirm={() => crud.submitConfirm(hideMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Bỏ ẩn bình luận"
                message="Bạn có chắc muốn bỏ ẩn bình luận này?"
                error={crud.actionError}
                isLoading={unhideMutation.isPending}
                onConfirm={() => crud.submitConfirm(unhideMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}