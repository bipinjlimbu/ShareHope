"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProfileError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Profile page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm sm:p-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#14532D]">
                    Unable to Load Profile
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                    Something went wrong while loading your profile. Please try again.
                    If the problem continues, return to your dashboard and try later.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-gray-400">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E6EDE4] bg-white px-5 py-3 text-sm font-semibold text-[#14532D] transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    Your account information has not been intentionally changed by this
                    error screen.
                </p>
            </div>
        </main>
    );
}