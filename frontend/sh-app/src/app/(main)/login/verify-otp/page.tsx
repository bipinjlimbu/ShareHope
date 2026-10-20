"use client";

import {
    Suspense,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ChangeEvent,
    type KeyboardEvent,
    type ClipboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyPasswordResetOtp } from "@/services/authService";
import VerifyOtpSuccess from "@/components/auth/VerifyOtpSuccess";
import VerifyOtpFailed from "@/components/auth/VerifyOtpFailed";
import VerifyOtpSkeleton from "@/components/skeleton/VerifyOtpSkeleton";
import type { PageStatus } from "@/types/auth";
import FooterLogo from "@/images/FooterLogo.png";
import Image from "next/image";

const OTP_LENGTH = 6;

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [status, setStatus] = useState<PageStatus>("form");
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!email.trim()) {
            router.replace("/login/forgot-password");
            return;
        }

        setIsPageLoading(false);
    }, [email, router]);

    const handleOtpChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value.replace(/\D/g, "");
        const nextOtp = [...otp];

        if (!value) {
            nextOtp[index] = "";
            setOtp(nextOtp);
            return;
        }

        const digits = value.split("");

        digits.slice(0, OTP_LENGTH - index).forEach((digit, offset) => {
            nextOtp[index + offset] = digit;
        });

        setOtp(nextOtp);

        const nextIndex = Math.min(
            index + digits.length,
            OTP_LENGTH - 1
        );

        inputRefs.current[nextIndex]?.focus();
    };

    const handleOtpKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Backspace") {
            event.preventDefault();

            const nextOtp = [...otp];

            if (nextOtp[index]) {
                nextOtp[index] = "";
                setOtp(nextOtp);
            } else if (index > 0) {
                nextOtp[index - 1] = "";
                setOtp(nextOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }

        if (event.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();

        const digits = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);

        if (!digits) {
            return;
        }

        setOtp(digits.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH));

        inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (submitting) {
            return;
        }

        const cleanOtp = otp.join("");

        if (!/^\d{6}$/.test(cleanOtp)) {
            setErrorMessage("Enter the six-digit OTP sent to your email.");
            setStatus("failed");
            return;
        }

        setSubmitting(true);
        setErrorMessage("");

        try {
            await verifyPasswordResetOtp({
                email,
                otp: cleanOtp,
            });

            setStatus("success");
        } catch (error: unknown) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "OTP verification failed. Please try again."
            );
            setStatus("failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setOtp(Array(OTP_LENGTH).fill(""));
        setErrorMessage("");
        setStatus("form");
        inputRefs.current[0]?.focus();
    };

    const handleContinue = () => {
        router.push(
            `/login/reset-password?email=${encodeURIComponent(email)}`
        );
    };

    if (isPageLoading || !email.trim()) {
        return <VerifyOtpSkeleton />;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-slate-900">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <section className="flex flex-col justify-between bg-green-700 p-8 text-white sm:p-12">
                    <Link
                        href="/"
                        aria-label="ShareHope home"
                        className="inline-flex w-fit items-center"
                    >
                        <Image
                            src={FooterLogo}
                            alt="ShareHope"
                            priority
                            className="h-auto w-[150px] object-contain sm:w-[170px]"
                        />
                    </Link>

                    <div className="my-12">
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                            One last step.
                        </h1>

                        <p className="mt-4 max-w-sm leading-7 text-green-50">
                            Verify your email with the one-time code we sent
                            you to continue recovering your ShareHope account.
                        </p>
                    </div>

                    <p className="text-sm text-green-100">
                        Your journey of making a difference can continue.
                    </p>
                </section>

                <section className="p-6 sm:p-10 md:p-12">
                    {status === "form" && (
                        <>
                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                                    Account recovery
                                </p>

                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Verify your OTP
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Enter the six-digit verification code sent
                                    to your email address.
                                </p>

                                <p className="mt-3 break-all text-sm font-semibold text-green-800">
                                    {email}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                                noValidate
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Verification code
                                    </label>

                                    <div className="flex items-center justify-between gap-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(element) => {
                                                    inputRefs.current[index] = element;
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete={
                                                    index === 0
                                                        ? "one-time-code"
                                                        : "off"
                                                }
                                                maxLength={6}
                                                value={digit}
                                                disabled={submitting}
                                                aria-label={`OTP digit ${index + 1}`}
                                                onChange={(event) =>
                                                    handleOtpChange(index, event)
                                                }
                                                onKeyDown={(event) =>
                                                    handleOtpKeyDown(index, event)
                                                }
                                                onPaste={handleOtpPaste}
                                                onFocus={(event) =>
                                                    event.currentTarget.select()
                                                }
                                                className="h-12 min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-1 text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50 sm:h-14"
                                            />
                                        ))}
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Your OTP expires after 10 minutes.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    disabled
                                    title="Resend OTP will be implemented later"
                                    className="cursor-not-allowed font-semibold text-green-700 opacity-60"
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div className="mt-5 text-center">
                                <Link
                                    href="/login/forgot-password"
                                    className="text-sm font-medium text-slate-500 transition hover:text-green-700"
                                >
                                    Back to forgot password
                                </Link>
                            </div>
                        </>
                    )}

                    {status === "failed" && (
                        <VerifyOtpFailed
                            message={errorMessage}
                            onRetry={handleRetry}
                        />
                    )}

                    {status === "success" && (
                        <VerifyOtpSuccess
                            email={email}
                            onContinue={handleContinue}
                        />
                    )}

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-green-700 hover:text-green-800"
                        >
                            Back to sign in
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<VerifyOtpSkeleton />}>
            <VerifyOtpContent />
        </Suspense>
    );
}