import { useState } from "react";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, useRestoreSubject } from "@/features/subject/use_subject";
import { useCrudModal } from "@/common/hooks/use_modal";
import { SubjectFilter } from "@/features/subject/components/subject_filter";
import { SubjectList } from "@/features/subject/components/subject_list";
import { SubjectFormModal } from "@/features/subject/components/subject_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { EducationLevel } from "@/common/constants/education_level";
import type { SubjectDto, SubjectFilterParams, CreateSubjectRequest, UpdateSubjectRequest } from "@/features/subject/subject_type";

const DEFAULT_FILTERS: SubjectFilterParams = {
    pageIndex: 1,
    pageSize: 10,
    educationLevel: EducationLevel.TieuHoc,
};

export default function GenSubjectPage() {
    const [filters, setFilters] = useState<SubjectFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<SubjectDto>();

    const { data, isLoading } = useSubjects(filters);
    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();
    const restoreMutation = useRestoreSubject();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Môn Học Phổ Thông</h2>
                <button className="admin-page-create" onClick={crud.openCreate}>
                    + Tạo Môn Học
                </button>
            </div>

            <SubjectFilter filters={filters} onChange={setFilters} />

            <SubjectList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <SubjectFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                educationLevel={filters.educationLevel ?? EducationLevel.TieuHoc}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateSubjectRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateSubjectRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa môn học"
                message={`Bạn có chắc muốn xóa môn học "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục môn học"
                message={`Bạn có chắc muốn khôi phục môn học "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}