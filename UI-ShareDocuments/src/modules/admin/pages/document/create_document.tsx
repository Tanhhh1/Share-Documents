import { useNavigate } from "react-router-dom";
import { DocumentForm } from "@/features/document/components/document_form";
import { useCreateDocument } from "@/features/document/use_document";
import { useFormAction } from "@/common/hooks/use_form";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/features/document/document_type";

export default function CreateDocumentPage() {
    const navigate = useNavigate();
    const createMutation = useCreateDocument();

    const { errors: apiErrors, submit } = useFormAction<CreateDocumentRequest>(
        (payload, options) => {
            createMutation.mutate(payload, {
                onSuccess: (res) => { 
                    options?.onSuccess?.(res);
                    if (res.succeeded) { navigate("/admin/my-document") }
                },
            });
        },"Tạo tài liệu thành công"
    );

    const handleSubmit = (payload: CreateDocumentRequest | UpdateDocumentRequest) => {
        submit(payload as CreateDocumentRequest);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>
                    <a className="admin-page-back" onClick={() => navigate(-1)}>
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