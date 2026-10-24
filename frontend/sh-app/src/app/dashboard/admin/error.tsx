"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    House,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

export default function AdminDashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin dashboard error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <div className="w-full max-w-lg rounded-3xl border border-[#E1E9DC] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={32} strokeWidth={1.7} />
                </div>

                <p className="mt-6 text-sm font-semibold text-[#27824B]">
                    ShareHope Administration
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#6A796B]">
                    We couldn&apos;t load the admin dashboard. Please try again.
                    If the problem continues, return to the dashboard later.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-[#879487]">
                        Reference: {error.digest}
                    </p>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        <RefreshCw size={17} />
                        Try again
                    </button>

                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#183B2A] transition hover:bg-[#F1F6ED] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        <House size={17} />
                        Dashboard home
                    </Link>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#E6EDE4] pt-5 text-xs text-[#879487]">
                    <ShieldCheck size={15} className="text-[#27824B]" />
                    ShareHope · Administration
                </div>

                <Link
                    href="/"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#166534] transition hover:text-[#14532D]"
                >
                    <ArrowLeft size={15} />
                    Back to homepage
                </Link>
            </div>
        </main>
    );
}