import React from "react";
import "@/styles/component/button.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
    return (
        <button className={`custom-button ${className}`} {...props}>
            {children}
        </button>
    );
};