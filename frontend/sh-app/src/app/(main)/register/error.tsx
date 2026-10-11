"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RegisterError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Registration page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-4 py-12">
            <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl shadow-green-950/5 sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-8 w-8"
                    >
                        <circle cx="12" cy="12" r="9" />
                        <path
                            d="M12 8v5m0 3h.01"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                    ShareHope
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500">
                    We couldn't load the registration page. Please try again.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                    >
                        Back to home
                    </Link>
                </div>
            </section>
        </main>
    );
}
