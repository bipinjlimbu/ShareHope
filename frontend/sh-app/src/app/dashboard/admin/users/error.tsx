"use client";

import { useEffect } from "react";
import Link from "next/link";

interface AdminUsersErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function AdminUsersError({
    error,
    reset,
}: AdminUsersErrorProps) {
    useEffect(() => {
        console.error("Admin users page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-lg rounded-3xl border border-[#E6EDE4] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8"
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
                            d="M12 7v5m0 4h.01"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mt-5 text-sm font-semibold text-[#35A45C]">
                    Admin dashboard
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Unable to load users
                </h1>

                <p className="mt-4 text-sm leading-7 text-[#718174] sm:text-base">
                    Something went wrong while displaying user management.
                    Please try again. If the problem continues, return to the
                    admin dashboard and try again later.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center justify-center rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        Try Again
                    </button>

                    <Link
                        href="/dashboard/admin"
                        className="inline-flex items-center justify-center rounded-xl border border-[#DDE7DC] px-5 py-3.5 text-sm font-semibold text-[#31523C] transition hover:bg-[#EDF5EC] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </section>
        </main>
    );
}
