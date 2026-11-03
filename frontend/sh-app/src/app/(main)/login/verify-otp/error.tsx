"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

type VerifyOtpErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function VerifyOtpError({
    error,
    reset,
}: VerifyOtpErrorProps) {
    useEffect(() => {
        console.error("OTP verification page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-4 py-12">
            <section
                role="alert"
                className="w-full max-w-lg rounded-3xl border border-[#E5EDE3] bg-white p-8 text-center shadow-xl shadow-green-950/5 sm:p-10"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-[#183B2A]">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    We couldn't load the OTP verification page.
                    Please try again.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/login/forgot-password"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                        <Home size={16} />
                        Back to password recovery
                    </Link>
                </div>
            </section>
        </main>
    );
}