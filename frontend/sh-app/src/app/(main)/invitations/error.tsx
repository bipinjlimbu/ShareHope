"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface InvitationsErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function InvitationsError({
    error,
    reset,
}: InvitationsErrorProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <div className="w-full max-w-lg rounded-3xl border border-[#E3EDE0] bg-white px-6 py-12 text-center shadow-sm sm:px-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <AlertCircle size={30} />
                </div>

                <h1 className="mt-6 text-xl font-bold text-[#183B2A] sm:text-2xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#647568]">
                    We encountered an unexpected problem while displaying
                    your invitations. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-[#829184]">
                        Error reference: {error.digest}
                    </p>
                )}

                <button
                    type="button"
                    onClick={reset}
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                >
                    <RefreshCw size={16} />
                    Try again
                </button>
            </div>
        </main>
    );
}