"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function PendingCampaignsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Pending Campaigns page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] w-full items-center justify-center bg-[#FFFCF6] px-4 py-12">
            <div className="w-full max-w-lg rounded-2xl border border-[#E5EDE3] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#183B2A]">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#647568]">
                    We couldn't load the Pending Campaigns page due to an
                    unexpected error. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#829184]">
                        Error reference: {error.digest}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        </main>
    );
}