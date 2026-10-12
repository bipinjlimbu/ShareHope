
"use client";

import Link from "next/link";

export default function LoginError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-slate-900">
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl text-red-600">
                    !
                </div>

                <h1 className="mt-6 text-2xl font-bold tracking-tight">
                    Something went wrong
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    We couldn't load the login page. Please try again.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={reset}
                        className="flex-1 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
                    >
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Go home
                    </Link>
                </div>
            </section>
        </main>
    );
}
