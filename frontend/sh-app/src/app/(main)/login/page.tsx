"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginUser } from "@/services/authService";
import type { LoginPayload } from "@/types/auth";
import LoginSkeleton from "@/components/skeleton/auth/LoginSkeleton";
import { useToast } from "@/components/toast/ToastProvider";
import FooterLogo from "@/images/FooterLogo.png";
import { getAuthStatus } from "@/lib/authStatus";

export default function LoginPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [isPageLoading, setIsPageLoading] = useState(true);
    const [formData, setFormData] = useState<LoginPayload>({
        login_credential: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            if (getAuthStatus()) {
                showToast(
                    "You are already logged in, so you are not allowed to access this page.",
                    "error"
                );

                router.replace("/");
                return;
            }

            setIsPageLoading(false);
        };

        checkAuthStatus();

        window.addEventListener("auth-change", checkAuthStatus);

        return () => {
            window.removeEventListener("auth-change", checkAuthStatus);
        };
    }, [router, showToast]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.login_credential.trim() || !formData.password) {
            showToast(
                "Please enter your username or email and password.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            await loginUser({
                login_credential: formData.login_credential.trim(),
                password: formData.password,
            });

            window.dispatchEvent(new Event("auth-change"));

            showToast("You have signed in successfully.", "success");
            router.push("/");
        } catch (err: unknown) {
            const message =
                typeof err === "object" && err !== null && "error" in err
                    ? String(err.error)
                    : typeof err === "object" && err !== null && "detail" in err
                        ? String(err.detail)
                        : "Unable to log in. Please check your credentials and try again.";

            showToast(message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (isPageLoading) {
        return <LoginSkeleton />;
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
                            Make kindness go further.
                        </h1>

                        <p className="mt-4 max-w-sm leading-7 text-green-50">
                            Join a community connecting people who want
                            to help with campaigns that make a difference.
                        </p>
                    </div>

                    <p className="text-sm text-green-100">
                        Every contribution can create a little more hope.
                    </p>
                </section>

                <section className="p-6 sm:p-10 md:p-12">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                            Welcome back
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Sign in to ShareHope
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Enter your account details to continue.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        noValidate
                    >
                        <div>
                            <label
                                htmlFor="login_credential"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Username or email
                            </label>

                            <input
                                id="login_credential"
                                name="login_credential"
                                type="text"
                                autoComplete="username"
                                value={formData.login_credential}
                                onChange={handleChange}
                                placeholder="Enter your username or email"
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>

                                <Link
                                    href="/login/forgot-password"
                                    className="text-sm font-semibold text-green-700 transition hover:text-green-800"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 text-sm font-medium text-green-700 hover:text-green-800"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-green-700 hover:text-green-800"
                        >
                            Create an account
                        </Link>
                    </p>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                        By signing in, you agree to use ShareHope
                        responsibly and respectfully.
                    </p>
                </section>
            </div>
        </main>
    );
}