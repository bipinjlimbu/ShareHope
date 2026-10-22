"use client";

import {
    useState,
    useEffect,
    type ChangeEvent,
    type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import RegisterSkeleton from "@/components/skeleton/RegisterSkeleton";
import { useToast } from "@/components/ToastProvider";
import type { RegisterPayload, RegisterErrors } from "@/types/auth";
import FooterLogo from "@/images/FooterLogo.png";
import { getAuthStatus } from "@/lib/authStatus";

const initialForm: RegisterPayload = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "DONOR",
    phone: "",
    profile_picture: null,
};

export default function RegisterPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [pageReady, setPageReady] = useState(false);
    const [form, setForm] = useState<RegisterPayload>({ ...initialForm });
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

            setPageReady(true);
        };

        checkAuthStatus();

        window.addEventListener("auth-change", checkAuthStatus);

        return () => {
            window.removeEventListener("auth-change", checkAuthStatus);
        };
    }, [router, showToast]);

    const inputClass =
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100";

    const labelClass = "mb-2 block text-sm font-medium text-gray-700";

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));

        setSuccess("");
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;

        setForm((previous) => ({
            ...previous,
            profile_picture: file,
        }));

        setErrors((previous) => ({
            ...previous,
            profile_picture: undefined,
        }));
    };

    const fieldError = (field: string) => {
        const error = errors[field];

        if (!error) return null;

        const message = Array.isArray(error) ? error.join(" ") : error;

        return (
            <p className="mt-1 text-xs text-red-600" role="alert">
                {message}
            </p>
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrors({});
        setSuccess("");
        setLoading(true);

        try {
            const response = await registerUser(form);

            const successMessage =
                response.message || "Your account has been created successfully.";

            setSuccess(successMessage);
            showToast(successMessage, "success");

            setForm({ ...initialForm });

            window.setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (error: unknown) {
            const response =
                error && typeof error === "object"
                    ? (error as Record<string, unknown>)
                    : {};

            const backendErrors: RegisterErrors = {};
            const reservedKeys = [
                "status",
                "detail",
                "message",
                "error",
                "non_field_errors",
            ];

            Object.entries(response).forEach(([key, value]) => {
                if (reservedKeys.includes(key)) return;

                if (typeof value === "string") {
                    backendErrors[key] = value;
                } else if (
                    Array.isArray(value) &&
                    value.every((item) => typeof item === "string")
                ) {
                    backendErrors[key] = value;
                }
            });

            setErrors(backendErrors);

            const nonFieldErrors = response.non_field_errors;
            let globalError = "";

            if (Array.isArray(nonFieldErrors)) {
                globalError = nonFieldErrors.join(" ");
            } else if (typeof nonFieldErrors === "string") {
                globalError = nonFieldErrors;
            } else if (typeof response.detail === "string") {
                globalError = response.detail;
            } else if (typeof response.message === "string") {
                globalError = response.message;
            } else if (typeof response.error === "string") {
                globalError = response.error;
            }

            if (globalError) {
                showToast(globalError, "error");
            } else if (Object.keys(backendErrors).length === 0) {
                showToast(
                    "Unable to create your account. Please try again.",
                    "error"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!pageReady) {
        return <RegisterSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-4 py-10 sm:px-6 lg:py-16">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-950/5 lg:grid-cols-2">
                <section className="relative flex flex-col justify-between overflow-hidden bg-[#14532D] p-8 text-white sm:p-12 lg:p-14">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/10" />
                    <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-lime-300/10" />

                    <div className="relative">
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

                        <div className="mt-16 sm:mt-20">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-green-200">
                                Make a difference
                            </p>
                            <h1 className="max-w-md text-4xl font-bold leading-tight sm:text-5xl">
                                Small acts.
                                <br />
                                Big changes.
                            </h1>
                            <p className="mt-6 max-w-md leading-7 text-green-100">
                                Join a community connecting people who want to
                                help with campaigns making a real difference.
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-16 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                        <p className="text-lg font-semibold">
                            Every contribution matters.
                        </p>
                        <p className="mt-2 text-sm leading-6 text-green-100">
                            Create an account to support campaigns, contribute
                            to your community, and follow your impact.
                        </p>
                    </div>
                </section>

                <section className="p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto max-w-md">
                        <div className="mb-8">
                            <p className="text-sm font-semibold text-green-700">
                                GET STARTED
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                Create your account
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Fill in your details to join ShareHope.
                            </p>
                        </div>

                        {success && (
                            <div
                                role="status"
                                className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                            >
                                {success} Redirecting to login...
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            noValidate
                        >
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className={labelClass}>
                                        First name
                                    </label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="First name"
                                    />
                                    {fieldError("first_name")}
                                </div>

                                <div>
                                    <label htmlFor="last_name" className={labelClass}>
                                        Last name
                                    </label>
                                    <input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Last name"
                                    />
                                    {fieldError("last_name")}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className={labelClass}>
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Choose a username"
                                />
                                {fieldError("username")}
                            </div>

                            <div>
                                <label htmlFor="email" className={labelClass}>
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="you@example.com"
                                />
                                {fieldError("email")}
                            </div>

                            <div>
                                <label htmlFor="phone" className={labelClass}>
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={form.phone ?? ""}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter your phone number"
                                />
                                {fieldError("phone")}
                            </div>

                            <div>
                                <label htmlFor="role" className={labelClass}>
                                    Account type
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="DONOR">Donor</option>
                                    <option value="NGO_ADMIN">NGO Admin</option>
                                </select>
                                {fieldError("role")}
                            </div>

                            <div>
                                <label htmlFor="profile_picture" className={labelClass}>
                                    Profile picture{" "}
                                    <span className="font-normal text-gray-400">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    id="profile_picture"
                                    name="profile_picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-600 file:mr-4 file:border-0 file:bg-green-50 file:px-4 file:py-3 file:font-medium file:text-green-800 hover:file:bg-green-100"
                                />
                                {form.profile_picture && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Selected: {form.profile_picture.name}
                                    </p>
                                )}
                                {fieldError("profile_picture")}
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`${inputClass} pr-20`}
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        className="absolute inset-y-0 right-3 text-xs font-semibold text-green-700"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {fieldError("password")}
                            </div>

                            <div>
                                <label htmlFor="confirm_password" className={labelClass}>
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm_password"
                                        name="confirm_password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={form.confirm_password}
                                        onChange={handleChange}
                                        className={`${inputClass} pr-20`}
                                        placeholder="Enter your password again"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword((previous) => !previous)
                                        }
                                        className="absolute inset-y-0 right-3 text-xs font-semibold text-green-700"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {fieldError("confirm_password")}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </form>

                        <p className="mt-7 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-green-700 hover:text-green-800"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                            By creating an account, you agree to use ShareHope
                            responsibly and provide accurate information.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}