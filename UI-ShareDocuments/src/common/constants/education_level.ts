export const EducationLevel = {
    TieuHoc: "TieuHoc",
    THCS: "THCS",
    THPT: "THPT",
    DaiHoc: "DaiHoc",
} as const;

export type EducationLevel = (typeof EducationLevel)[keyof typeof EducationLevel];

export const EDUCATION_LEVEL_LABEL: Record<EducationLevel, string> = {
    TieuHoc: "Tiểu học",
    THCS: "THCS",
    THPT: "THPT",
    DaiHoc: "Đại học",
};

export const GENERAL_EDUCATION_LEVELS: EducationLevel[] = [
    EducationLevel.TieuHoc,
    EducationLevel.THCS,
    EducationLevel.THPT,
];

export function isUniversityLevel(level: EducationLevel): boolean {
    return level === EducationLevel.DaiHoc;
}