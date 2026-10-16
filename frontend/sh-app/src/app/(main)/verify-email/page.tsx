"use client";

import { useRef, useState, type ClipboardEvent, type ChangeEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import VerifyEmailSkeleton from "@/components/skeleton/VerifyEmailSkeleton";

export default function VerifyEmailPage() {
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [isLoading] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/\D/g, "");
        const nextDigits = [...digits];

        if (value.length > 1) {
            const pastedDigits = value.slice(0, 6).split("");

            pastedDigits.forEach((digit, pastedIndex) => {
                nextDigits[pastedIndex] = digit;
            });

            setDigits(nextDigits);

            const nextIndex = Math.min(pastedDigits.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        nextDigits[index] = value;
        setDigits(nextDigits);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();

        const pastedDigits = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6)
            .split("");

        if (pastedDigits.length === 0) return;

        const nextDigits = ["", "", "", "", "", ""];

        pastedDigits.forEach((digit, index) => {
            nextDigits[index] = digit;
        });

        setDigits(nextDigits);
        inputRefs.current[Math.min(pastedDigits.length, 5)]?.focus();
    }

    if (isLoading) {
        return <VerifyEmailSkeleton />;
    }

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-9">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F1E4] text-[#166534]">
                    <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="m16 16 2 2 3-4" stroke="#35A45C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm font-semibold text-[#35A45C]">
                        Email verification
                    </p>

                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                        Verify your email
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#718174]">
                        Enter the six-digit verification code sent to your email address.
                        The code expires after a limited time.
                    </p>
                </div>

                <div className="mt-8">
                    <label className="mb-3 block text-center text-sm font-semibold text-[#31523C]">
                        Verification code
                    </label>

                    <div className="flex justify-center gap-2 sm:gap-3">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                pattern="[0-9]*"
                                maxLength={6}
                                aria-label={`Verification digit ${index + 1}`}
                                value={digit}
                                onChange={(event) => handleChange(index, event)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                onPaste={handlePaste}
                                className="h-12 min-w-0 flex-1 rounded-xl border border-[#DDE7DC] bg-[#FFFCF6] text-center text-xl font-bold text-[#14532D] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10 sm:h-14 sm:max-w-12"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    disabled
                    className="mt-7 flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white opacity-70"
                >
                    Verify email
                </button>

                <p className="mt-5 text-center text-sm leading-6 text-[#718174]">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        disabled
                        className="cursor-not-allowed font-semibold text-[#166534] opacity-60"
                    >
                        Resend OTP
                    </button>
                </p>

                <div className="mt-8 border-t border-[#E6EDE4] pt-5 text-center">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#31523C] transition hover:text-[#166534]"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to profile
                    </Link>
                </div>
            </section>
        </main>
    );
}