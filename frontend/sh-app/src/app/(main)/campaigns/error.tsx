"use client";

import { useEffect } from "react";
import {
    AlertCircle,
    RefreshCw,
    ArrowLeft,
    HeartHandshake,
} from "lucide-react";
import Link from "next/link";

export default function CampaignsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Campaigns page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5EDE3] bg-white px-6 py-10 text-center shadow-sm sm:px-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#FCEBE8] text-[#C64B3F]">
                    <AlertCircle size={38} strokeWidth={1.7} />
                </div>

                <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-xs font-semibold text-[#166534]">
                    <HeartHandshake size={14} />
                    ShareHope Campaigns
                </span>

                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#183B2A] sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#647568]">
                    We couldn't display the campaigns right now. Please try
                    again. If the problem continues, come back later.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-6 py-3 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
