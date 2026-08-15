import { DOCUMENT_STATUS_LABEL } from "@/common/constants/document_status";
import type { DocumentDetailDto } from "../document_type";

interface DocumentInfoSummaryProps {
    document: DocumentDetailDto;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("vi-VN");
}

export function DocumentInfoSummary({ document }: DocumentInfoSummaryProps) {
    return (
        <div className="info-summary">
            <div className="info-row">
                <span className="info-label">Tên tài liệu</span>
                <span className="info-value">{document.title}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Môn học</span>
                <span className="info-value">{document.subjectName || "—"}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Người đăng</span>
                <span className="info-value">{document.userName}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Ngày đăng</span>
                <span className="info-value">{formatDate(document.createdAt)}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Trạng thái</span>
                <span className="info-value">{DOCUMENT_STATUS_LABEL[document.status]}</span>
            </div>
            <div className="info-row info-row-block">
                <span className="info-label">Mô tả</span>
                <p className="info-value">{document.description || "Không có mô tả"}</p>
            </div>
        </div>
    );
}