"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";

type TestimonialsErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function TestimonialsError({
    error,
    reset,
}: TestimonialsErrorProps) {
    useEffect(() => {
        console.error("Testimonials page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-5 py-16">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5EDE3] bg-white p-7 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E9] text-[#C66A43]">
                    <AlertCircle size={29} />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                    Something went wrong
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                    We couldn&apos;t load this page
                </h1>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#778578]">
                    Something unexpected happened while opening the testimonials
                    page. You can try again or return to the homepage.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-[#A0AAA0]">
                        Error reference: {error.digest}
                    </p>
                )}

                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14532D]"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E1E9DE] bg-white px-5 py-3 text-sm font-bold text-[#46634B] transition hover:bg-[#F4F8F1]"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}
