import { useNavigate, useParams } from "react-router-dom";
import { useDocumentDetail, useDownloadDocument } from "@/features/document/use_document";
import { DocumentDetailView } from "@/features/document/components/document_detail";
import { useBookmarkStatus, useToggleBookmark } from "@/features/bookmark/use_bookmark";
import { CommentSection } from "@/features/comment/components/comment_section";

export default function DocumentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const documentId = Number(id);
    const navigate = useNavigate();

    const { data, isLoading } = useDocumentDetail(documentId);
    const downloadDocument = useDownloadDocument();

    const { isBookmarked } = useBookmarkStatus(documentId);
    const toggleBookmark = useToggleBookmark(documentId, isBookmarked);

    const handleDownload = (docId: number) => {
        downloadDocument.mutate(docId, {
            onSuccess: (res) => {
                if (!res.succeeded || !res.result?.signedUrl) return;
                window.open(res.result.signedUrl, "_blank");
            },
        });
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
                        isDownloading={downloadDocument.isPending}
                        onDownload={handleDownload}
                        onBack={() => navigate(-1)}
                        isSaved={isBookmarked}
                        isSaving={toggleBookmark.isPending}
                        onToggleSave={() => toggleBookmark.mutate()}
                    />

                    <CommentSection documentId={documentId} />
                </>
            )}
        </div>
    );
}