"use client";

import Link from "next/link";

type EmailVerificationFailedProps = {
    message?: string;
    isResending: boolean;
    onResend: () => void;
};

export default function EmailVerificationFailed({
    message = "The verification code could not be confirmed.",
    isResending,
    onResend,
}: EmailVerificationFailedProps) {
    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-6 text-center shadow-sm sm:p-9">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-11 w-11"
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
                            d="m9 9 6 6m0-6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <p className="mt-6 text-sm font-semibold text-red-600">
                    Email verification
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Verification failed
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718174]">
                    {message}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#718174]">
                    You can request a new six-digit code and try again.
                </p>

                <button
                    type="button"
                    onClick={onResend}
                    disabled={isResending}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isResending && (
                        <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="opacity-25"
                            />
                            <path
                                d="M21 12a9 9 0 0 0-9-9"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                    {isResending ? "Sending new code..." : "Resend OTP"}
                </button>

                <div className="mt-6 border-t border-[#E6EDE4] pt-5">
                    <Link
                        href="/profile"
                        className="text-sm font-semibold text-[#31523C] transition hover:text-[#166534]"
                    >
                        Back to profile
                    </Link>
                </div>
            </section>
        </main>
    );
}