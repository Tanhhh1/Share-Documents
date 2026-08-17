import { useSearchParams } from "react-router-dom";
import { usePublishedDocuments } from "@/features/document/use_document";
import { DocumentList } from "@/features/document/components/document_list";
import type { AccessLevel } from "@/common/constants/access_level";

export default function DocumentSearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") ?? undefined;
    const subjectId = searchParams.get("subjectId") ? Number(searchParams.get("subjectId")) : undefined;
    const groupId = searchParams.get("groupId") ? Number(searchParams.get("groupId")) : undefined;
    const accessLevel = (searchParams.get("accessLevel") as AccessLevel) || undefined;
    const tagIds = searchParams.getAll("tagIds").map(Number);
    const pageIndex = Number(searchParams.get("pageIndex") ?? 1);

    const { data, isLoading } = usePublishedDocuments({
        keyword,
        subjectId,
        groupId,
        accessLevel,
        tagIds: tagIds.length ? tagIds : undefined,
        pageIndex,
        pageSize: 12,
    });

    const handlePageChange = (newPageIndex: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("pageIndex", String(newPageIndex));
        setSearchParams(next);
    };

    return (
        <div className="document-search-page">
            <h1 className="document-search-title">
                {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Tất cả tài liệu"}
            </h1>

            <DocumentList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onPageChange={handlePageChange}
                getDetailPath={(id) => `/document/${id}`}
            />
        </div>
    );
}