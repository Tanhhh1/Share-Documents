import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDocuments } from "@/features/document/use_document";
import { DocumentList } from "@/features/document/components/document_list";
import { DocumentFilter } from "@/features/document/components/document_filter";
import type { DocumentFilterParams } from "@/features/document/document_type";

interface GroupLocationState {
    title?: string;
    description?: string | null;
}

export default function GroupDocumentPage() {
    const { groupId } = useParams<{ groupId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as GroupLocationState | null;

    const parsedGroupId = Number(groupId);

    const [filters, setFilters] = useState<DocumentFilterParams>({
        pageIndex: 1,
        pageSize: 12,
        groupId: parsedGroupId,
    });

    const { data, isLoading } = useDocuments(filters);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2>
                        <a className="admin-page-back" onClick={() => navigate(-1)}>
                            <i className="bx bx-chevrons-left" />
                        </a>
                        {state?.title ?? "Tài liệu thuộc nhóm"}
                    </h2>
                </div>
            </div>

            <DocumentFilter filters={filters} onChange={setFilters} />

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                getDetailPath={(id) => `/admin/document/${id}`}
            />
        </div>
    );
}