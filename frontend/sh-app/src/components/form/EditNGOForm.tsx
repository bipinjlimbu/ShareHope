"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    ImagePlus,
    LoaderCircle,
    X,
    Building2,
    Mail,
    Phone,
    MapPin,
    Hash,
    FileText,
} from "lucide-react";
import { updateNGO } from "@/services/ngoService";
import type {
    NGOUserResponse,
    NGOChangeRequestPayload,
    NGOChangeRequestFormErrors,
} from "@/types/ngo";
import { useToast } from "@/components/toast/ToastProvider";

interface EditNGOFormProps {
    ngo: NGOUserResponse;
    onClose: () => void;
    onSuccess: () => void | Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const inputClassName =
    "mt-1.5 w-full rounded-xl border border-[#DDE7D9] bg-white px-3.5 py-3 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA79A] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10";

const labelClassName =
    "block text-sm font-semibold text-[#35543B]";

function getNGOImageUrl(
    path: string | null | undefined
): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getErrorMessage(value: unknown): string | undefined {
    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
        return value
            .filter(
                (item): item is string =>
                    typeof item === "string"
            )
            .join(" ");
    }

    return undefined;
}

function getBackendErrors(error: unknown): {
    fieldErrors: NGOChangeRequestFormErrors;
    generalError: string;
} {
    const fallback =
        "Unable to submit NGO changes. Please try again.";

    if (!error || typeof error !== "object") {
        return {
            fieldErrors: {},
            generalError: fallback,
        };
    }

    const source = error as Record<string, unknown>;

    const nestedErrors =
        source.errors && typeof source.errors === "object"
            ? (source.errors as Record<string, unknown>)
            : source;

    const fieldErrors: NGOChangeRequestFormErrors = {};

    for (const [key, value] of Object.entries(nestedErrors)) {
        const message = getErrorMessage(value);

        if (message) {
            fieldErrors[key] = message;
        }
    }

    const generalError =
        getErrorMessage(source.message) ??
        getErrorMessage(source.detail) ??
        getErrorMessage(source.general) ??
        getErrorMessage(source.non_field_errors) ??
        fallback;

    return {
        fieldErrors,
        generalError,
    };
}

