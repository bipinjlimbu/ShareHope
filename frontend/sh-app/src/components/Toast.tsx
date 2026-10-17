"use client";

import { useEffect, useState } from "react";
import type { ToastProps, ToastType } from "@/types/toast";

const toastStyles: Record<
    ToastType,
    {
        border: string;
        iconBackground: string;
        iconColor: string;
        progressColor: string;
        icon: string;
        title: string;
    }
> = {
    success: {
        border: "border-green-200",
        iconBackground: "bg-green-100",
        iconColor: "text-green-700",
        progressColor: "bg-green-500",
        icon: "✓",
        title: "Success",
    },
    error: {
        border: "border-red-200",
        iconBackground: "bg-red-100",
        iconColor: "text-red-700",
        progressColor: "bg-red-500",
        icon: "!",
        title: "Error",
    },
    info: {
        border: "border-gray-200",
        iconBackground: "bg-gray-100",
        iconColor: "text-gray-700",
        progressColor: "bg-gray-500",
        icon: "i",
        title: "Information",
    },
};

export default function Toast({
    message,
    type,
    duration,
    onClose,
}: ToastProps) {
    const [progressStarted, setProgressStarted] = useState(false);
    const style = toastStyles[type];

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setProgressStarted(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div
            className="pointer-events-none fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-sm"
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <div
                className={`pointer-events-auto overflow-hidden rounded-xl border ${style.border} bg-white shadow-xl`}
            >
                <div className="flex items-start gap-3 p-4">
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${style.iconBackground} ${style.iconColor}`}
                        aria-hidden="true"
                    >
                        {style.icon}
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-gray-900">
                            {style.title}
                        </p>

                        <p className="mt-1 break-words text-sm leading-5 text-gray-600">
                            {message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close notification"
                        className="rounded-md px-1 text-xl leading-5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <div className="h-1 w-full bg-gray-100">
                    <div
                        className={`h-full ${style.progressColor}`}
                        style={{
                            width: progressStarted ? "0%" : "100%",
                            transition: `width ${duration}ms linear`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}