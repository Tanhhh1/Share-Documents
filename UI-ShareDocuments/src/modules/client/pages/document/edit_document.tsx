import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DocumentForm } from "@/features/document/components/document_form";
import { useDocumentDetail, useUpdateDocument } from "@/features/document/use_document";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/features/document/document_type";
import type { FieldError } from "@/common/types/api_result_type";

export default function EditDocumentPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const documentId = Number(id);

    const { data } = useDocumentDetail(documentId);
    const updateMutation = useUpdateDocument();
    const [apiErrors, setApiErrors] = useState<FieldError[] | null>(null);

    const handleSubmit = (payload: CreateDocumentRequest | UpdateDocumentRequest) => {
        setApiErrors(null);

        updateMutation.mutate(payload as UpdateDocumentRequest, {
            onSuccess: (res) => {
                if (res.succeeded) {
                    navigate(`/document/${documentId}`);
                } else {
                    setApiErrors(res.errors ?? null);
                }
            },
        });
    };

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Chỉnh Sửa Tài Liệu</h2>
                <span>Cập nhật thông tin tài liệu của Bạn.</span>
            </div>
            <DocumentForm
                mode="update"
                initialValues={data?.result ?? undefined}
                isLoading={updateMutation.isPending}
                apiErrors={apiErrors}
                onSubmit={handleSubmit}
                hideAccessLevel
            />
        </div>
    );
}