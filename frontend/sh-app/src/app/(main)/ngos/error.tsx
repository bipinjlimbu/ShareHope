"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface NGOsErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function NGOsError({
    error,
    reset,
}: NGOsErrorProps) {
    useEffect(() => {
        console.error("NGOs page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
            <div
                role="alert"
                className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-10"
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-[#183B2A] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#647568]">
                    An unexpected error occurred while displaying this page.
                    Please try again.
                </p>

                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#35A45C]/30"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        </main>
    );
}