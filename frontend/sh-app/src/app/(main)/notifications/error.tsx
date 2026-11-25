"use client";

import { useEffect } from "react";
import {
    AlertTriangle,
    RefreshCw,
} from "lucide-react";

export default function NotificationsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Notifications page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-extrabold text-[#183B2A] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-7 text-[#647568]">
                    We couldn't display your notifications because an
                    unexpected error occurred. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#829184]">
                        Error reference: {error.digest}
                    </p>
                )}

                <button
                    type="button"
                    onClick={reset}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#35A45C]/20"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        </main>
    );
}
