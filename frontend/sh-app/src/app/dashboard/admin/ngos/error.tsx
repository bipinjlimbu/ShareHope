"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

interface NGOErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function NGOError({
    error,
    reset,
}: NGOErrorProps) {
    useEffect(() => {
        console.error("NGO Management page error:", error);
    }, [error]);

    return (
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-12">
            <section className="w-full rounded-3xl border border-[#E1E9DC] bg-[#FFFCF6] p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={32} />
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#E5F2E1] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                    <ShieldCheck size={14} />
                    ShareHope Administration
                </div>

                <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#6A796B] sm:text-base">
                    We couldn&apos;t display the NGO Management page because
                    an unexpected error occurred. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#879487]">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#35543B] transition hover:bg-[#F0F7ED]"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </Link>
                </div>

                <p className="mt-6 text-xs leading-5 text-[#879487]">
                    If this problem continues, try refreshing the page or
                    returning to the admin dashboard.
                </p>
            </section>
        </div>
    );
}