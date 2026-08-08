import { useEffect, useState } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { useDebounce } from "@/common/hooks/use_debounce";
import type { AccountFilterParams } from "../types/account_type";

interface AccountFilterProps {
    filters: AccountFilterParams;
    onChange: (filters: AccountFilterParams) => void;
    onClear: () => void;
}

export function AccountFilter({ filters, onChange, onClear }: AccountFilterProps) {
    const [keyword, setKeyword] = useState(filters.search ?? "");
    const debouncedKeyword = useDebounce(keyword, 500);

    useEffect(() => {
        onChange({ ...filters, search: debouncedKeyword, pageIndex: 1 });
    }, [debouncedKeyword]);

    return (
        <div className="page-filter">
            <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên tài khoản, email..."
            />

            <select className="page-filter-role" value={filters.role ?? ""} onChange={(e) => onChange({ ...filters, role: e.target.value || undefined, pageIndex: 1 })}>
                <option value="">Tất cả vai trò</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
            </select>

            <select className="page-filter-status" value={filters.isActive === undefined ? "" : String(filters.isActive)}
                onChange={(e) => onChange({ ...filters, isActive: e.target.value === "" ? undefined : e.target.value === "true", pageIndex: 1 })}>
                <option value="">Tất cả trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Đã khóa</option>
            </select>

            <Button className="page-filter-clear" onClick={onClear}>Xóa lọc</Button>
        </div>
    );
}