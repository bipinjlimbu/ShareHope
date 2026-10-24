"use client";

import { useEffect } from "react";
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    description?: string;
    itemName?: string;
    confirmText?: string;
    isDeleting?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteConfirmationModal({
    isOpen,
    title = "Delete this item?",
    description = "This action cannot be undone. The selected item will be permanently deleted.",
    itemName,
    confirmText = "Delete",
    isDeleting = false,
    onConfirm,
    onCancel,
}: DeleteConfirmationModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isDeleting) {
                onCancel();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isDeleting, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isDeleting
                ) {
                    onCancel();
                }
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-confirmation-title"
                aria-describedby="delete-confirmation-description"
                className="w-full max-w-md rounded-2xl border border-[#E5EDE3] bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <AlertTriangle size={24} />
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        aria-label="Close confirmation"
                        className="rounded-lg p-2 text-[#829184] transition hover:bg-[#F0F5ED] hover:text-[#183B2A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={19} />
                    </button>
                </div>

                <h2
                    id="delete-confirmation-title"
                    className="mt-5 text-xl font-bold text-[#183B2A]"
                >
                    {title}
                </h2>

                <p
                    id="delete-confirmation-description"
                    className="mt-2 text-sm leading-6 text-[#647568]"
                >
                    {description}
                </p>

                {itemName && (
                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                        <p className="break-words text-sm font-semibold text-red-800">
                            {itemName}
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="rounded-xl border border-[#DDE7D9] bg-white px-5 py-2.5 text-sm font-semibold text-[#183B2A] transition hover:bg-[#F5F9F2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                {confirmText}
                            </>
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}