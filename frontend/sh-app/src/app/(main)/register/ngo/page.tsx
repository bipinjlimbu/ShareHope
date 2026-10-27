"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    ImagePlus,
    LoaderCircle,
    ShieldCheck,
    Upload,
} from "lucide-react";
import FooterLogo from "@/images/FooterLogo.png";
import { registerNGO } from "@/services/ngoService";
import { getProfile } from "@/services/profileService";
import NGORegistrationSkeleton from "@/components/skeleton/auth/NGORegistrationSkeleton";
import { useToast } from "@/components/toast/ToastProvider";
import type {
    NGORegistrationErrors,
    NGORegistrationPayload,
    NGORegistrationFormErrors,
    NGODocumentType,
} from "@/types/ngo";

const initialForm: NGORegistrationPayload = {
    name: "",
    registration_number: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    ngo_logo: null,
    ngo_document_type: "",
    ngo_document_file: null,
};

const FIELD_NAMES = [
    "name",
    "registration_number",
    "description",
    "email",
    "phone",
    "address",
    "ngo_logo",
    "ngo_document_type",
    "ngo_document_file",
] as const;

function getErrorMessage(value: unknown): string | undefined {
    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(String).join(" ");
    }

    return undefined;
}

function hasFieldErrors(errors: NGORegistrationErrors): boolean {
    return FIELD_NAMES.some((field) =>
        Boolean(getErrorMessage(errors[field]))
    );
}

function getBackendMessage(
    errors: NGORegistrationErrors
): string | undefined {
    return (
        getErrorMessage(errors.non_field_errors) ||
        getErrorMessage(errors.detail) ||
        getErrorMessage(errors.message) ||
        getErrorMessage(errors.error) ||
        getErrorMessage(errors.general)
    );
}

