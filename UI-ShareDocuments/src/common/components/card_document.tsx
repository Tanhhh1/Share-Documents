import { useNavigate } from "react-router-dom";
import { DOCUMENT_STATUS_LABEL, DocumentStatus } from "@/common/constants/document_status";
import { AccessLevel } from "@/common/constants/access_level";
import type { DocumentDto } from "@/features/document/document_type";
import "@/styles/component/card_document.css";

interface DocumentCardProps {
    document: DocumentDto;
    onClick?: (id: number) => void;
}

interface MyDocumentCardProps extends DocumentCardProps {
    onDelete?: (id: number) => void;
    onRestore?: (id: number) => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("vi-VN");
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadgeClass(status: DocumentStatus): string {
    switch (status) {
        case DocumentStatus.Published:
            return "badge badge-active";
        case DocumentStatus.Rejected:
            return "badge badge-locked";
        default:
            return "badge badge-pending";
    }
}

export function DocumentCard({ document, onClick }: DocumentCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(document.id);
        } else {
            navigate(`/admin/document/${document.id}`);
        }
    };

    return (
        <div className="card-document" onClick={handleClick}>
            <div className="card-document-thumbnail">
                {document.thumbnailUrl ? (
                    <img src={document.thumbnailUrl} alt={document.title} loading="lazy" />
                ) : (
                    <div className="card-document-placeholder"><i className="bx bx-file"></i></div>
                )}
                {document.accessLevel === AccessLevel.Premium && (
                    <span className="card-document-premium-badge">Premium</span>
                )}
            </div>

            <div className="card-document-body">
                <p className="card-document-title" title={document.title}>
                    {document.title}
                </p>

                <div className="card-document-meta">
                    <span className={statusBadgeClass(document.status)}>{DOCUMENT_STATUS_LABEL[document.status]}</span>
                    <span className="card-document-filesize">{formatFileSize(document.fileSizeBytes)}</span>
                </div>

                <div className="card-document-stats">
                    <span>
                        <i className="bx bx-show"></i> {document.viewCount}
                    </span>
                    <span>
                        <i className="bx bx-download"></i> {document.downloadCount}
                    </span>
                    <span className="card-document-date">{formatDate(document.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}

export function MyDocumentCard({ document, onClick, onDelete, onRestore }: MyDocumentCardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(document.id);
        } else {
            navigate(`/document/${document.id}`);
        }
    };

    return (
        <div className="card-document card-document-horizontal" onClick={handleClick}>
            <div className="card-document-thumbnail">
                {document.thumbnailUrl ? (
                    <img src={document.thumbnailUrl} alt={document.title} loading="lazy" />
                ) : (
                    <div className="card-document-placeholder"><i className="bx bx-file"></i></div>
                )}
                {document.accessLevel === AccessLevel.Premium && (
                    <span className="card-document-premium-badge">Premium</span>
                )}
            </div>

            <div className="card-document-body">
                <div className="card-document-info">
                    <p className="card-document-title" title={document.title}>
                        {document.title}
                    </p>
                    <div className="card-document-meta-inline">
                        <span className={statusBadgeClass(document.status)}>
                            {DOCUMENT_STATUS_LABEL[document.status]}
                        </span>
                        <span>
                            <i className="bx bx-book-alt"></i> {document.subjectName}
                        </span>
                        <span>{formatFileSize(document.fileSizeBytes)}</span>
                        <span>
                            <i className="bx bx-show"></i> {document.viewCount}
                        </span>
                        <span>
                            <i className="bx bx-download"></i> {document.downloadCount}
                        </span>
                        <span>{formatDate(document.createdAt)}</span>
                    </div>
                </div>

                <div className="card-document-horizontal-actions" onClick={(e) => e.stopPropagation()}>
                    {document.isDeleted ? (
                        onRestore && (
                            <button type="button" className="table-action-btn unlock" title="Khôi phục" onClick={() => onRestore(document.id)}>
                                <i className="bx bx-undo"></i>
                            </button>
                        )
                    ) : (
                        onDelete && (
                            <button type="button" className="table-action-btn lock" title="Xóa" onClick={() => onDelete(document.id)}>
                                <i className="bx bx-trash"></i>
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}