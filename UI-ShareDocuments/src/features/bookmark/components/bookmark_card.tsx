import React from "react";
import { useNavigate } from "react-router-dom";
import type { BookmarkDto } from "../bookmark_type";

interface BookmarkCardProps {
    bookmark: BookmarkDto;
    onUnbookmark: (documentId: number) => void;
    isUnbookmarking?: boolean;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("vi-VN");
}

export function BookmarkCard({ bookmark, onUnbookmark, isUnbookmarking }: BookmarkCardProps) {
    const navigate = useNavigate();
    const handleUnbookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUnbookmark(bookmark.documentId);
    };

    return (
        <div className="bookmark-card-item" onClick={() => navigate(`/document/${bookmark.documentId}`)}>
            <div className="bookmark-card-thumbnail">
                {bookmark.thumbnailUrl ? (
                    <img src={bookmark.thumbnailUrl} alt={bookmark.documentTitle} loading="lazy" />
                ) : (
                    <div className="bookmark-card-placeholder">
                        <i className="bx bx-file"></i>
                    </div>
                )}
            </div>

            <div className="bookmark-card-content">
                <h3 className="bookmark-card-title" title={bookmark.documentTitle}>
                    {bookmark.documentTitle}
                </h3>

                {bookmark.documentDescription && (
                    <p className="bookmark-card-description" title={bookmark.documentDescription}>
                        {bookmark.documentDescription}
                    </p>
                )}

                <span className="bookmark-card-date">Đã lưu: {formatDate(bookmark.createdAt)}</span>
            </div>

            <button className="bookmark-card-action" title="Bỏ lưu" onClick={handleUnbookmarkClick} disabled={isUnbookmarking}>
                {isUnbookmarking ? (
                    <i className="bx bx-loader-alt bx-spin"></i>
                ) : (
                    <i className="bx bxs-bookmark"></i>
                )}
            </button>
        </div>
    );
}