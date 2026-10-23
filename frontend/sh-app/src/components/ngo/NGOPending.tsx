"use client";

import type { NGOPendingProps } from "@/types/ngo";

export default function NGOPending({
    onBackToProfile,
}: NGOPendingProps) {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-xl rounded-3xl border border-[#E6EDE4] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF5E8] text-[#A17B22]">
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
                            d="M12 7v5l3 2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <span className="mt-5 inline-flex items-center rounded-full border border-[#E8DFC7] bg-[#FAF5E8] px-3 py-1.5 text-xs font-bold text-[#8A7138]">
                    Pending review
                </span>

                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Your NGO registration is under review
                </h1>

                <p className="mt-4 text-sm leading-7 text-[#718174] sm:text-base">
                    Thank you for registering your organization with
                    ShareHope. Our team is reviewing your NGO details and
                    submitted documents. You will be able to access your
                    NGO dashboard after your registration is approved.
                </p>

                <button
                    type="button"
                    onClick={onBackToProfile}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] sm:w-auto"
                >
                    Back to Profile
                </button>
            </section>
        </main>
    );
}