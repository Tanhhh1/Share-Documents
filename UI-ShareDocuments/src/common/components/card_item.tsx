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

type CardItemProps = CardItemCrudProps | CardItemNavigateProps;

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString("vi-VN");
}

export function CardItem(props: CardItemProps) {
    const { name, createdAt, variant } = props;

    const clickable = variant === "navigate" || (variant === "crud" && !!props.onClick);

    const handleCardClick = () => {
        if (variant === "navigate") {
            props.onClick();
        } else if (props.onClick) {
            props.onClick();
        }
    };

    return (
        <div className={`card-item ${clickable ? "card-item-clickable" : ""}`} onClick={clickable ? handleCardClick : undefined}>
            <div className="card-item-info">
                <p className="card-item-name">{name}</p>
                <p className="card-item-date">{formatDate(createdAt)}</p>
            </div>

            <div className="card-item-actions" onClick={(e) => e.stopPropagation()}>
                {variant === "crud" ? (
                    <CardCrudActions {...props} />
                ) : (
                    <i className="bx bx-chevron-right card-item-arrow"></i>
                )}
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