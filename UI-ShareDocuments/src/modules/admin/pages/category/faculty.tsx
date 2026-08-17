import { useState } from "react";
import { useFaculties } from "@/features/faculty/use_faculty";
import { useCreateFaculty, useUpdateFaculty, useDeleteFaculty, useRestoreFaculty } from "@/features/faculty/use_faculty";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { FacultyFilter } from "@/features/faculty/components/faculty_filter";
import { FacultyList } from "@/features/faculty/components/faculty_list";
import { FacultyFormModal } from "@/features/faculty/components/faculty_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { FacultyDto, FacultyFilterParams, CreateFacultyRequest, UpdateFacultyRequest } from "@/features/faculty/faculty_type";
import type { FieldError } from "@/common/types/api_result_type";

type FormMode = "create" | "update";

const DEFAULT_FILTERS: FacultyFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function FacultyPage() {
    const [filters, setFilters] = useState<FacultyFilterParams>(DEFAULT_FILTERS);
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyDto | null>(null);
    const [formMode, setFormMode] = useState<FormMode>("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [restoreError, setRestoreError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

    const { data, isLoading } = useFaculties(filters);
    const createMutation = useCreateFaculty();
    const updateMutation = useUpdateFaculty();
    const deleteMutation = useDeleteFaculty();
    const restoreMutation = useRestoreFaculty();

    const handleOpenCreate = () => {
        setFormMode("create");
        setSelectedFaculty(null);
        setFormErrors(null);
        formModal.open();
    };

    const handleOpenEdit = (faculty: FacultyDto) => {
        setFormMode("update");
        setSelectedFaculty(faculty);
        setFormErrors(null);
        formModal.open();
    };

    const handleSubmitForm = (payload: CreateFacultyRequest | UpdateFacultyRequest) => {
        setFormErrors(null);
        const onSettled = (result: { succeeded: boolean; errors?: FieldError[] }) => {
            if (result.succeeded) {
                formModal.close();
            } else {
                setFormErrors(result.errors ?? null);
            }
        };

        if (formMode === "create") {
            createMutation.mutate(payload as CreateFacultyRequest, { onSuccess: onSettled });
        } else {
            updateMutation.mutate(payload as UpdateFacultyRequest, { onSuccess: onSettled });
        }
    };

    const handleOpenDelete = (faculty: FacultyDto) => {
        setSelectedFaculty(faculty);
        setDeleteError(undefined);
        deleteDialog.open();
    };

    const handleOpenRestore = (faculty: FacultyDto) => {
        setSelectedFaculty(faculty);
        setRestoreError(undefined);
        restoreDialog.open();
    };

    const handleConfirmDelete = () => {
        if (!selectedFaculty) return;
        setDeleteError(undefined);
        deleteMutation.mutate(selectedFaculty.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    deleteDialog.close();
                } else {
                    setDeleteError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleConfirmRestore = () => {
        if (!selectedFaculty) return;
        setRestoreError(undefined);
        restoreMutation.mutate(selectedFaculty.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    restoreDialog.close();
                } else {
                    setRestoreError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    return (
        <div className="page">
            <div className="page-header">
                <h2>Quản Lý Khoa</h2>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Khoa
                </button>
            </div>

            <FacultyFilter filters={filters} onChange={setFilters}/>

            <FacultyList
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onRestore={handleOpenRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <FacultyFormModal
                isOpen={formModal.isOpen}
                mode={formMode}
                initialValues={selectedFaculty ?? undefined}
                isLoading={formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xóa khoa"
                message={`Bạn có chắc muốn xóa khoa "${selectedFaculty?.name}"?`}
                error={deleteError}
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
                onCancel={deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={restoreDialog.isOpen}
                title="Khôi phục khoa"
                message={`Bạn có chắc muốn khôi phục khoa "${selectedFaculty?.name}"?`}
                error={restoreError}
                isLoading={restoreMutation.isPending}
                onConfirm={handleConfirmRestore}
                onCancel={restoreDialog.close}
            />
        </div>
    );
}