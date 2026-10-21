"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

interface NGORegistrationErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function NGORegistrationError({
    error,
    reset,
}: NGORegistrationErrorProps) {
    useEffect(() => {
        console.error("NGO registration page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-4 py-12">
            <section className="w-full max-w-lg rounded-3xl border border-green-950/10 bg-white p-8 text-center shadow-xl shadow-green-950/5 sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle size={32} />
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-green-800">
                    ShareHope · NGO Registration
                </p>

                <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-600">
                    We couldn't display the NGO registration page. Please try again. If
                    the problem continues, return to registration and try later.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-slate-500">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
                    >
                        <RefreshCw size={17} />
                        Try again
                    </button>

                    <Link
                        href="/register"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={17} />
                        Back to registration
                    </Link>
                </div>
            </section>
        </main>
    );
}