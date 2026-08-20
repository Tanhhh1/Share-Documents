import { DOCUMENT_STATUS_LABEL, DocumentStatus } from "@/common/constants/document_status";
import { AccessLevel } from "@/common/constants/access_level";
import type { DocumentDto } from "@/features/document/document_type";

interface DocumentCardBaseProps {
    document: DocumentDto;
    showStatus?: boolean;
}

interface DocumentCardVerticalProps extends DocumentCardBaseProps {
    variant?: "vertical";
    onClick?: (id: number) => void;
}

interface DocumentCardHorizontalProps extends DocumentCardBaseProps {
    variant: "horizontal";
    onClick?: (id: number) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onRestore?: () => void;
}

type DocumentCardProps = DocumentCardVerticalProps | DocumentCardHorizontalProps;

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

export function DocumentCard(props: DocumentCardProps) {
    if (props.variant === "horizontal") {
        return <DocumentCardHorizontal {...props} />;
    }
    return <DocumentCardVertical {...props} />;
}

function DocumentCardVertical({ document, showStatus, onClick }: DocumentCardVerticalProps) {
    return (
        <div className="card-document" onClick={() => onClick?.(document.id)}>
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
                    {document.isDeleted ? (
                        <span className="badge badge-deleted">Đã xóa</span>
                    ) : (
                        showStatus && (
                            <span className={statusBadgeClass(document.status)}>
                                {DOCUMENT_STATUS_LABEL[document.status]}
                            </span>
                        )
                    )}
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

function DocumentCardHorizontal({ document, showStatus = true, onClick, onEdit, onDelete, onRestore }: DocumentCardHorizontalProps) {
    const clickable = !!onClick;

    return (
        <div
            className={`card-document-horizontal ${clickable ? "card-document-horizontal-clickable" : ""}`}
            onClick={clickable ? () => onClick!(document.id) : undefined}>
            <div className="card-document-horizontal-thumbnail">
                {document.thumbnailUrl ? (
                    <img src={document.thumbnailUrl} alt={document.title} loading="lazy" />
                ) : (
                    <div className="card-document-placeholder"><i className="bx bx-file"></i></div>
                )}
            </div>

            <div className="card-document-horizontal-body">
                <div className="card-document-stats">
                    <div className="card-document-meta">
                        {document.isDeleted ? (
                            <span className="badge badge-deleted">Đã xóa</span>
                        ) : (
                            showStatus && (
                                <span className={statusBadgeClass(document.status)}>
                                    {DOCUMENT_STATUS_LABEL[document.status]}
                                </span>
                            )
                        )}
                    </div>
                    <span>
                        <i className="bx bx-show"></i> {document.viewCount}
                    </span>
                    <span>
                        <i className="bx bx-download"></i> {document.downloadCount}
                    </span>
                    <span className="card-document-filesize">{formatFileSize(document.fileSizeBytes)}</span>
                    <span className="card-document-date">{formatDate(document.createdAt)}</span>
                </div>

                <p className="card-document-title" title={document.title}>
                    {document.title}
                </p>

                {document.description && (
                    <p className="card-document-description">{document.description}</p>
                )}
            </div>

            {(onEdit || onDelete || onRestore) && (
                <div className="card-item-actions" onClick={(e) => e.stopPropagation()}>
                    {!document.isDeleted && onEdit && (
                        <button type="button" className="table-action-btn edit" title="Sửa" onClick={onEdit}>
                            <i className="bx bx-edit-alt"></i>
                        </button>
                    )}
                    {document.isDeleted ? (
                        onRestore && (
                            <button type="button" className="table-action-btn unlock" title="Khôi phục" onClick={onRestore}>
                                <i className="bx bx-undo"></i>
                            </button>
                        )
                    ) : (
                        onDelete && (
                            <button type="button" className="table-action-btn lock" title="Xóa" onClick={onDelete}>
                                <i className="bx bx-trash"></i>
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}