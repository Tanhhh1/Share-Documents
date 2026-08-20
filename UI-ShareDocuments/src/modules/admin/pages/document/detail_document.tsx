import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDocumentDetail, useDownloadDocument, useApproveDocument, useRejectDocument } from "@/features/document/use_document";
import { DocumentDetailView } from "@/features/document/components/document_detail";
import { ApproveDocumentDialog } from "@/features/document/components/approve_document";
import { RejectDocumentDialog } from "@/features/document/components/reject_document";

export default function DocumentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const documentId = id ? parseInt(id, 10) : 0;
    const isMineContext = searchParams.get("from") === "mine";

    const { data, isLoading } = useDocumentDetail(documentId);

    const downloadMutation = useDownloadDocument();
    const approveMutation = useApproveDocument();
    const rejectMutation = useRejectDocument();

    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isRejectOpen, setIsRejectOpen] = useState(false);

    const handleBack = () => navigate(-1);

    const handleDownload = (docId: number) => {
        downloadMutation.mutate(docId, {
            onSuccess: (res) => {
                if (res.succeeded && res.result?.signedUrl) {
                    const link = document.createElement("a");
                    link.href = res.result.signedUrl;
                    link.download = res.result.fileName || "document";
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    queryClient.invalidateQueries({ queryKey: ["document", docId] });
                }
            },
            onError: (err: any) => {
                const message = err?.response?.data?.message || "Đã xảy ra lỗi trong quá trình tải xuống.";
                alert(message);
            },
        });
    };

    const handleConfirmApprove = () => {
        approveMutation.mutate(documentId, {
            onSuccess: () => {
                setIsApproveOpen(false);
                queryClient.invalidateQueries({ queryKey: ["document", documentId] });
            },
        });
    };

    const handleConfirmReject = (reason: string) => {
        rejectMutation.mutate(
            { id: documentId, reason },
            {
                onSuccess: () => {
                    setIsRejectOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["document", documentId] });
                },
            }
        );
    };

    return (
        <div className="document-detail-page">
            {isLoading && (
                <div className="page-state-box">
                    <i className="bx bx-loader-alt bx-spin state-icon"></i>
                    <p className="state-text">Đang tải thông tin tài liệu...</p>
                </div>
            )}

            {!isLoading && data?.succeeded && data.result && (
                <>
                    <DocumentDetailView
                        document={data.result}
                        isDownloading={downloadMutation.isPending}
                        onDownload={handleDownload}
                        onBack={handleBack}
                        onApprove={!isMineContext ? () => setIsApproveOpen(true) : undefined}
                        onReject={!isMineContext ? () => setIsRejectOpen(true) : undefined}
                    />

                    <ApproveDocumentDialog
                        isOpen={isApproveOpen}
                        document={data.result}
                        isLoading={approveMutation.isPending}
                        apiErrors={approveMutation.error ? (approveMutation.error as any)?.response?.data?.errors : null}
                        onClose={() => setIsApproveOpen(false)}
                        onConfirm={handleConfirmApprove}
                    />

                    <RejectDocumentDialog
                        isOpen={isRejectOpen}
                        document={data.result}
                        isLoading={rejectMutation.isPending}
                        apiErrors={rejectMutation.error ? (rejectMutation.error as any)?.response?.data?.errors : null}
                        onClose={() => setIsRejectOpen(false)}
                        onConfirm={handleConfirmReject}
                    />
                </>
            )}
        </div>
    );
}