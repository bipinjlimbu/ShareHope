"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function StaffManagementError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("NGO Staff Management page error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl border border-[#E8EDE5] bg-white p-7 text-center shadow-sm sm:p-9">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#183B2A] sm:text-2xl">
                    Unable to Load Staff Management
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#71816F]">
                    Something unexpected happened while opening the staff
                    management page. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#A0ACA0]">
                        Error reference: {error.digest}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#29904C] focus:ring-offset-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
