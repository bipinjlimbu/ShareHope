"use client";

import {
    useRef,
    useState,
    useEffect,
    type ClipboardEvent,
    type ChangeEvent,
    type KeyboardEvent,
    type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerifyEmailSkeleton from "@/components/skeleton/VerifyEmailSkeleton";
import {
    requestEmailVerification,
    verifyEmail,
} from "@/services/profileService";

export default function VerifyEmailPage() {
    const router = useRouter();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function handleChange(
        index: number,
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const value = event.target.value.replace(/\D/g, "");
        const nextDigits = [...digits];

        if (value.length > 1) {
            const pastedDigits = value.slice(0, 6).split("");
            const nextValues = ["", "", "", "", "", ""];

            pastedDigits.forEach((digit, pastedIndex) => {
                nextValues[pastedIndex] = digit;
            });

            setDigits(nextValues);
            setFieldError("");
            setErrorMessage("");
            inputRefs.current[Math.min(pastedDigits.length, 5)]?.focus();
            return;
        }

        nextDigits[index] = value;
        setDigits(nextDigits);
        setFieldError("");
        setErrorMessage("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(
        index: number,
        event: KeyboardEvent<HTMLInputElement>,
    ) {
        if (
            event.key === "Backspace" &&
            !digits[index] &&
            index > 0
        ) {
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
        setFieldError("");
        setErrorMessage("");
        inputRefs.current[Math.min(pastedDigits.length, 5)]?.focus();
    }

    function getErrorMessage(error: unknown): string {
        if (typeof error === "string") {
            return error;
        }

        if (typeof error === "object" && error !== null) {
            const response = error as Record<string, unknown>;

            if (typeof response.message === "string") {
                return response.message;
            }

            if (typeof response.detail === "string") {
                return response.detail;
            }

            if (typeof response.otp === "string") {
                setFieldError(response.otp);
                return "";
            }

            if (Array.isArray(response.otp)) {
                setFieldError(response.otp.join(" "));
                return "";
            }

            if (typeof response.error === "string") {
                return response.error;
            }
        }

        return "Something went wrong. Please try again.";
    }

    async function handleVerify(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const otp = digits.join("");

        setErrorMessage("");
        setFieldError("");
        setSuccessMessage("");

        if (otp.length !== 6) {
            setFieldError("Please enter the complete six-digit OTP.");
            inputRefs.current[digits.findIndex((digit) => !digit)]?.focus();
            return;
        }

        setIsLoading(true);

        try {
            const response = await verifyEmail(otp);

            setSuccessMessage(
                response.message || "Your email has been verified successfully.",
            );

            window.setTimeout(() => {
                router.push("/profile");
                router.refresh();
            }, 1000);
        } catch (error) {
            const message = getErrorMessage(error);

            if (message) {
                setErrorMessage(message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResend() {
        setErrorMessage("");
        setFieldError("");
        setSuccessMessage("");
        setIsResending(true);

        try {
            const response = await requestEmailVerification();
            setSuccessMessage(
                response.message || "A new verification code has been sent.",
            );
            setDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            const message = getErrorMessage(error);

            if (message) {
                setErrorMessage(message);
            }
        } finally {
            setIsResending(false);
        }
    }

    if (isLoading && !successMessage) {
        return <VerifyEmailSkeleton />;
    }

    const isOtpComplete = digits.every((digit) => digit !== "");

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-9">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F1E4] text-[#166534]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8"
                        aria-hidden="true"
                    >
                        <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2.5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        />
                        <path
                            d="m4 7 8 6 8-6"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="m16 16 2 2 3-4"
                            stroke="#35A45C"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
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

                <form onSubmit={handleVerify} className="mt-8">
                    <label
                        htmlFor="otp-0"
                        className="mb-3 block text-center text-sm font-semibold text-[#31523C]"
                    >
                        Verification code
                    </label>

                    <div className="flex justify-center gap-2 sm:gap-3">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                id={index === 0 ? "otp-0" : undefined}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete={index === 0 ? "one-time-code" : "off"}
                                pattern="[0-9]*"
                                maxLength={6}
                                aria-label={`Verification digit ${index + 1}`}
                                aria-invalid={Boolean(fieldError)}
                                value={digit}
                                disabled={isLoading}
                                onChange={(event) => handleChange(index, event)}
                                onKeyDown={(event) => handleKeyDown(index, event)}
                                onPaste={handlePaste}
                                className={`h-12 min-w-0 flex-1 rounded-xl border bg-[#FFFCF6] text-center text-xl font-bold text-[#14532D] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10 sm:h-14 sm:max-w-12 ${fieldError
                                    ? "border-red-400"
                                    : "border-[#DDE7DC]"
                                    }`}
                            />
                        ))}
                    </div>

                    {fieldError && (
                        <p
                            role="alert"
                            className="mt-3 text-center text-sm text-red-600"
                        >
                            {fieldError}
                        </p>
                    )}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            role="status"
                            className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                        >
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!isOtpComplete || isLoading}
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading && (
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
                        {isLoading ? "Verifying..." : "Verify email"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm leading-6 text-[#718174]">
                    Didn&apos;t receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || isLoading}
                        className="font-semibold text-[#166534] transition hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isResending ? "Sending..." : "Resend OTP"}
                    </button>
                </p>

                <div className="mt-8 border-t border-[#E6EDE4] pt-5 text-center">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#31523C] transition hover:text-[#166534]"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path
                                d="m15 18-6-6 6-6"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Back to profile
                    </Link>
                </div>
            </section>
        </main>
    );
}