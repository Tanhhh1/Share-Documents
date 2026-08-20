import { useParams, useNavigate } from "react-router-dom";
import { DocumentForm } from "@/features/document/components/document_form";
import { useDocumentDetail, useUpdateDocument } from "@/features/document/use_document";
import { useFormAction } from "@/common/hooks/use_form";
import type { CreateDocumentRequest, UpdateDocumentRequest } from "@/features/document/document_type";

export default function EditDocumentPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const documentId = id ? parseInt(id, 10) : 0;

    const { data } = useDocumentDetail(documentId);
    const updateMutation = useUpdateDocument();

    const { errors: apiErrors, submit } = useFormAction<UpdateDocumentRequest>(
        (payload, options) => {
            updateMutation.mutate(payload, {
                onSuccess: (res) => { 
                    options?.onSuccess?.(res);
                    if (res.succeeded) { navigate("/admin/my-document") }
                },
            });
        },
        "Cập nhật tài liệu thành công"
    );

    const handleSubmit = (payload: CreateDocumentRequest | UpdateDocumentRequest) => {
        submit(payload as UpdateDocumentRequest);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>
                    <a className="admin-page-back" onClick={() => navigate(-1)}>
                        <i className="bx bx-chevrons-left" />
                    </a>
                    Cập Nhật Tài Liệu
                </h2>
            </div>

            <DocumentForm
                mode="update"
                initialValues={data?.result ?? undefined}
                isLoading={updateMutation.isPending}
                apiErrors={apiErrors}
                onSubmit={handleSubmit}
            />
        </div>
    );
}