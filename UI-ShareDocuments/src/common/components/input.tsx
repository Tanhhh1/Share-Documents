import React, { forwardRef } from "react";
import "@/styles/component/input.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, className = "", ...props }, ref) => {
        return (
            <div className="input-wrapper">
                <input ref={ref} className={`custom-input ${error ? "has-error" : ""} ${className}`} {...props}/>
                {error && <p className="input-error-message">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";