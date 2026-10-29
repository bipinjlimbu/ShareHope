"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

export default function NGOOverviewError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("NGO overview error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] w-full items-center justify-center bg-[#FFFCF6] px-4 py-12 sm:px-6">
            <div className="w-full max-w-xl rounded-2xl border border-[#E5EDE3] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FBF0E8] text-[#A65328]">
                    <AlertTriangle size={30} strokeWidth={1.8} />
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F5F9F2] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                    <ShieldCheck size={14} />
                    ShareHope NGO Dashboard
                </div>

                <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                    Unable to load your overview
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#647568] sm:text-base">
                    Something went wrong while displaying your NGO dashboard.
                    Please try again. If the problem continues, return to the
                    overview later.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-[#829184]">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <RefreshCw size={17} />
                        Try again
                    </button>

                    <Link
                        href="/dashboard/ngo-admin"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8E8D4] bg-white px-5 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#F5F9F2] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <ArrowLeft size={17} />
                        Back to overview
                    </Link>
                </div>

                <div className="mt-8 border-t border-[#EDF2E9] pt-5">
                    <p className="text-xs leading-5 text-[#829184]">
                        Your dashboard data has not been intentionally changed
                        by this error screen.
                    </p>
                </div>
            </div>
        </main>
    );
}