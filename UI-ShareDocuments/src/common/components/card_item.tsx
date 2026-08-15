import type { ReactNode } from "react";
import "@/styles/component/card_item.css";

interface CardItemBaseProps {
    name: string;
    createdAt: string;
}

interface CardItemCrudProps extends CardItemBaseProps {
    variant: "crud";
    isDeleted: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onRestore: () => void;
    onClick?: () => void;
}

interface CardItemNavigateProps extends CardItemBaseProps {
    variant: "navigate";
    onClick: () => void;
}

interface CardItemModerationProps extends CardItemBaseProps {
    variant: "moderation";
    isPending: boolean;
    statusLabel: string;
    statusClassName?: string;
    onApprove: () => void;
    onReject: () => void;
    onClick?: () => void;
}

type CardItemProps = CardItemCrudProps | CardItemNavigateProps | CardItemModerationProps;

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("vi-VN");
}

export function CardItem(props: CardItemProps) {
    const { name, createdAt, variant } = props;

    const clickable = variant === "navigate" || ((variant === "crud" || variant === "moderation") && !!props.onClick);

    const handleCardClick = () => {
        if (variant === "navigate") {
            props.onClick();
        } else if ((variant === "crud" || variant === "moderation") && props.onClick) {
            props.onClick();
        }
    };

    return (
        <div className={`card-item ${clickable ? "card-item-clickable" : ""}`}  onClick={clickable ? handleCardClick : undefined}>
            <div className="card-item-info">
                <p className="card-item-name">{name}</p>
                <p className="card-item-date">{formatDate(createdAt)}</p>
            </div>

            <div className="card-item-actions" onClick={(e) => e.stopPropagation()}>
                {variant === "crud" && <CardCrudActions {...props} />}
                {variant === "navigate" && <i className="bx bx-chevron-right card-item-arrow"></i>}
                {variant === "moderation" && <CardModerationActions {...props} />}
            </div>
        </div>
    );
}

function CardCrudActions({ isDeleted, onEdit, onDelete, onRestore }: CardItemCrudProps): ReactNode {
    return (
        <>
            {!isDeleted && (
                <button type="button" className="table-action-btn edit" title="Sửa" onClick={onEdit}>
                    <i className="bx bx-edit-alt"></i>
                </button>
            )}
            {isDeleted ? (
                <button type="button" className="table-action-btn unlock" title="Khôi phục" onClick={onRestore}>
                    <i className="bx bx-undo"></i>
                </button>
            ) : (
                <button type="button" className="table-action-btn lock" title="Xóa" onClick={onDelete}>
                    <i className="bx bx-trash"></i>
                </button>
            )}
        </>
    );
}

function CardModerationActions({ isPending, statusLabel, statusClassName, onApprove, onReject }: CardItemModerationProps): ReactNode {
    if (!isPending) {
        return <span className={statusClassName ?? "badge"}>{statusLabel}</span>;
    }
    return (
        <>
            <button type="button" className="table-action-btn unlock" title="Duyệt" onClick={onApprove}>
                <i className="bx bx-check"></i>
            </button>
            <button type="button" className="table-action-btn lock" title="Từ chối" onClick={onReject}>
                <i className="bx bx-x"></i>
            </button>
        </>
    );
}