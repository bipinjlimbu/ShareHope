"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import Toast from "@/components/Toast";
import type { ToastContextValue, ToastItem, ToastType } from "@/types/toast";

const ToastContext = createContext<ToastContextValue | undefined>(
    undefined
);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastItem | null>(null);
    const nextId = useRef(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dismissToast = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setToast(null);
    }, []);

    const showToast = useCallback(
        (
            message: string,
            type: ToastType = "info",
            duration = 3500
        ) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            setToast({
                id: ++nextId.current,
                message,
                type,
                duration: Math.max(3000, duration),
            });
        },
        []
    );

    useEffect(() => {
        if (!toast) return;

        const currentId = toast.id;

        timeoutRef.current = setTimeout(() => {
            setToast((current) =>
                current?.id === currentId ? null : current
            );

            timeoutRef.current = null;
        }, toast.duration);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [toast]);

    return (
        <ToastContext.Provider value={{ showToast, dismissToast }}>
            {children}

            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={dismissToast}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider."
        );
    }

    return context;
}