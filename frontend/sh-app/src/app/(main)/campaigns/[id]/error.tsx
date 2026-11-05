"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CampaignDetailsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Campaign details error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-4 py-16">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5EBDD] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-[#183B2A]">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                    We couldn't display this campaign right now. Please try
                    again.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        <RefreshCw size={17} />
                        Try again
                    </button>

                    <Link
                        href="/campaigns"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE8D8] bg-[#EDF6E9] px-6 py-3 font-semibold text-[#166534] transition hover:bg-[#E5F2E1]"
                    >
                        <ArrowLeft size={17} />
                        Campaigns
                    </Link>
                </div>
            </div>
        </main>
    );
}
