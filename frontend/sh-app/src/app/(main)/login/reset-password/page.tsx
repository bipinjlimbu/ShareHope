"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/services/authService";
import { useToast } from "@/components/ToastProvider";
import type { ResetPasswordPayload } from "@/types/auth";
import ResetPasswordSkeleton from "@/components/skeleton/ResetPasswordSkeleton";

function getErrorMessage(error: unknown): string {
    if (typeof error === "string" && error.trim()) {
        return error;
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    if (typeof error === "object" && error !== null) {
        const responseError = error as {
            error?: unknown;
            detail?: unknown;
            message?: unknown;
            non_field_errors?: unknown;
        };

        if (
            typeof responseError.error === "string" &&
            responseError.error.trim()
        ) {
            return responseError.error;
        }

        if (
            typeof responseError.detail === "string" &&
            responseError.detail.trim()
        ) {
            return responseError.detail;
        }

        if (
            typeof responseError.message === "string" &&
            responseError.message.trim()
        ) {
            return responseError.message;
        }

        if (Array.isArray(responseError.non_field_errors)) {
            const firstError = responseError.non_field_errors.find(
                (item): item is string =>
                    typeof item === "string" && item.trim().length > 0
            );

            if (firstError) {
                return firstError;
            }
        }

        if (typeof responseError.non_field_errors === "string") {
            return responseError.non_field_errors;
        }
    }

    return "We couldn't reset your password. Please try again.";
}

function getFieldErrors(error: unknown): Record<string, string> {
    if (typeof error !== "object" || error === null) {
        return {};
    }

    const responseError = error as Record<string, unknown>;
    const fieldErrors: Record<string, string> = {};

    const fields = ["new_password", "confirm_password"] as const;

    for (const field of fields) {
        const value = responseError[field];

        if (typeof value === "string" && value.trim()) {
            fieldErrors[field] = value;
        } else if (Array.isArray(value)) {
            const messages = value.filter(
                (item): item is string =>
                    typeof item === "string" && item.trim().length > 0
            );

            if (messages.length > 0) {
                fieldErrors[field] = messages.join(" ");
            }
        }
    }

    return fieldErrors;
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const passwordPattern =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    function validateForm(): boolean {
        const validationErrors: Record<string, string> = {};

        if (!newPassword) {
            validationErrors.new_password = "New password is required.";
        } else if (!passwordPattern.test(newPassword)) {
            validationErrors.new_password =
                "Use at least 8 characters, including a letter, a number, and a special character (@$!%*#?&).";
        }

        if (!confirmPassword) {
            validationErrors.confirm_password =
                "Please confirm your new password.";
        } else if (newPassword !== confirmPassword) {
            validationErrors.confirm_password = "Passwords do not match.";
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isSubmitting || !validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const payload: ResetPasswordPayload = {
            new_password: newPassword,
            confirm_password: confirmPassword,
        };

        try {
            const response = await resetPassword(payload);

            setNewPassword("");
            setConfirmPassword("");

            showToast(
                response?.message || "Your password has been reset successfully.",
                "success"
            );

            router.push("/login");
        } catch (error: unknown) {
            const fieldErrors = getFieldErrors(error);

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);

                const hasGlobalError =
                    typeof error === "object" &&
                    error !== null &&
                    ("error" in error ||
                        "detail" in error ||
                        "message" in error ||
                        "non_field_errors" in error);

                if (hasGlobalError) {
                    showToast(getErrorMessage(error), "error");
                }
            } else {
                showToast(getErrorMessage(error), "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitting) {
        return <ResetPasswordSkeleton />;
    }

    return (
        <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-100/70 blur-3xl"
            />

            <div className="relative z-10 flex w-full justify-center">
                <section className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8">
                    <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-7 w-7"
                        >
                            <rect
                                x="4"
                                y="10"
                                width="16"
                                height="11"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                            <path
                                d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Set a new password
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Choose a strong password for your ShareHope account.
                        Make sure you remember it.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="new_password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                New password
                            </label>

                            <div className="relative">
                                <input
                                    id="new_password"
                                    name="new_password"
                                    type={showNewPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={newPassword}
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        setNewPassword(event.target.value);
                                        setErrors((previous) => ({
                                            ...previous,
                                            new_password: "",
                                        }));
                                    }}
                                    placeholder="Enter your new password"
                                    aria-invalid={Boolean(errors.new_password)}
                                    aria-describedby={
                                        errors.new_password
                                            ? "new-password-error"
                                            : "password-requirements"
                                    }
                                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.new_password
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword((previous) => !previous)
                                    }
                                    disabled={isSubmitting}
                                    className="absolute inset-y-0 right-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                    aria-label={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                >
                                    {showNewPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {errors.new_password && (
                                <p
                                    id="new-password-error"
                                    role="alert"
                                    className="mt-2 text-xs leading-5 text-red-600"
                                >
                                    {errors.new_password}
                                </p>
                            )}

                            <p
                                id="password-requirements"
                                className="mt-2 text-xs leading-5 text-slate-500"
                            >
                                At least 8 characters, with a letter, number,
                                and special character.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm_password"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Confirm new password
                            </label>

                            <div className="relative">
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        setErrors((previous) => ({
                                            ...previous,
                                            confirm_password: "",
                                        }));
                                    }}
                                    placeholder="Re-enter your new password"
                                    aria-invalid={Boolean(
                                        errors.confirm_password
                                    )}
                                    aria-describedby={
                                        errors.confirm_password
                                            ? "confirm-password-error"
                                            : undefined
                                    }
                                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.confirm_password
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    disabled={isSubmitting}
                                    className="absolute inset-y-0 right-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirmation password"
                                            : "Show confirmation password"
                                    }
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {errors.confirm_password && (
                                <p
                                    id="confirm-password-error"
                                    role="alert"
                                    className="mt-2 text-xs leading-5 text-red-600"
                                >
                                    {errors.confirm_password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Reset password
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                        >
                            Back to login
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}