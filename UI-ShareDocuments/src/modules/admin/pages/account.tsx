import { useState } from "react";
import { useAccounts } from "@/features/account/hooks/use_account";
import { useCreateAccount } from "@/features/account/hooks/use_create_account";
import { useUpdateAccount } from "@/features/account/hooks/use_update_account";
import { useLockAccount } from "@/features/account/hooks/use_lock_account";
import { useUnlockAccount } from "@/features/account/hooks/use_unlock_account";
import { useDisclosure } from "@/common/hooks/use_disclosure";
import { AccountTable } from "@/features/account/components/account_table";
import { AccountFilter } from "@/features/account/components/account_filter";
import { AccountFormModal } from "@/features/account/components/account_form";
import { ConfirmDialog } from "@/common/components/confirm";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { AccountDto, AccountFilterParams, CreateAccountRequest, UpdateAccountRequest } from "@/features/account/types/account_type";
import type { FieldError } from "@/common/types/api_result_type";

type FormMode = "create" | "update";

const DEFAULT_FILTERS: AccountFilterParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function AccountPage() {
    const [filters, setFilters] = useState<AccountFilterParams>(DEFAULT_FILTERS);
    const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(null);
    const [formMode, setFormMode] = useState<FormMode>("create");
    const [formErrors, setFormErrors] = useState<FieldError[] | null>(null);
    const [lockError, setLockError] = useState<string | undefined>();
    const [unlockError, setUnlockError] = useState<string | undefined>();

    const formModal = useDisclosure();
    const lockDialog = useDisclosure();
    const unlockDialog = useDisclosure();

    const { data, isLoading } = useAccounts(filters);
    const createMutation = useCreateAccount();
    const updateMutation = useUpdateAccount();
    const lockMutation = useLockAccount();
    const unlockMutation = useUnlockAccount();

    const handleOpenCreate = () => {
        setFormMode("create");
        setSelectedAccount(null);
        setFormErrors(null);
        formModal.open();
    };

    const handleOpenEdit = (account: AccountDto) => {
        setFormMode("update");
        setSelectedAccount(account);
        setFormErrors(null);
        formModal.open();
    };

    const handleSubmitForm = (payload: CreateAccountRequest | UpdateAccountRequest) => {
        setFormErrors(null);
        const onSettled = (result: { succeeded: boolean; errors?: FieldError[] }) => {
            if (result.succeeded) {
                formModal.close();
            } else {
                setFormErrors(result.errors ?? null);
            }
        };

        if (formMode === "create") {
            createMutation.mutate(payload as CreateAccountRequest, { onSuccess: onSettled });
        } else {
            updateMutation.mutate(payload as UpdateAccountRequest, { onSuccess: onSettled });
        }
    };

    const handleOpenLock = (account: AccountDto) => {
        setSelectedAccount(account);
        setLockError(undefined);
        lockDialog.open();
    };

    const handleOpenUnlock = (account: AccountDto) => {
        setSelectedAccount(account);
        setUnlockError(undefined);
        unlockDialog.open();
    };

    const handleConfirmLock = () => {
        if (!selectedAccount) return;
        setLockError(undefined);
        lockMutation.mutate(selectedAccount.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    lockDialog.close();
                } else {
                    setLockError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
                }
            },
        });
    };

    const handleConfirmUnlock = () => {
        if (!selectedAccount) return;
        setUnlockError(undefined);
        unlockMutation.mutate(selectedAccount.id, {
            onSuccess: (result) => {
                if (result.succeeded) {
                    unlockDialog.close();
                } else {
                    setUnlockError(getGeneralErrors(result.errors) ?? "Có lỗi xảy ra, vui lòng thử lại");
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
                <h2>Quản Lý Tài Khoản</h2>
                <button className="page-create" onClick={handleOpenCreate}>
                    + Tạo Tài Khoản
                </button>
            </div>

            <AccountFilter filters={filters} onChange={setFilters} onClear={handleClearFilter} />

            <AccountTable
                pageData={data?.result ?? undefined}
                isLoading={isLoading}
                onEdit={handleOpenEdit}
                onLock={handleOpenLock}
                onUnlock={handleOpenUnlock}
                onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
            />

            <AccountFormModal
                isOpen={formModal.isOpen}
                mode={formMode}
                initialValues={selectedAccount ?? undefined}
                isLoading={formMode === "create" ? createMutation.isPending : updateMutation.isPending}
                apiErrors={formErrors}
                onClose={formModal.close}
                onSubmit={handleSubmitForm}
            />

            <ConfirmDialog
                isOpen={lockDialog.isOpen}
                title="Khóa tài khoản"
                message={`Bạn có chắc muốn khóa tài khoản "${selectedAccount?.userName}"?`}
                error={lockError}
                isLoading={lockMutation.isPending}
                onConfirm={handleConfirmLock}
                onCancel={lockDialog.close}
            />

            <ConfirmDialog
                isOpen={unlockDialog.isOpen}
                title="Mở khóa tài khoản"
                message={`Bạn có chắc muốn mở khóa tài khoản "${selectedAccount?.userName}"?`}
                error={unlockError}
                isLoading={unlockMutation.isPending}
                onConfirm={handleConfirmUnlock}
                onCancel={unlockDialog.close}
            />
        </div>
    );
}