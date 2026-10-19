"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPasswordResetOtp } from "@/services/authService";
import { useToast } from "@/components/ToastProvider";
import ForgotPasswordSuccess from "@/components/auth/ForgotPasswordSuccess";
import ForgotPasswordFailed from "@/components/auth/ForgotPasswordFailed";
import ForgotPasswordSkeleton from "@/components/skeleton/ForgotPasswordSkeleton";
import type { PageStatus } from "@/types/auth";
import FooterLogo from "@/images/FooterLogo.png";
import Image from "next/image";

function getErrorMessage(error: unknown): string {
    if (typeof error === "string" && error.trim()) {
        return error;
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    if (typeof error === "object" && error !== null) {
        if ("error" in error && typeof error.error === "string") {
            return error.error;
        }

        if ("detail" in error && typeof error.detail === "string") {
            return error.detail;
        }

        if ("message" in error && typeof error.message === "string") {
            return error.message;
        }
    }

    return "We couldn't send the password-reset OTP. Please try again.";
}

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<PageStatus>("form");
    const [failureMessage, setFailureMessage] = useState("");

    useEffect(() => {
        setIsPageLoading(false);
    }, []);

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);

        if (status === "failed") {
            setStatus("form");
            setFailureMessage("");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            showToast("Please enter your email address.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            showToast("Please enter a valid email address.", "error");
            return;
        }

        setLoading(true);
        setFailureMessage("");

        try {
            await requestPasswordResetOtp({
                email: normalizedEmail,
            });

            setEmail(normalizedEmail);
            setStatus("success");
        } catch (error: unknown) {
            setFailureMessage(getErrorMessage(error));
            setStatus("failed");
        } finally {
            setLoading(false);
        }
    };

    if (isPageLoading) {
        return <ForgotPasswordSkeleton />;
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
                            A fresh start begins here.
                        </h1>

                        <p className="mt-4 max-w-sm leading-7 text-green-50">
                            Forgot your password? We'll help you get back
                            to your ShareHope account.
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
                                    Forgot password?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Enter the email address associated with
                                    your account. We'll send you a one-time
                                    password-reset code.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                                noValidate
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        placeholder="Enter your registered email"
                                        disabled={loading}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Sending OTP..." : "Send reset OTP"}
                                </button>
                            </form>
                        </>
                    )}

                    {status === "success" && (
                        <ForgotPasswordSuccess
                            email={email}
                            onContinue={() =>
                                router.push(`/login/verify-otp?email=${encodeURIComponent(email)}`)
                            }
                        />
                    )}

                    {status === "failed" && (
                        <ForgotPasswordFailed
                            message={failureMessage}
                            onRetry={() => {
                                setFailureMessage("");
                                setStatus("form");
                            }}
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