import { useState } from "react";
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty, useRestoreFaculty } from "@/features/faculty/use_faculty";
import { useCrudModal } from "@/common/hooks/use_modal";
import { FacultyFilter } from "@/features/faculty/components/faculty_filter";
import { FacultyList } from "@/features/faculty/components/faculty_list";
import { FacultyFormModal } from "@/features/faculty/components/faculty_form";
import { ConfirmDialog } from "@/common/components/confirm";
import type { FacultyDto, FacultyFilterParams, CreateFacultyRequest, UpdateFacultyRequest } from "@/features/faculty/faculty_type";

const DEFAULT_FILTERS: FacultyFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function FacultyPage() {
    const [filters, setFilters] = useState<FacultyFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<FacultyDto>();

    const { data, isLoading } = useFaculties(filters);
    const createMutation = useCreateFaculty();
    const updateMutation = useUpdateFaculty();
    const deleteMutation = useDeleteFaculty();
    const restoreMutation = useRestoreFaculty();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Quản Lý Khoa</h2>
                <button className="admin-page-create" onClick={crud.openCreate}>
                    + Tạo Khoa
                </button>
            </div>

            <FacultyFilter filters={filters} onChange={setFilters} />

            <FacultyList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onDelete={crud.openDelete}
                onRestore={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <FacultyFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateFacultyRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateFacultyRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Xóa khoa"
                message={`Bạn có chắc muốn xóa khoa "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={deleteMutation.isPending}
                onConfirm={() => crud.submitConfirm(deleteMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Khôi phục khoa"
                message={`Bạn có chắc muốn khôi phục khoa "${crud.selectedItem?.name}"?`}
                error={crud.actionError}
                isLoading={restoreMutation.isPending}
                onConfirm={() => crud.submitConfirm(restoreMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}