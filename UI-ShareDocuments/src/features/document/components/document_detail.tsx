import { DOCUMENT_STATUS_LABEL, DocumentStatus } from "@/common/constants/document_status";
import { AccessLevel } from "@/common/constants/access_level";
import { useDocumentPreview } from "../use_document";
import type { DocumentDetailDto } from "../document_type";

interface DocumentDetailViewProps {
    document: DocumentDetailDto;
    isDownloading?: boolean;
    onDownload?: (id: number) => void;
    onBack?: () => void;

    onApprove?: () => void;
    onReject?: () => void;

    onEdit?: () => void;
    onDelete?: () => void;
    onRestore?: () => void;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("vi-VN");
}

function statusBadgeClass(status: DocumentStatus): string {
    switch (status) {
        case DocumentStatus.Published:
            return "badge badge-published";
        case DocumentStatus.Rejected:
            return "badge badge-rejected";
        default:
            return "badge badge-pending";
    }
}

export function DocumentDetailView({
    document,
    isDownloading,
    onDownload,
    onBack,
    onApprove,
    onReject,
    onEdit,
    onDelete,
    onRestore,
}: DocumentDetailViewProps) {
    const { data: previewData, isLoading: isPreviewLoading } = useDocumentPreview(document.id);

    const hasApprovalActions = !!(onApprove || onReject);
    const hasMyDocumentActions = !!(onEdit || onDelete || onRestore);

    return (
        <div className="document-detail-layout">
            <div className="detail-sidebar-left">
                <div className="sidebar-top-bar">
                    <a className="page-back" onClick={onBack}>
                        <i className="bx bx-chevrons-left" />
                    </a>
                    <div className="sidebar-stats-group">
                        <span className="stat-badge">
                            <i className="bx bx-show"></i> {document.viewCount.toLocaleString("vi-VN")} lượt xem
                        </span>
                        <span className="stat-badge">
                            <i className="bx bx-download"></i> {document.downloadCount.toLocaleString("vi-VN")} lượt tải
                        </span>
                    </div>
                </div>

                <h1 className="document-main-title">{document.title}</h1>

                {document.tags && document.tags.length > 0 && (
                    <div className="document-tags-wrapper">
                        {document.tags.map((tag) => (
                            <span key={tag.id} className="tag-chip">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="document-section-box">
                    <h3 className="section-title">Mô tả</h3>
                    <p className="description-text">
                        {document.description || "Không có mô tả cho tài liệu này."}
                    </p>
                </div>

                <div className="document-meta-list">
                    <div className="meta-item">
                        <span className="meta-label">Quyền truy cập:</span>
                        <span className={document.accessLevel === AccessLevel.Premium ? "access-badge premium" : "access-badge free"}>
                            {document.accessLevel === AccessLevel.Premium ? "Premium" : "Miễn phí"}
                        </span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Môn học:</span>
                        <span className="meta-value">{document.subjectName}</span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Người đăng:</span>
                        <span className="meta-value">{document.userName}</span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Ngày đăng:</span>
                        <span className="meta-value">{formatDate(document.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="detail-preview-right">
                <div className="preview-header-bar">
                    <button className="btn-download-action" onClick={() => onDownload && onDownload(document.id)} disabled={isDownloading}>
                        {isDownloading ? <i className="bx bx-loader-alt bx-spin"></i> : <i className="bx bx-download"></i>}
                        <span>Tải xuống</span>
                    </button>

                    <div className="preview-header-actions">
                        {hasApprovalActions && (
                            !document.isDeleted && document.status === DocumentStatus.Pending ? (
                                <>
                                    <button className="table-action-btn unlock" title="Duyệt" onClick={onApprove}>
                                        <i className="bx bx-check"></i>
                                    </button>
                                    <button className="table-action-btn lock" title="Từ chối" onClick={onReject}>
                                        <i className="bx bx-x"></i>
                                    </button>
                                </>
                            ) : (
                                <span className={statusBadgeClass(document.status)}>
                                    {DOCUMENT_STATUS_LABEL[document.status]}
                                </span>
                            )
                        )}

                        {hasMyDocumentActions && (
                            document.isDeleted ? (
                                <button className="table-action-btn unlock" title="Khôi phục" onClick={onRestore}>
                                    <i className="bx bx-undo"></i>
                                </button>
                            ) : (
                                <>
                                    <button className="table-action-btn edit" title="Sửa" onClick={onEdit}>
                                        <i className="bx bx-edit"></i>
                                    </button>
                                    <button className="table-action-btn lock" title="Xóa" onClick={onDelete}>
                                        <i className="bx bx-trash"></i>
                                    </button>
                                </>
                            )
                        )}
                    </div>
                </div>

                <div className="preview-body">
                    {isPreviewLoading && (
                        <div className="preview-status-container">
                            <i className="bx bx-loader-alt bx-spin status-icon"></i>
                            <span>Đang tải bản xem trước...</span>
                        </div>
                    )}

                    {!isPreviewLoading && previewData?.succeeded && previewData.result?.signedUrl && (
                        <iframe
                            src={`${previewData.result.signedUrl}#toolbar=0&navpanes=0`}
                            title={document.title}
                            className="preview-iframe-element"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}