import { useEffect, useRef, useState } from "react";
import { Input } from "@/common/components/input";
import { useDebounce } from "@/common/hooks/use_debounce";
import { useTags } from "../use_tag";
import "@/styles/component/combobox.css"

interface TagMultiSelectProps {
    value?: number[];
    onChange: (tagIds: number[] | undefined) => void;
}

export function TagMultiSelect({ value = [], onChange }: TagMultiSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { data } = useTags({
        pageIndex: 1,
        pageSize: 20,
        search: debouncedSearch,
    });
    const tags = data?.result?.items ?? [];
    const selectedTags = tags.filter((t) => value.includes(t.id));

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function toggleTag(id: number) {
        const next = value.includes(id)
            ? value.filter((tagId) => tagId !== id)
            : [...value, id];
        onChange(next.length > 0 ? next : undefined);
    }

    return (
        <div className="select-combobox" ref={wrapperRef}>
            <div className="select-multi-input" onClick={() => setOpen(true)}>
                {selectedTags.length === 0 && (
                    <span className="select-placeholder">Chọn thẻ phân loại...</span>
                )}
                {selectedTags.map((t) => (
                    <span key={t.id} className="select-chip">
                        {t.name}
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleTag(t.id)}}>
                            ×
                        </button>
                    </span>
                ))}
            </div>

            {open && (
                <div className="select-combobox-dropdown">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm thẻ phân loại..."
                        autoFocus
                    />
                    {tags.map((t) => (
                        <div key={t.id} className={`select-combobox-option ${value.includes(t.id) ? "active" : ""}`} onClick={() => toggleTag(t.id)}>
                            <input type="checkbox" readOnly checked={value.includes(t.id)} />{t.name}
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <div className="select-combobox-empty">Không tìm thấy tag</div>
                    )}
                </div>
            )}
        </div>
    );
}