export default function NGORegistrationPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [form, setForm] = useState<NGORegistrationPayload>(initialForm);
    const [errors, setErrors] = useState<NGORegistrationFormErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [accessChecked, setAccessChecked] = useState(false);
    const [pageReady, setPageReady] = useState(false);
    const [hasPageAccess, setHasPageAccess] = useState(false);

    const accessCheckStarted = useRef(false);

    useEffect(() => {
        setPageReady(true);

        if (accessCheckStarted.current) {
            return;
        }

        accessCheckStarted.current = true;

        async function checkAccess() {
            try {
                const response = await getProfile();
                const role = response.user.role;

                if (role !== "NGO_ADMIN") {
                    showToast(
                        "Only NGO Admin can access this page.",
                        "error"
                    );
                    router.replace("/");
                    return;
                }

                setHasPageAccess(true);
                setAccessChecked(true);
            } catch {
                showToast(
                    "Please log in to access this page.",
                    "error"
                );
                router.replace("/login");
            }
        }

        void checkAccess();
    }, [router, showToast]);

    function clearFieldError(field: string) {
        setErrors((previous) => {
            const updated = { ...previous };

            delete updated[field];
            delete updated.non_field_errors;
            delete updated.detail;
            delete updated.message;
            delete updated.error;
            delete updated.general;

            return updated;
        });
    }

    function handleChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        clearFieldError(name);
    }

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
        field: "ngo_logo" | "ngo_document_file"
    ) {
        const file = event.target.files?.[0] ?? null;

        setForm((previous) => ({
            ...previous,
            [field]: file,
        }));

        clearFieldError(field);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (submitting) {
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const response = await registerNGO(form);

            if (response.message) {
                showToast(response.message, "success");
            }

            router.push("/profile");
        } catch (error: unknown) {
            const backendErrors: NGORegistrationErrors =
                error && typeof error === "object"
                    ? (error as NGORegistrationErrors)
                    : {};

            const fieldErrors: NGORegistrationFormErrors = {};

            for (const field of FIELD_NAMES) {
                const message = getErrorMessage(backendErrors[field]);

                if (message) {
                    fieldErrors[field] = message;
                }
            }

            setErrors(fieldErrors);

            if (hasFieldErrors(backendErrors)) {
                return;
            }

            const backendMessage = getBackendMessage(backendErrors);

            showToast(
                backendMessage ||
                "Unable to submit NGO registration. Please try again.",
                "error"
            );
        } finally {
            setSubmitting(false);
        }
    }

    function renderError(field: string) {
        const message = errors[field];

        if (!message) {
            return null;
        }

        return (
            <p role="alert" className="mt-1.5 text-sm text-red-600">
                {message}
            </p>
        );
    }

    if (!pageReady || !accessChecked || !hasPageAccess) {
        return <NGORegistrationSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-4 py-8 sm:px-6 lg:py-12">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/register"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-800 transition hover:text-green-950"
                >
                    <ArrowLeft size={17} />
                    Back to registration
                </Link>

                <div className="grid overflow-hidden rounded-3xl border border-green-950/10 bg-white shadow-xl shadow-green-950/5 lg:grid-cols-[0.9fr_1.1fr]">
                    <aside className="relative flex flex-col justify-between overflow-hidden bg-[#14532D] p-7 text-white sm:p-10 lg:p-12">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
                        <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full border border-white/10" />

                        <div className="relative z-10">
                            <Link href="/" className="inline-flex items-center">
                                <Image
                                    src={FooterLogo}
                                    alt="ShareHope"
                                    width={160}
                                    height={56}
                                    className="h-12 w-auto object-contain"
                                    priority
                                />
                            </Link>

                            <div className="mt-14">
                                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                                    <Building2 size={29} />
                                </div>

                                <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-4xl">
                                    Register your NGO with ShareHope
                                </h1>

                                <p className="mt-5 max-w-md leading-7 text-green-50/90">
                                    Create your organization profile to manage campaigns, receive
                                    donations, and maintain transparent donation records.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 rounded-2xl border border-white/15 bg-white/10 p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck
                                    className="mt-0.5 shrink-0 text-green-200"
                                    size={22}
                                />
                                <div>
                                    <h2 className="font-semibold">Verification before access</h2>
                                    <p className="mt-1 text-sm leading-6 text-green-50/90">
                                        Your organization registration will be reviewed by the
                                        ShareHope administrator before NGO dashboard access is
                                        granted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="p-6 sm:p-9 lg:p-12">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-green-800">
                                Organization details
                            </p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                                NGO registration
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Enter your organization details and upload the required
                                documents.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            <div>
                                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                                    <Building2 size={18} className="text-green-800" />
                                    Basic information
                                </h3>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-800">
                                            NGO name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.name)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="Enter your organization's name"
                                        />
                                        {renderError("name")}
                                    </div>

                                    <div>
                                        <label htmlFor="registration_number" className="mb-2 block text-sm font-medium text-slate-800">
                                            Registration number
                                        </label>
                                        <input
                                            id="registration_number"
                                            name="registration_number"
                                            value={form.registration_number}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.registration_number)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="Registration number"
                                        />
                                        {renderError("registration_number")}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
                                            Organization email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.email)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="organization@example.com"
                                        />
                                        {renderError("email")}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-800">
                                            Contact number
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.phone)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="Contact number"
                                        />
                                        {renderError("phone")}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-800">
                                            Address
                                        </label>
                                        <input
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.address)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="Organization address"
                                        />
                                        {renderError("address")}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-800">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            aria-invalid={Boolean(errors.description)}
                                            rows={4}
                                            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                            placeholder="Describe your organization's mission and work"
                                        />
                                        {renderError("description")}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                                    <ImagePlus size={18} className="text-green-800" />
                                    Organization logo
                                </h3>

                                <label
                                    htmlFor="ngo_logo"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-green-700 hover:bg-green-50/40"
                                >
                                    <Upload size={24} className="mb-3 text-green-800" />
                                    <span className="text-sm font-semibold text-slate-900">
                                        {form.ngo_logo?.name || "Choose an NGO logo"}
                                    </span>
                                    <span className="mt-1 text-xs text-slate-600">
                                        Select the logo file to upload
                                    </span>
                                    <input
                                        id="ngo_logo"
                                        name="ngo_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => handleFileChange(event, "ngo_logo")}
                                        className="sr-only"
                                        aria-invalid={Boolean(errors.ngo_logo)}
                                    />
                                </label>
                                {renderError("ngo_logo")}
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
                                    <ShieldCheck size={18} className="text-green-800" />
                                    Verification document
                                </h3>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="ngo_document_type" className="mb-2 block text-sm font-medium text-slate-800">
                                            Document type
                                        </label>
                                        <select
                                            id="ngo_document_type"
                                            name="ngo_document_type"
                                            value={form.ngo_document_type}
                                            onChange={(event) => {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    ngo_document_type: event.target.value as NGODocumentType | "",
                                                }));
                                                clearFieldError("ngo_document_type");
                                            }}
                                            aria-invalid={Boolean(errors.ngo_document_type)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                                        >
                                            <option value="">Select document type</option>
                                            <option value="REGISTRATION">Registration Document</option>
                                            <option value="TAX_EXEMPTION">Tax Exemption Certificate</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        {renderError("ngo_document_type")}
                                    </div>

                                    <div>
                                        <label htmlFor="ngo_document_file" className="mb-2 block text-sm font-medium text-slate-800">
                                            Upload document
                                        </label>
                                        <label
                                            htmlFor="ngo_document_file"
                                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-4 transition hover:border-green-700"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-800">
                                                <Upload size={20} />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-slate-900">
                                                    {form.ngo_document_file?.name || "Choose a document"}
                                                </span>
                                                <span className="mt-1 block text-xs text-slate-600">
                                                    Select your verification document
                                                </span>
                                            </span>
                                            <input
                                                id="ngo_document_file"
                                                name="ngo_document_file"
                                                type="file"
                                                onChange={(event) => handleFileChange(event, "ngo_document_file")}
                                                className="sr-only"
                                                aria-invalid={Boolean(errors.ngo_document_file)}
                                            />
                                        </label>
                                        {renderError("ngo_document_file")}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle size={18} className="animate-spin" />
                                        Submitting registration...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Submit NGO registration
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-slate-600">
                                Already registered?{" "}
                                <Link href="/login" className="font-semibold text-green-800 hover:text-green-950">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}