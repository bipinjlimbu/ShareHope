"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function NGOsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("NGOs page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5EDE3] bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCEEE7] text-[#C65D35]">
                    <AlertTriangle size={30} strokeWidth={1.8} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                    ShareHope Organizations
                </p>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#183B2A] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#647568]">
                    We couldn&apos;t display the organizations right now.
                    Please try again. If the problem continues, come back
                    in a little while.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-6 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#F0F7ED] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <Home size={16} />
                        Back to home
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-[#91A092]">
                        Error reference: {error.digest}
                    </p>
                )}

                <p className="mt-6 text-xs text-[#91A092]">
                    Together, we make a difference.
                </p>
            </div>
        </main>
    );
}