export default function EditNGOForm({
    ngo,
    onClose,
    onSuccess,
}: EditNGOFormProps) {
    const { showToast } = useToast();

    const [form, setForm] = useState<NGOChangeRequestPayload>({
        name: ngo.name ?? "",
        registration_number: ngo.registration_number ?? "",
        description: ngo.description ?? "",
        email: ngo.email ?? "",
        phone: ngo.phone ?? "",
        address: ngo.address ?? "",
        ngo_logo: null,
    });

    const [errors, setErrors] =
        useState<NGOChangeRequestFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(
        getNGOImageUrl(ngo.ngo_logo)
    );

    useEffect(() => {
        if (!form.ngo_logo) return;

        const objectUrl = URL.createObjectURL(form.ngo_logo);

        setImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.ngo_logo]);

    const updateField = <K extends keyof NGOChangeRequestPayload>(
        field: K,
        value: NGOChangeRequestPayload[K]
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
            general: undefined,
            non_field_errors: undefined,
        }));
    };

    const handleLogoChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;

        updateField("ngo_logo", file);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubmitting || !ngo.id) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await updateNGO(ngo.id, form);

            showToast(
                "NGO changes submitted for admin approval.",
                "success"
            );

            await onSuccess();
        } catch (error: unknown) {
            const result = getBackendErrors(error);

            setErrors(result.fieldErrors);

            showToast(result.generalError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldError = (
        field: keyof NGOChangeRequestFormErrors
    ) => errors[field];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#183B2A]/45 px-3 py-5 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isSubmitting
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-ngo-title"
                className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <Building2 size={21} />
                        </div>

                        <div>
                            <h2
                                id="edit-ngo-title"
                                className="text-xl font-bold text-[#183B2A] sm:text-2xl"
                            >
                                Edit NGO Details
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-[#647568]">
                                Update your organization's information.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close edit NGO form"
                        className="rounded-lg p-2 text-[#647568] transition hover:bg-[#E5F2E1] hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="max-h-[calc(100dvh-130px)] space-y-6 overflow-y-auto p-5 sm:p-7"
                >
                    {/* Approval notice */}
                    <div className="rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#166534]">
                                <FileText size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#183B2A]">
                                    Changes require admin approval
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#647568]">
                                    Your current NGO information will remain
                                    unchanged until an administrator reviews
                                    and approves your change request.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Organization information */}
                    <section>
                        <div className="mb-4">
                            <h3 className="font-bold text-[#183B2A]">
                                Organization information
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                Update your NGO's registered and contact details.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="edit-ngo-name"
                                    className={labelClassName}
                                >
                                    NGO name
                                </label>

                                <div className="relative">
                                    <Building2
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="edit-ngo-name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={(event) =>
                                            updateField(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter NGO name"
                                        aria-invalid={Boolean(
                                            fieldError("name")
                                        )}
                                    />
                                </div>

                                {fieldError("name") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("name")}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="edit-ngo-registration-number"
                                    className={labelClassName}
                                >
                                    Registration number
                                </label>

                                <div className="relative">
                                    <Hash
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="edit-ngo-registration-number"
                                        name="registration_number"
                                        type="text"
                                        value={form.registration_number}
                                        onChange={(event) =>
                                            updateField(
                                                "registration_number",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter registration number"
                                        aria-invalid={Boolean(
                                            fieldError("registration_number")
                                        )}
                                    />
                                </div>

                                {fieldError("registration_number") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("registration_number")}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="edit-ngo-description"
                                    className={labelClassName}
                                >
                                    Description
                                </label>

                                <textarea
                                    id="edit-ngo-description"
                                    name="description"
                                    rows={4}
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Describe your organization and its purpose"
                                    aria-invalid={Boolean(
                                        fieldError("description")
                                    )}
                                />

                                {fieldError("description") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("description")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Contact information */}
                    <section className="rounded-xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <div className="mb-4">
                            <h3 className="font-bold text-[#183B2A]">
                                Contact information
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                Keep your organization's contact details up to date.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="edit-ngo-email"
                                    className={labelClassName}
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="edit-ngo-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            updateField(
                                                "email",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter email address"
                                        aria-invalid={Boolean(
                                            fieldError("email")
                                        )}
                                    />
                                </div>

                                {fieldError("email") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("email")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="edit-ngo-phone"
                                    className={labelClassName}
                                >
                                    Phone number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="edit-ngo-phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(event) =>
                                            updateField(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter phone number"
                                        aria-invalid={Boolean(
                                            fieldError("phone")
                                        )}
                                    />
                                </div>

                                {fieldError("phone") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("phone")}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="edit-ngo-address"
                                    className={labelClassName}
                                >
                                    Address
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={17}
                                        className="absolute left-3.5 top-4 text-[#829184]"
                                    />

                                    <textarea
                                        id="edit-ngo-address"
                                        name="address"
                                        rows={2}
                                        value={form.address}
                                        onChange={(event) =>
                                            updateField(
                                                "address",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter organization's address"
                                        aria-invalid={Boolean(
                                            fieldError("address")
                                        )}
                                    />
                                </div>

                                {fieldError("address") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("address")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* NGO logo */}
                    <section>
                        <div className="mb-3">
                            <h3 className="font-bold text-[#183B2A]">
                                NGO logo
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                Upload a replacement logo or keep your current one.
                            </p>
                        </div>

                        {imagePreview && (
                            <div className="flex min-h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-[#DDE7D9] bg-white p-5">
                                <img
                                    src={imagePreview}
                                    alt="NGO logo preview"
                                    className="h-36 w-36 rounded-xl object-contain"
                                />
                            </div>
                        )}

                        <label
                            htmlFor="edit-ngo-logo"
                            className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C9DCC4] bg-white p-4 transition hover:border-[#35A45C] hover:bg-[#F5F9F2]"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <ImagePlus size={21} />
                            </span>

                            <span className="min-w-0">
                                <span className="block break-words text-sm font-semibold text-[#35543B]">
                                    {form.ngo_logo?.name ??
                                        "Choose a new NGO logo"}
                                </span>

                                <span className="mt-1 block text-xs text-[#829184]">
                                    Leave unchanged to keep the current logo.
                                </span>
                            </span>
                        </label>

                        <input
                            id="edit-ngo-logo"
                            name="ngo_logo"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleLogoChange}
                            className="sr-only"
                            aria-invalid={Boolean(
                                fieldError("ngo_logo")
                            )}
                        />

                        {fieldError("ngo_logo") && (
                            <p className="mt-1.5 text-xs leading-5 text-red-600">
                                {fieldError("ngo_logo")}
                            </p>
                        )}
                    </section>

                    {/* General errors */}
                    {(fieldError("general") ||
                        fieldError("non_field_errors")) && (
                            <p className="text-xs leading-5 text-red-600">
                                {fieldError("general") ??
                                    fieldError("non_field_errors")}
                            </p>
                        )}

                    {/* Form actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#E5EDE3] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#526657] transition hover:bg-[#F1F7ED] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting || !ngo.id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Submitting changes...
                                </>
                            ) : (
                                "Submit for Approval"
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}