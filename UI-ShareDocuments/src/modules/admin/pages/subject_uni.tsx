import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { majorApi } from "@/features/major/major_api";
import { useSubjects } from "@/features/subject/hooks/use_subject";
import { useCreateSubject } from "@/features/subject/hooks/use_create_subject";
import { useUpdateSubject } from "@/features/subject/hooks/use_update_subject";
import { useDeleteSubject } from "@/features/subject/hooks/use_delete_subject";
import { useRestoreSubject } from "@/features/subject/hooks/use_restore_subject";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { CardItem } from "@/common/components/card_item";
import { Pagination } from "@/common/components/pagination";
import { SubjectFilter } from "@/features/subject/components/subject_filter";
import { SubjectFormModal } from "@/features/subject/components/subject_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import { EducationLevel } from "@/common/constants/education_level";
import type { SubjectDto, SubjectFilterParams, CreateSubjectRequest, UpdateSubjectRequest } from "@/features/subject/types/subject_type";
import type { FieldError } from "@/common/types/api_result_type";

type FormMode = "create" | "update";

export default function SubjectPage() {
    const { majorId: majorIdParam } = useParams<{ majorId: string }>();
    const majorId = Number(majorIdParam);
    const navigate = useNavigate();

    const DEFAULT_FILTERS: SubjectFilterParams = {
        pageIndex: 1,
        pageSize: 10,
        educationLevel: EducationLevel.DaiHoc,
        majorId,
    };

    const [filters, setFilters] = useState<SubjectFilterParams>(DEFAULT_FILTERS);
    const [selectedSubject, setSelectedSubject] = useState<SubjectDto | null>(null);
    const [formMode, setFormMode] = useState<FormMode>("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [deleteError, setDeleteError] = useState<string | undefined>();
    const [restoreError, setRestoreError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const deleteDialog = useDisclosure();
    const restoreDialog = useDisclosure();

    const { data: majorData } = useQuery({
        queryKey: ["major", majorId],
        queryFn: () => majorApi.getById(majorId),
        enabled: !!majorId,
    });

    const { data, isLoading } = useSubjects(filters);
    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();
    const restoreMutation = useRestoreSubject();

    const handleOpenCreate = () => {
        setFormMode("create");
        setSelectedSubject(null);
        setFormErrors(null);
        formModal.open();
    };

    const handleOpenEdit = (subject: SubjectDto) => {
        setFormMode("update");
        setSelectedSubject(subject);
        setFormErrors(null);
        formModal.open();
    };

    const handleSubmitForm = (payload: CreateSubjectRequest | UpdateSubjectRequest) => {
        setFormErrors(null);
        const onSettled = (result: { succeeded: boolean; errors?: FieldError[] }) => {
            if (result.succeeded) {
                formModal.close();
            } else {
                setFormErrors(result.errors ?? null);
            }
        };

        if (formMode === "create") {
            createMutation.mutate(payload as CreateSubjectRequest, { onSuccess: onSettled });
        } else {
            updateMutation.mutate(payload as UpdateSubjectRequest, { onSuccess: onSettled });
        }
    };

    const handleOpenDelete = (subject: SubjectDto) => {
        setSelectedSubject(subject);
        setDeleteError(undefined);
        deleteDialog.open();
    };

    const handleOpenRestore = (subject: SubjectDto) => {
        setSelectedSubject(subject);
        setRestoreError(undefined);
        restoreDialog.open();
    };

    const handleConfirmDelete = () => {
        if (!selectedSubject) return;
        setDeleteError(undefined);
        deleteMutation.mutate(selectedSubject.id, {
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
        if (!selectedSubject) return;
        setRestoreError(undefined);
        restoreMutation.mutate(selectedSubject.id, {
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
                        <a className="page-back" onClick={() => navigate(`/admin/faculty/${majorData?.result?.facultyId}/major`)}>
                            <i className="bx bx-chevrons-left" />
                        </a>
                        Môn Học Thuộc Ngành: {majorData?.result?.name ?? "..."}
                    </h2>
                </div>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Môn Học
                </button>
            </div>

            <SubjectFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <div className="card-grid">
                {data?.result?.items.map((subject) => (
                    <CardItem
                        key={subject.id}
                        variant="crud"
                        name={subject.name}
                        createdAt={subject.createdAt}
                        isDeleted={!subject.isActive}
                        onEdit={() => handleOpenEdit(subject)}
                        onDelete={() => handleOpenDelete(subject)}
                        onRestore={() => handleOpenRestore(subject)}
                    />
                ))}
                {!isLoading && data?.result?.items.length === 0 && (
                    <p className="card-empty">Không có môn học nào</p>
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

            <SubjectFormModal
                isOpen={formModal.isOpen}
                mode={formMode}
                educationLevel={EducationLevel.DaiHoc}
                majorId={majorId}
                initialValues={selectedSubject ?? undefined}
                isLoading={formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xóa môn học"
                message={`Bạn có chắc muốn xóa môn học "${selectedSubject?.name}"?`}
                error={deleteError}
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
                onCancel={deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={restoreDialog.isOpen}
                title="Khôi phục môn học"
                message={`Bạn có chắc muốn khôi phục môn học "${selectedSubject?.name}"?`}
                error={restoreError}
                isLoading={restoreMutation.isPending}
                onConfirm={handleConfirmRestore}
                onCancel={restoreDialog.close}
            />
        </div>
    );
}