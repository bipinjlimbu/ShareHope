"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ProfileErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ProfileError({
    error,
    reset,
}: ProfileErrorProps) {
    useEffect(() => {
        console.error("Profile page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
            <div className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 9v4m0 4h.01M10.3 3.9 1.9 18.5A2 2 0 0 0 3.6 21h16.8a2 2 0 0 0 1.7-2.5L13.7 3.9a2 2 0 0 0-3.4 0Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718174]">
                    We couldn't display your profile right now. Please try again.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="rounded-xl border border-[#D7E9D5] bg-[#F0F7ED] px-6 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#E4F1E4]"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}