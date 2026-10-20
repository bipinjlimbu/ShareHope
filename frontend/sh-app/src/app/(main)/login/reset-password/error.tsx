"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ResetPasswordErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ResetPasswordError({
    error,
    reset,
}: ResetPasswordErrorProps) {
    useEffect(() => {
        console.error("Reset password page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/5 sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        />
                        <path
                            d="M12 7.5v5m0 3.5h.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">
                    ShareHope account recovery
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Unable to load this page
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                    Something went wrong while loading the password reset
                    page. Please try again or restart the recovery process.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    >
                        Try again
                    </button>

                    <Link
                        href="/login/forgot-password"
                        className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                    >
                        Restart recovery
                    </Link>
                </div>

                <div className="mt-5">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-500 transition hover:text-emerald-700"
                    >
                        Back to login
                    </Link>
                </div>
            </section>
        </main>
    );
}