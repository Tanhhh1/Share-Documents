import { useState } from "react";
import { useComments } from "@/features/comment/hooks/use_comment";
import { useHideComment } from "@/features/comment/hooks/use_hide_comment";
import { useUnhideComment } from "@/features/comment/hooks/use_unhide_comment";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { CommentTable } from "@/features/comment/components/comment_table";
import { CommentFilter } from "@/features/comment/components/comment_filter";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import "@/styles/admin/page.css";
import type { ListCommentDto, CommentFilterParams } from "@/features/comment/types/comment_type";

const DEFAULT_FILTERS: CommentFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function CommentPage() {
    const [filters, setFilters] = useState<CommentFilterParams>(DEFAULT_FILTERS);
    const [selectedComment, setSelectedComment] = useState<ListCommentDto | null>(null);
    const [hideError, setHideError] = useState<string | undefined>();
    const [unhideError, setUnhideError] = useState<string | undefined>();

    const hideDialog = useDisclosure();
    const unhideDialog = useDisclosure();

    const { data, isLoading } = useComments(filters);
    const hideMutation = useHideComment();
    const unhideMutation = useUnhideComment();

    const handleOpenHide = (comment: ListCommentDto) => {
        setSelectedComment(comment);
        setHideError(undefined);
        hideDialog.open();
    };

    const handleOpenUnhide = (comment: ListCommentDto) => {
        setSelectedComment(comment);
        setUnhideError(undefined);
        unhideDialog.open();
    };

    const handleConfirmHide = () => {
        if (!selectedComment) return;
        setHideError(undefined);
        hideMutation.mutate(selectedComment.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    hideDialog.close();
                } else {
                    setHideError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleConfirmUnhide = () => {
        if (!selectedComment) return;
        setUnhideError(undefined);
        unhideMutation.mutate(selectedComment.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    unhideDialog.close();
                } else {
                    setUnhideError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleClearFilter = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản lý bình luận</h2>
            </div>

            <CommentFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <CommentTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onHide={handleOpenHide}
                onUnhide={handleOpenUnhide}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <ConfirmDialog
                isOpen={hideDialog.isOpen}
                title="Ẩn bình luận"
                message="Bạn có chắc muốn ẩn bình luận này?"
                error={hideError}
                isLoading={hideMutation.isPending}
                onConfirm={handleConfirmHide}
                onCancel={hideDialog.close}
            />

            <ConfirmDialog
                isOpen={unhideDialog.isOpen}
                title="Bỏ ẩn bình luận"
                message="Bạn có chắc muốn bỏ ẩn bình luận này?"
                error={unhideError}
                isLoading={unhideMutation.isPending}
                onConfirm={handleConfirmUnhide}
                onCancel={unhideDialog.close}
            />
        </div>
    );
}