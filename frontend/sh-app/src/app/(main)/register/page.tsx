
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import type { RegisterPayload, RegisterErrors } from "@/types/auth";

const initialForm: RegisterPayload = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    profile_picture: null,
};

const inputClass =
    "w-full rounded-xl border border-[#DCE7D8] bg-white px-4 py-3 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA89B] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10";

const labelClass = "mb-2 block text-sm font-semibold text-[#284B35]";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState<RegisterPayload>(initialForm);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value, files } = event.target;

        if (name === "profile_picture") {
            setForm((previous) => ({
                ...previous,
                profile_picture: files?.[0] ?? null,
            }));
        } else {
            setForm((previous) => ({
                ...previous,
                [name]: value,
            }));
        }

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
        setGeneralError("");
        setSuccess("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setGeneralError("");
        setSuccess("");

        if (form.password !== form.confirm_password) {
            setErrors({ confirm_password: "Passwords do not match." });
            return;
        }

        if (
            form.profile_picture &&
            !form.profile_picture.type.startsWith("image/")
        ) {
            setErrors({
                profile_picture: "Please select a valid image file.",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser(form);
            setSuccess(response.message || "Account created successfully.");
            setForm({ ...initialForm });

            const fileInput = document.getElementById(
                "profile_picture"
            ) as HTMLInputElement | null;

            if (fileInput) fileInput.value = "";

            window.setTimeout(() => router.push("/login"), 1500);
        } catch (error: unknown) {
            const responseErrors =
                typeof error === "object" && error !== null
                    ? (error as Record<string, unknown>)
                    : {};

            const fieldErrors: RegisterErrors = {};
            const fields = [
                "username",
                "first_name",
                "last_name",
                "email",
                "password",
                "confirm_password",
                "phone",
                "profile_picture",
            ];

            for (const field of fields) {
                const value = responseErrors[field];

                if (typeof value === "string") {
                    fieldErrors[field] = value;
                } else if (Array.isArray(value)) {
                    fieldErrors[field] = value.join(" ");
                }
            }

            if (Object.keys(fieldErrors).length > 0) {
                setErrors(fieldErrors);
            } else {
                const messages = Object.entries(responseErrors)
                    .filter(([key]) => key !== "status")
                    .map(([, value]) =>
                        Array.isArray(value) ? value.join(" ") : value
                    )
                    .filter(
                        (value): value is string =>
                            typeof value === "string"
                    );

                setGeneralError(
                    messages.join(" ") ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    function fieldError(name: string) {
        const error = errors[name];
        if (!error) return null;

        return (
            <p className="mt-1.5 text-xs text-red-600">
                {Array.isArray(error) ? error.join(" ") : error}
            </p>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-4 py-12 sm:px-6 lg:py-16">
            <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E6EDE4] bg-white shadow-[0_24px_80px_rgba(24,59,42,0.08)] lg:grid-cols-2">
                <section className="relative hidden flex-col justify-between overflow-hidden bg-[#103B25] p-10 text-white lg:flex xl:p-14">
                    <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full border border-white/10" />
                    <div className="absolute right-10 top-36 h-40 w-40 rounded-full bg-[#35A45C]/20 blur-3xl" />

                    <Link href="/" className="relative z-10 flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
                            S
                        </span>
                        <span className="text-xl font-bold tracking-tight">
                            ShareHope
                        </span>
                    </Link>

                    <div className="relative z-10 my-16">
                        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-100">
                            GIVE A LITTLE. CHANGE A LOT.
                        </span>

                        <h1 className="mt-7 max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                            Small acts of kindness create lasting change.
                        </h1>

                        <p className="mt-6 max-w-md text-base leading-8 text-emerald-50/75">
                            Join a community connecting generous people with
                            campaigns that bring real help to those who need it.
                        </p>

                        <div className="mt-10 space-y-5">
                            {[
                                "Support causes that matter to you",
                                "Contribute funds or essential items",
                                "Follow campaign progress and updates",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-emerald-50/90"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#35A45C] text-xs font-bold">
                                        ✓
                                    </span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-xs text-emerald-50/50">
                        Every contribution can make a difference.
                    </p>
                </section>

                <section className="p-6 sm:p-10 lg:p-12 xl:p-14">
                    <div className="mb-8 flex items-center justify-between lg:hidden">
                        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[#166534]">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5F2E1]">
                                S
                            </span>
                            ShareHope
                        </Link>
                        <Link href="/" className="text-sm font-medium text-[#647568] hover:text-[#166534]">
                            Home
                        </Link>
                    </div>

                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[#35A45C]">
                            JOIN SHAREHOPE
                        </p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#183B2A]">
                            Create your account
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[#718073]">
                            Enter your details to get started with ShareHope.
                        </p>
                    </div>

                    {generalError && (
                        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {generalError}
                        </div>
                    )}

                    {success && (
                        <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                            {success} Redirecting to login...
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="first_name" className={labelClass}>First name</label>
                                <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} className={inputClass} placeholder="First name" autoComplete="given-name" />
                                {fieldError("first_name")}
                            </div>

                            <div>
                                <label htmlFor="last_name" className={labelClass}>Last name</label>
                                <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} className={inputClass} placeholder="Last name" autoComplete="family-name" />
                                {fieldError("last_name")}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className={labelClass}>Username <span className="text-red-500">*</span></label>
                            <input id="username" name="username" value={form.username} onChange={handleChange} className={inputClass} placeholder="Choose a username" autoComplete="username" required />
                            {fieldError("username")}
                        </div>

                        <div>
                            <label htmlFor="email" className={labelClass}>Email address <span className="text-red-500">*</span></label>
                            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" autoComplete="email" required />
                            {fieldError("email")}
                        </div>

                        <div>
                            <label htmlFor="phone" className={labelClass}>Phone number</label>
                            <input id="phone" name="phone" type="tel" value={form.phone ?? ""} onChange={handleChange} className={inputClass} placeholder="Your phone number" autoComplete="tel" />
                            {fieldError("phone")}
                        </div>

                        <div>
                            <label htmlFor="profile_picture" className={labelClass}>
                                Profile picture <span className="font-normal text-[#879387]">(optional)</span>
                            </label>
                            <input id="profile_picture" name="profile_picture" type="file" accept="image/*" onChange={handleChange} className="block w-full rounded-xl border border-[#DCE7D8] bg-white text-sm text-[#647568] file:mr-4 file:border-0 file:border-r file:border-[#DCE7D8] file:bg-[#F2F8EF] file:px-4 file:py-3 file:font-semibold file:text-[#166534] hover:file:bg-[#E5F2E1]" />
                            {form.profile_picture && <p className="mt-1.5 text-xs text-[#647568]">{form.profile_picture.name}</p>}
                            {fieldError("profile_picture")}
                        </div>

                        <div>
                            <label htmlFor="password" className={labelClass}>Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} className={`${inputClass} pr-20`} placeholder="Create a password" autoComplete="new-password" required />
                                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 text-xs font-semibold text-[#166534]">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {fieldError("password")}
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className={labelClass}>Confirm password <span className="text-red-500">*</span></label>
                            <input id="confirm_password" name="confirm_password" type={showPassword ? "text" : "password"} value={form.confirm_password} onChange={handleChange} className={inputClass} placeholder="Enter your password again" autoComplete="new-password" required />
                            {fieldError("confirm_password")}
                        </div>

                        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60">
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Creating account...
                                </>
                            ) : "Create account"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-[#718073]">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-[#166534] hover:text-[#35A45C]">
                            Sign in
                        </Link>
                    </p>

                    <p className="mt-6 text-center text-xs leading-5 text-[#9AA89B]">
                        By creating an account, you agree to use ShareHope responsibly and honestly.
                    </p>
                </section>
            </div>
        </main>
    );
}
