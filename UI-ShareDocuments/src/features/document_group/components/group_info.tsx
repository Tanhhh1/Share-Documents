import { DOCUMENT_STATUS_LABEL } from "@/common/constants/document_status";
import type { GroupDto } from "../group_type";

interface GroupInfoSummaryProps {
    group: GroupDto;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString("vi-VN");
}

export function GroupInfoSummary({ group }: GroupInfoSummaryProps) {
    return (
        <div className="info-summary">
            <div className="info-row">
                <span className="info-label">Tên nhóm</span>
                <span className="info-value">{group.title}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Ngày tạo</span>
                <span className="info-value">{formatDate(group.createdAt)}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Tác giả</span>
                <span className="info-value">{group.userName}</span>
            </div>
            <div className="info-row">
                <span className="info-label">Trạng thái</span>
                <span className="info-value">{DOCUMENT_STATUS_LABEL[group.status]}</span>
            </div>
            <div className="info-row info-row-block">
                <span className="info-label">Mô tả</span>
                <p className="info-value">{group.description || "Không có mô tả"}</p>
            </div>
        </div>
    );
}