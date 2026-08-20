import { useEffect, useRef, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import { useSubjects } from "../use_subject";

interface SubjectSelectProps {
    value?: number;
    onChange: (subjectId: number | undefined) => void;
}

export function SubjectSelect({ value, onChange }: SubjectSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { data } = useSubjects({
        pageIndex: 1,
        pageSize: 20,
        search: debouncedSearch,
    });
    const subjects = data?.result?.items ?? [];
    const selectedName = subjects.find((s) => s.id === value)?.name;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="select-combobox" ref={wrapperRef}>
            <Input
                value={open ? search : (selectedName ?? "")}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder="Chọn môn học..."
            />

            {open && (
                <div className="select-combobox-dropdown">
                    <div className="select-combobox-option" onClick={() => { onChange(undefined); setSearch(""); setOpen(false)}}>
                        Tất cả môn học
                    </div>
                    {subjects.map((s) => (
                        <div key={s.id} className={`select-combobox-option ${s.id === value ? "active" : ""}`}
                            onClick={() => { onChange(s.id); setSearch(""); setOpen(false)}}>
                            {s.name}
                        </div>
                    ))}
                    {subjects.length === 0 && (
                        <div className="select-combobox-empty">Không tìm thấy môn học</div>
                    )}
                </div>
            )}
        </div>
    );
}