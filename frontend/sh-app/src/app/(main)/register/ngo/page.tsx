"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    FileText,
    ImagePlus,
    LoaderCircle,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { registerNGO } from "@/services/ngoService";
import type {
    NGORegistrationErrors,
    NGORegistrationFormErrors,
    NGORegistrationPayload,
} from "@/types/ngo";

function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return "Unable to register your NGO. Please try again.";
}

function mapRegistrationErrors(
    error: unknown
): NGORegistrationFormErrors {
    if (typeof error !== "object" || error === null) {
        return { general: getErrorMessage(error) };
    }

    const response = error as NGORegistrationErrors;
    const mapped: NGORegistrationFormErrors = {};

    const fields: Array<keyof NGORegistrationFormErrors> = [
        "name",
        "registration_number",
        "description",
        "email",
        "phone",
        "address",
        "ngo_logo",
        "ngo_document_type",
        "ngo_document_file",
    ];

    for (const field of fields) {
        const value = response[field];

        if (typeof value === "string") {
            mapped[field] = value;
        } else if (Array.isArray(value)) {
            mapped[field] = value.join(" ");
        }
    }

    if (response.detail && typeof response.detail === "string") {
        mapped.general = response.detail;
    } else if (response.message && typeof response.message === "string") {
        mapped.general = response.message;
    } else if (Object.keys(mapped).length === 0) {
        mapped.general = getErrorMessage(error);
    }

    return mapped;
}

const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const labelClass = "text-sm font-semibold text-slate-700";

export default function NGORegistrationPage() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] =
        useState<NGORegistrationFormErrors>({});

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});

        const form = event.currentTarget;
        const formData = new FormData(form);

        const ngoLogo = formData.get("ngo_logo");
        const ngoDocumentFile = formData.get("ngo_document_file");

        if (!(ngoLogo instanceof File) || ngoLogo.size === 0) {
            setErrors({ ngo_logo: "Please upload your NGO logo." });
            return;
        }

        if (
            !(ngoDocumentFile instanceof File) ||
            ngoDocumentFile.size === 0
        ) {
            setErrors({
                ngo_document_file: "Please upload your NGO document.",
            });
            return;
        }

        const payload: NGORegistrationPayload = {
            name: String(formData.get("name") ?? "").trim(),
            registration_number: String(
                formData.get("registration_number") ?? ""
            ).trim(),
            description: String(
                formData.get("description") ?? ""
            ).trim(),
            email: String(formData.get("email") ?? "").trim(),
            phone: String(formData.get("phone") ?? "").trim(),
            address: String(formData.get("address") ?? "").trim(),
            ngo_logo: ngoLogo,
            ngo_document_type: String(
                formData.get("ngo_document_type") ?? ""
            ).trim(),
            ngo_document_file: ngoDocumentFile,
        };

        setIsSubmitting(true);

        try {
            await registerNGO(payload);
            router.replace("/dashboard/ngo/pending");
        } catch (error: unknown) {
            setErrors(mapRegistrationErrors(error));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-10">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
                <ArrowLeft size={17} />
                Back to dashboard
            </Link>

            <header className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Building2 size={28} />
                </div>

                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    NGO onboarding
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                    Register your NGO
                </h1>

                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Submit your organization details and supporting
                    documents for Admin review. Your NGO dashboard will
                    become available after approval.
                </p>
            </header>

            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <FileText
                    className="mt-0.5 shrink-0 text-amber-700"
                    size={21}
                />
                <div>
                    <p className="font-semibold text-amber-900">
                        Approval is required
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                        Your NGO registration will start with Pending
                        status. You can access the NGO dashboard after
                        the Admin approves your registration.
                    </p>
                </div>
            </div>

            {errors.general && (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    {errors.general}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
            >
                <section className="space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Organization details
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter your NGO's official information.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className={labelClass}>
                                NGO name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                maxLength={150}
                                autoComplete="organization"
                                placeholder="Enter registered NGO name"
                                className={inputClass}
                                aria-invalid={Boolean(errors.name)}
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="registration_number"
                                className={labelClass}
                            >
                                Registration number *
                            </label>
                            <input
                                id="registration_number"
                                name="registration_number"
                                type="text"
                                required
                                placeholder="Official registration number"
                                className={inputClass}
                                aria-invalid={Boolean(
                                    errors.registration_number
                                )}
                            />
                            {errors.registration_number && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.registration_number}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="description"
                                className={labelClass}
                            >
                                Organization description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={4}
                                placeholder="Describe your mission, activities, and the communities you support."
                                className={`${inputClass} resize-y`}
                                aria-invalid={Boolean(errors.description)}
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className={labelClass}>
                                Contact email *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="contact@example.org"
                                className={inputClass}
                                aria-invalid={Boolean(errors.email)}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className={labelClass}>
                                Contact phone *
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                required
                                autoComplete="tel"
                                placeholder="+977..."
                                className={inputClass}
                                aria-invalid={Boolean(errors.phone)}
                            />
                            {errors.phone && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="address" className={labelClass}>
                                Organization address *
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                required
                                autoComplete="street-address"
                                placeholder="City, district, province"
                                className={inputClass}
                                aria-invalid={Boolean(errors.address)}
                            />
                            {errors.address && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="border-t border-slate-100" />

                <section className="space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Logo and verification document
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Upload the NGO logo and an official document
                            for verification.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="ngo_logo" className={labelClass}>
                            NGO logo * (JPG, JPEG, PNG)
                        </label>
                        <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-emerald-400">
                            <div className="flex items-center gap-3">
                                <ImagePlus
                                    size={24}
                                    className="shrink-0 text-emerald-700"
                                />
                                <input
                                    id="ngo_logo"
                                    name="ngo_logo"
                                    type="file"
                                    required
                                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                    className="min-w-0 flex-1 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:font-semibold file:text-emerald-800 hover:file:bg-emerald-200"
                                    aria-invalid={Boolean(errors.ngo_logo)}
                                />
                            </div>
                        </div>
                        {errors.ngo_logo && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.ngo_logo}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="ngo_document_type"
                                className={labelClass}
                            >
                                Document type *
                            </label>
                            <input
                                id="ngo_document_type"
                                name="ngo_document_type"
                                type="text"
                                required
                                placeholder="e.g. Registration certificate"
                                className={inputClass}
                                aria-invalid={Boolean(
                                    errors.ngo_document_type
                                )}
                            />
                            {errors.ngo_document_type && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.ngo_document_type}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="ngo_document_file"
                                className={labelClass}
                            >
                                Supporting document * (PDF, DOC, DOCX)
                            </label>
                            <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                                <div className="flex items-center gap-2">
                                    <Upload
                                        size={20}
                                        className="shrink-0 text-emerald-700"
                                    />
                                    <input
                                        id="ngo_document_file"
                                        name="ngo_document_file"
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        className="min-w-0 flex-1 text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-2 file:py-2 file:font-semibold file:text-emerald-800"
                                        aria-invalid={Boolean(
                                            errors.ngo_document_file
                                        )}
                                    />
                                </div>
                            </div>
                            {errors.ngo_document_file && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.ngo_document_file}
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <div className="border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle
                                    size={18}
                                    className="animate-spin"
                                />
                                Submitting registration...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={18} />
                                Submit for approval
                            </>
                        )}
                    </button>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                        By submitting, you confirm that the information
                        provided is accurate and that your organization
                        can provide supporting evidence when requested.
                    </p>
                </div>
            </form>
        </div>
    );
}