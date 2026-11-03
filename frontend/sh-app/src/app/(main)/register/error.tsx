"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

type RegisterErrorProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

export default function RegisterError({
    error,
    reset,
}: RegisterErrorProps) {
    useEffect(() => {
        console.error("Registration page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-5 py-12">
            <div
                role="alert"
                className="w-full max-w-lg rounded-3xl border border-[#E5EDE3] bg-white p-8 text-center shadow-xl shadow-green-950/5 sm:p-10"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={32} />
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-[#183B2A] sm:text-3xl">
                    Something Went Wrong
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#647568]">
                    We encountered an unexpected problem while opening
                    the registration page. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#829184]">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-green-200"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED]"
                    >
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}