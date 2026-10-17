export type ToastType = "success" | "error" | "info";

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
};

export type ToastContextValue = {
    showToast: (
        message: string,
        type?: ToastType,
        duration?: number
    ) => void;
    dismissToast: () => void;
};

export type ToastProps = {
    message: string;
    type: ToastType;
    duration: number;
    onClose: () => void;
};
