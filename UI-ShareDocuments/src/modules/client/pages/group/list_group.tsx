import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/common/components/input";
import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import { useDebounce } from "@/common/hooks/use_debounce";
import { usePublishedDocumentGroups } from "@/features/document_group/use_group";
import type { GetPublishedGroupParams } from "@/features/document_group/group_type";

const DEFAULT_FILTERS: GetPublishedGroupParams = {
    pageIndex: 1,
    pageSize: 12,
    search: "",
};

export default function PublishedGroupPage() {
    const [filters, setFilters] = useState<GetPublishedGroupParams>(DEFAULT_FILTERS);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const navigate = useNavigate();

    useEffect(() => {
        setFilters((prev) => ({ ...prev, search: debouncedSearch, pageIndex: 1 }));
    }, [debouncedSearch]);

    const { data, isLoading } = usePublishedDocumentGroups(filters);
    const pageData = data?.result;

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Danh Sách Nhóm Chủ Đề</h2>
                <p>Khám phá các nhóm chủ đề tài liệu được chia sẻ công khai</p>
                <div className="data-filter">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo tiêu đề..."
                    />
                </div>
            </div>
            <div className="group-list">
                {pageData?.items.map((group) => (
                    <CardItem
                        key={group.id}
                        variant="navigate"
                        name={group.title}
                        createdAt={group.createdAt}
                        onClick={() =>
                            navigate(`/document?groupId=${group.id}`, {
                                state: { groupName: group.title },
                            })
                        }
                    />
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Không có nhóm chủ đề nào</p>
                )}
            </div>

            {pageData && (
                <Pagination
                    pageIndex={pageData.pageIndex}
                    totalPages={pageData.totalPages}
                    hasPrevious={pageData.hasPrevious}
                    hasNext={pageData.hasNext}
                    onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                />
            )}
        </div>
    );
}