import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { facultyApi } from "@/features/faculty/faculty_api";
import { useMajors } from "@/features/major/hooks/use_major";
import { useCreateMajor } from "@/features/major/hooks/use_create_major";
import { useUpdateMajor } from "@/features/major/hooks/use_update_major";
import { useDeleteMajor } from "@/features/major/hooks/use_delete_major";
import { useRestoreMajor } from "@/features/major/hooks/use_restore_major";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import { MajorFilter } from "@/features/major/components/major_filter";
import { MajorFormModal } from "@/features/major/components/major_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { MajorDto, MajorFilterParams, CreateMajorRequest, UpdateMajorRequest } from "@/features/major/types/major_type";
import type { FieldError } from "@/common/types/api_result_type";

type FormMode = "create" | "update";

export default function MajorPage() {
    const { facultyId: facultyIdParam } = useParams<{ facultyId: string }>();
    const facultyId = Number(facultyIdParam);
    const navigate = useNavigate();

    const DEFAULT_FILTERS: MajorFilterParams = { pageIndex: 1, pageSize: 10, facultyId };

    const [filters, setFilters] = useState<MajorFilterParams>(DEFAULT_FILTERS);
    const [selectedMajor, setSelectedMajor] = useState<MajorDto | null>(null);
    const [formMode, setFormMode] = useState<FormMode>("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [restoreError, setRestoreError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

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

    const handleOpenCreate = () => {
        setFormMode("create");
        setSelectedMajor(null);
        setFormErrors(null);
        formModal.open();
    };

    const handleOpenEdit = (major: MajorDto) => {
        setFormMode("update");
        setSelectedMajor(major);
        setFormErrors(null);
        formModal.open();
    };

    const handleSubmitForm = (payload: CreateMajorRequest | UpdateMajorRequest) => {
        setFormErrors(null);
        const onSettled = (result: { succeeded: boolean; errors?: FieldError[] }) => {
            if (result.succeeded) {
                formModal.close();
            } else {
                setFormErrors(result.errors ?? null);
            }
        };

        if (formMode === "create") {
            createMutation.mutate(payload as CreateMajorRequest, { onSuccess: onSettled });
        } else {
            updateMutation.mutate(payload as UpdateMajorRequest, { onSuccess: onSettled });
        }
    };

    const handleOpenDelete = (major: MajorDto) => {
        setSelectedMajor(major);
        setDeleteError(undefined);
        deleteDialog.open();
    };

    const handleOpenRestore = (major: MajorDto) => {
        setSelectedMajor(major);
        setRestoreError(undefined);
        restoreDialog.open();
    };

    const handleConfirmDelete = () => {
        if (!selectedMajor) return;
        setDeleteError(undefined);
        deleteMutation.mutate(selectedMajor.id, {
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
        if (!selectedMajor) return;
        setRestoreError(undefined);
        restoreMutation.mutate(selectedMajor.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    restoreDialog.close();
                } else {
                    setRestoreError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleClearFilter = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>
                        <a className="page-back" onClick={() => navigate("/admin/faculty")}>
                            <i className="bx bx-chevrons-left" />
                        </a>
                        Ngành Thuộc Khoa: {facultyData?.result?.name ?? "..."}
                    </h2>
                </div>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Ngành Học
                </button>
            </div>

            <MajorFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <div className="card-grid">
                {data?.result?.items.map((major) => (
                    <CardItem
                        key={major.id}
                        variant="crud"
                        name={major.name}
                        createdAt={major.createdAt}
                        isDeleted={!major.isActive}
                        onEdit={() => handleOpenEdit(major)}
                        onDelete={() => handleOpenDelete(major)}
                        onRestore={() => handleOpenRestore(major)}
                        onClick={() => navigate(`/admin/major/${major.id}/subject`)}
                    />
                ))}
                {!isLoading && data?.result?.items.length === 0 && (
                    <p className="card-empty">Không có ngành nào</p>
                )}
            </div>

            {data?.result && (
                <Pagination
                    pageIndex={data.result.pageIndex}
                    totalPages={data.result.totalPages}
                    hasPrevious={data.result.hasPrevious}
                    hasNext={data.result.hasNext}
                    onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                />
            )}

            <MajorFormModal
                isOpen={formModal.isOpen}
                mode={formMode}
                facultyId={facultyId}
                initialValues={selectedMajor ?? undefined}
                isLoading={formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xóa ngành"
                message={`Bạn có chắc muốn xóa ngành "${selectedMajor?.name}"?`}
                error={deleteError}
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
                onCancel={deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={restoreDialog.isOpen}
                title="Khôi phục ngành"
                message={`Bạn có chắc muốn khôi phục ngành "${selectedMajor?.name}"?`}
                error={restoreError}
                isLoading={restoreMutation.isPending}
                onConfirm={handleConfirmRestore}
                onCancel={restoreDialog.close}
            />
        </div>
    );
}