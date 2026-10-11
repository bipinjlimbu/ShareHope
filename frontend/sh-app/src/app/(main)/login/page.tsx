
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/services/authService";
import type { LoginPayload } from "@/types/auth";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginPayload>({ login_credential: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!formData.login_credential.trim() || !formData.password) {
            setError("Please enter your username or email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({
                login_credential: formData.login_credential.trim(),
                password: formData.password,
            });

            localStorage.setItem("user", JSON.stringify(response.user));
            window.dispatchEvent(new Event("auth-change"));
            router.push("/");
        } catch (err) {
            const message = typeof err === "object" && err !== null && "error" in err
                ? String(err.error)
                : typeof err === "object" && err !== null && "detail" in err
                    ? String(err.detail)
                    : "Unable to log in. Please check your credentials and try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-slate-900">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <section className="flex flex-col justify-between bg-green-700 p-8 text-white sm:p-12">
                    <Link href="/" className="text-2xl font-bold tracking-tight">
                        ShareHope<span className="text-green-200">.</span>
                    </Link>

                    <div className="my-12">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                            ♥
                        </div>
                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                            Make kindness go further.
                        </h1>
                        <p className="mt-4 max-w-sm leading-7 text-green-50">
                            Join a community connecting people who want to help with campaigns that make a difference.
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="login_credential" className="mb-2 block text-sm font-medium text-slate-700">
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
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
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
                                    required
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

                        {error && (
                            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

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
                        <Link href="/register" className="font-semibold text-green-700 hover:text-green-800">
                            Create an account
                        </Link>
                    </p>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-400">
                        By signing in, you agree to use ShareHope responsibly and respectfully.
                    </p>
                </section>
            </div>
        </main>
    );
}
