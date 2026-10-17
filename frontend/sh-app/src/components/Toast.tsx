"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
    message: string;
    type?: ToastType;
    onClose: () => void;
    duration?: number;
};

const toastStyles: Record<ToastType, string> = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-gray-200 bg-gray-50 text-gray-700",
};

const iconStyles: Record<ToastType, string> = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-gray-200 text-gray-600",
};

export default function Toast({
    message,
    type = "info",
    onClose,
    duration = 3500,
}: ToastProps) {
    useEffect(() => {
        if (!message) return;

        const timeout = window.setTimeout(onClose, duration);

        return () => window.clearTimeout(timeout);
    }, [message, duration, onClose]);

    if (!message) return null;

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
            className={`fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${toastStyles[type]}`}
        >
            <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${iconStyles[type]}`}
            >
                {type === "success" && (
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                            d="m5 12 4 4L19 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}

                {type === "error" && (
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                            d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}

                {type === "info" && (
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                            d="M12 11v5m0-8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                )}
            </span>

            <p className="flex-1 pt-1 text-sm font-medium leading-5">
                {message}
            </p>

            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="rounded-md p-1 opacity-70 transition hover:opacity-100"
            >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                        d="m18 6-12 12M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </div>
    );
}
