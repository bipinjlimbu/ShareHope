"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface CampaignsErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function CampaignsError({
    error,
    reset,
}: CampaignsErrorProps) {
    useEffect(() => {
        console.error("Campaigns page error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-[#183B2A]">
                    Unable to Load Campaigns
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                    Something went wrong while loading the campaigns page.
                    Please try again. If the problem continues, try again
                    later.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-gray-400">
                        Error reference: {error.digest}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => reset()}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#166534] focus:ring-offset-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}