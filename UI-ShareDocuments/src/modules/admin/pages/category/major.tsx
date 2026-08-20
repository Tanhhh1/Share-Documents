import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { facultyApi } from "@/features/faculty/faculty_api";
import { useMajors, useCreateMajor, useUpdateMajor, useDeleteMajor, useRestoreMajor } from "@/features/major/use_major";
import { useCrudModal } from "@/common/hooks/use_modal";
import { MajorFilter } from "@/features/major/components/major_filter";
import { MajorList } from "@/features/major/components/major_list";
import { MajorFormModal } from "@/features/major/components/major_form";
import { ConfirmDialog } from "@/common/components/confirm";
import type { MajorDto, MajorFilterParams, CreateMajorRequest, UpdateMajorRequest } from "@/features/major/major_type";

export default function MajorPage() {
    const { facultyId: facultyIdParam } = useParams<{ facultyId: string }>();
    const facultyId = Number(facultyIdParam);
    const navigate = useNavigate();

    const DEFAULT_FILTERS: MajorFilterParams = { pageIndex: 1, pageSize: 10, facultyId };
    const [filters, setFilters] = useState<MajorFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<MajorDto>();

    const { data: facultyData } = useQuery({
        queryKey: ["faculty", facultyId],
        queryFn: () => facultyApi.getById(facultyId),
        enabled: !!facultyId,
    });

    const { data, isLoading } = useMajors(filters);
    const createMutation = useCreateMajor();
    const updateMutation = useUpdateMajor();
    const deleteMutation = useDeleteMajor();
    const restoreMutation = useRestoreMajor();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h2>
                        <a className="admin-page-back" onClick={() => navigate("/admin/faculty")}>
                            <i className="bx bx-chevrons-left" />
                        </a>
                        Ngành Thuộc Khoa: {facultyData?.result?.name ?? "..."}
                    </h2>
                </div>
                <button className="admin-page-create" onClick={crud.openCreate}>
                    + Tạo Ngành Học
                </button>
            </div>

            <MajorFilter filters={filters} onChange={setFilters} />

            <MajorList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <MajorFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                facultyId={facultyId}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateMajorRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateMajorRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa ngành"
                message={`Bạn có chắc muốn xóa ngành "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục ngành"
                message={`Bạn có chắc muốn khôi phục ngành "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}