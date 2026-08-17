import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentForm } from "@/features/document/components/document_form";
import { useCreateDocument } from "@/features/document/use_document";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/features/document/document_type";
import type { FieldError } from "@/common/types/api_result_type";

export default function CreateDocumentPage() {
    const navigate = useNavigate();
    const createMutation = useCreateDocument();
    const [apiErrors, setApiErrors] = useState<FieldError[] | null>(null);

    const handleSubmit = (payload: CreateDocumentRequest | UpdateDocumentRequest) => {
        setApiErrors(null);

        createMutation.mutate(payload as CreateDocumentRequest, {
            onSuccess: (res) => {
                if (res.succeeded) {
                    navigate("/admin/my-document");
                } else {
                    setApiErrors(res.errors ?? null);
                }
            },
        });
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>
                    <a className="page-back" onClick={() => navigate(-1)}>
                        <i className="bx bx-chevrons-left" />
                    </a>
                    Tạo Tài Liệu Mới
                </h2>
            </div>

            <DocumentForm
                mode="create"
                isLoading={createMutation.isPending}
                apiErrors={apiErrors}
                onSubmit={handleSubmit}
            />
        </div>
    );
}