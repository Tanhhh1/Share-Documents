import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";
import { useDocumentComments, useCreateComment, useDeleteComment } from "../use_comment";
import type { CommentDto } from "../comment_type";

const PAGE_SIZE = 10;

function formatDate(value: string): string {
    return new Date(value).toLocaleString("vi-VN");
}

interface CommentItemProps {
    comment: CommentDto;
    documentId: number;
    currentUserId?: number;
    onReplied: () => void;
}

function CommentItem({ comment, documentId, currentUserId, onReplied }: CommentItemProps) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const createComment = useCreateComment(documentId);
    const deleteComment = useDeleteComment(documentId);

    const isOwner = currentUserId != null && comment.userId === currentUserId;
    const canDelete = isOwner && comment.replies.length === 0;

    const handleReply = () => {
        const content = replyContent.trim();
        if (!content) return;

        createComment.mutate(
            { documentId, parentCommentId: comment.id, content },
            {
                onSuccess: (data) => {
                    if (!data.succeeded) return;
                    setReplyContent("");
                    setIsReplying(false);
                    onReplied();
                },
            }
        );
    };

    const handleDelete = () => {
        if (!confirm("Xóa bình luận này?")) return;
        deleteComment.mutate(comment.id);
    };

    return (
        <div className="comment-item">
            <div className="comment-item-header">
                <span className="comment-item-user">{comment.userName}</span>
                <span className="comment-item-date">{formatDate(comment.createdAt)}</span>
            </div>

            <p className="comment-item-content">{comment.content}</p>

            <div className="comment-item-actions">
                <button className="comment-action-btn" onClick={() => setIsReplying((v) => !v)}>
                    Trả lời
                </button>
                {canDelete && (
                    <button className="comment-action-btn comment-action-delete" onClick={handleDelete} disabled={deleteComment.isPending}>
                        Xóa
                    </button>
                )}
            </div>

            {isReplying && (
                <div className="comment-reply-form">
                    <textarea
                        className="comment-reply-input"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Trả lời ${comment.userName}...`}
                        rows={2}
                    />
                    <div className="comment-reply-form-actions">
                        <button className="comment-btn-cancel" onClick={() => setIsReplying(false)}>
                            Hủy
                        </button>
                        <button className="comment-btn-submit" onClick={handleReply} disabled={createComment.isPending || !replyContent.trim()}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}

            {comment.replies.length > 0 && (
                <div className="comment-item-replies">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} documentId={documentId} currentUserId={currentUserId} onReplied={onReplied} />
                    ))}
                </div>
            )}
        </div>
    );
}

interface CommentSectionProps {
    documentId: number;
}

export function CommentSection({ documentId }: CommentSectionProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    const [pageIndex, setPageIndex] = useState(1);
    const [newContent, setNewContent] = useState("");

    const { data, isLoading } = useDocumentComments(documentId, { pageIndex, pageSize: PAGE_SIZE });
    const createComment = useCreateComment(documentId);

    const handleSubmit = () => {
        const content = newContent.trim();
        if (!content) return;

        createComment.mutate(
            { documentId, content },
            {
                onSuccess: (res) => {
                    if (!res.succeeded) return;
                    setNewContent("");
                    setPageIndex(1);
                },
            }
        );
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">Bình luận</h3>

            <div className="comment-new-form">
                <textarea
                    className="comment-new-input"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Viết bình luận..."
                    rows={3}
                />
                <button className="comment-btn-submit" onClick={handleSubmit} disabled={createComment.isPending || !newContent.trim()}>
                    Gửi bình luận
                </button>
            </div>

            <div className="comment-list">
                {isLoading && <p className="comment-loading">Đang tải bình luận...</p>}
                {!isLoading && data?.result?.items.length === 0 && <p className="comment-empty">Chưa có bình luận nào</p>}

                {data?.result?.items.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        documentId={documentId}
                        currentUserId={user?.id}
                        onReplied={() => {}}
                    />
                ))}
            </div>
        </div>
    );
}