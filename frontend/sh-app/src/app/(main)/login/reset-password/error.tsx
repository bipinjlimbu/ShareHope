"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

type ResetPasswordErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ResetPasswordError({
    error,
    reset,
}: ResetPasswordErrorProps) {
    useEffect(() => {
        console.error("Reset password page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
            <section
                role="alert"
                className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-950/5 sm:p-10"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-slate-900">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    We couldn't load the password reset page.
                    Please try again.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <Home size={16} />
                        Back to login
                    </Link>
                </div>
            </section>
        </main>
    );
}