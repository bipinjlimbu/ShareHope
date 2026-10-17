"use client";

import { useEffect } from "react";
import Link from "next/link";

type VerifyEmailErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function VerifyEmailError({
    error,
    reset,
}: VerifyEmailErrorProps) {
    useEffect(() => {
        console.error("Verify email page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-7 text-center shadow-sm sm:p-9">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-10 w-10"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        />
                        <path
                            d="M12 8v4m0 4h.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mt-6 text-sm font-semibold text-red-600">
                    Email verification
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Unable to load verification
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718174]">
                    Something went wrong while loading the email verification
                    page. Please try again.
                </p>

                {error.digest && (
                    <p className="mt-3 text-xs text-[#718174]">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={reset}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                d="M20 7v5h-5M4 17v-5h5m10-1a7 7 0 0 0-12-4L4 9m16 6-3 2a7 7 0 0 1-12-4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Try again
                    </button>

                    <Link
                        href="/profile"
                        className="flex w-full items-center justify-center rounded-xl border border-[#DDE7DC] px-5 py-3.5 text-sm font-semibold text-[#31523C] transition hover:bg-[#EDF5EC]"
                    >
                        Back to profile
                    </Link>
                </div>
            </section>
        </main>
    );
}
