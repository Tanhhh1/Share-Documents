import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DocumentForm } from "@/features/document/components/document_form";
import { useDocumentDetail, useUpdateDocument } from "@/features/document/use_document";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/features/document/document_type";
import type { FieldError } from "@/common/types/api_result_type";

export default function EditDocumentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const documentId = id ? parseInt(id, 10) : 0;

    const { data: detailRes, isLoading: isFetching } = useDocumentDetail(documentId);
    const updateMutation = useUpdateDocument();
    const [apiErrors, setApiErrors] = useState<FieldError[] | null>(null);

    const handleSubmit = (payload: CreateDocumentRequest | UpdateDocumentRequest) => {
        setApiErrors(null);

        updateMutation.mutate(payload as UpdateDocumentRequest, {
            onSuccess: (res) => {
                if (res.succeeded) {
                    navigate("/admin/my-document");
                } else {
                    setApiErrors(res.errors ?? null);
                }
            },
        });
    };

    if (isFetching) {
        return <div className="page-loading">Đang tải thông tin tài liệu...</div>;
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>
                    <a className="page-back" onClick={() => navigate(-1)}>
                        <i className="bx bx-chevrons-left" />
                    </a>
                    Cập Nhật Tài Liệu
                </h2>
            </div>

            <DocumentForm
                mode="update"
                initialValues={detailRes?.result ?? undefined}
                isLoading={updateMutation.isPending}
                apiErrors={apiErrors}
                onSubmit={handleSubmit}
            />
        </div>
    );
}