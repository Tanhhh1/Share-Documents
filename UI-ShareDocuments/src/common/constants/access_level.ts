export const AccessLevel = {
    Free: "Free",
    Premium: "Premium",
} as const;

export type AccessLevel = (typeof AccessLevel)[keyof typeof AccessLevel];

export const ACCESS_LEVEL_LABEL: Record<AccessLevel, string> = {
    Free: "Miễn phí",
    Premium: "Trả phí",
};

export const ACCESS_LEVELS: AccessLevel[] = [
    AccessLevel.Free,
    AccessLevel.Premium,
];

export function isPremiumLevel(level: AccessLevel): boolean {
    return level === AccessLevel.Premium;
}