import { useState } from "react";
import { useAccounts, useCreateAccount, useUpdateAccount, useLockAccount, useUnlockAccount } from "@/features/account/use_account";
import { AccountTable } from "@/features/account/components/account_table";
import { AccountFilter } from "@/features/account/components/account_filter";
import { AccountFormModal } from "@/features/account/components/account_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { useCrudModal } from "@/common/hooks/use_modal"
import type { AccountDto, AccountFilterParams, CreateAccountRequest, UpdateAccountRequest } from "@/features/account/account_type";

const DEFAULT_FILTERS: AccountFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function AccountPage() {
    const [filters, setFilters] = useState<AccountFilterParams>(DEFAULT_FILTERS);
    const crud = useCrudModal<AccountDto>();

    const { data, isLoading } = useAccounts(filters);
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const lockMutation = useLockAccount();
    const unlockMutation = useUnlockAccount();

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <h2>Quản Lý Tài Khoản</h2>
                <button className="admin-page-create" onClick={crud.openCreate}>
                    + Tạo Tài Khoản
                </button>
            </div>

            <AccountFilter filters={filters} onChange={setFilters} />

            <AccountTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={crud.openEdit}
                onLock={crud.openDelete}
                onUnlock={crud.openRestore}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <AccountFormModal
                isOpen={crud.formModal.isOpen}
                mode={crud.formMode}
                initialValues={crud.selectedItem ?? undefined}
                isLoading={crud.formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={crud.formErrors}
                onClose={crud.formModal.close}
                onSubmit={(payload) => {
                    if (crud.formMode === "create") {
                        crud.submitForm(createMutation.mutate, payload as CreateAccountRequest);
                    } else {
                        crud.submitForm(updateMutation.mutate, payload as UpdateAccountRequest);
                    }
                }}
            />

            <ConfirmDialog
                isOpen={crud.deleteDialog.isOpen}
                title="Khóa tài khoản"
                message={`Bạn có chắc muốn khóa tài khoản "${crud.selectedItem?.userName}"?`}
                error={crud.actionError}
                isLoading={lockMutation.isPending}
                onConfirm={() => crud.submitConfirm(lockMutation.mutate, crud.deleteDialog)}
                onCancel={crud.deleteDialog.close}
            />

            <ConfirmDialog
                isOpen={crud.restoreDialog.isOpen}
                title="Mở khóa tài khoản"
                message={`Bạn có chắc muốn mở khóa tài khoản "${crud.selectedItem?.userName}"?`}
                error={crud.actionError}
                isLoading={unlockMutation.isPending}
                onConfirm={() => crud.submitConfirm(unlockMutation.mutate, crud.restoreDialog)}
                onCancel={crud.restoreDialog.close}
            />
        </div>
    );
}