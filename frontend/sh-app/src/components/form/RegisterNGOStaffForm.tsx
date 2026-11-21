"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import {
    ImagePlus,
    LoaderCircle,
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
    X,
} from "lucide-react";
import { registerNGOStaff } from "@/services/ngoService";
import type {
    NGOStaffRegistrationErrors,
    NGOStaffRegistrationPayload,
} from "@/types/ngo";
import { useToast } from "@/components/toast/ToastProvider";

interface RegisterNGOStaffFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const initialForm: NGOStaffRegistrationPayload = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    profile_picture: null,
};

const inputClassName =
    "mt-1.5 w-full rounded-xl border border-[#DDE7D9] bg-white px-3.5 py-3 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA79A] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10";

const labelClassName = "block text-sm font-semibold text-[#35543B]";

function getErrorMessage(value: unknown): string | undefined {
    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === "string")
            .join(" ");
    }

    return undefined;
}

function getBackendErrors(error: unknown): {
    fieldErrors: NGOStaffRegistrationErrors;
    generalError: string;
} {
    const fallback = "Unable to register NGO staff. Please try again.";

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

    const fieldErrors: NGOStaffRegistrationErrors = {};

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

export default function RegisterNGOStaffForm({
    onClose,
    onSuccess,
}: RegisterNGOStaffFormProps) {
    const { showToast } = useToast();

    const [form, setForm] =
        useState<NGOStaffRegistrationPayload>(initialForm);

    const [errors, setErrors] =
        useState<NGOStaffRegistrationErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = <K extends keyof NGOStaffRegistrationPayload>(
        field: K,
        value: NGOStaffRegistrationPayload[K]
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

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;
        updateField("profile_picture", file);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await registerNGOStaff(form);

            showToast("NGO staff registered successfully.", "success");
            onSuccess();
        } catch (error: unknown) {
            const result = getBackendErrors(error);

            setErrors(result.fieldErrors);
            showToast(result.generalError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldError = (field: keyof NGOStaffRegistrationErrors) =>
        errors[field];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#183B2A]/45 px-3 py-5 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="register-ngo-staff-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div>
                        <h2
                            id="register-ngo-staff-title"
                            className="text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            Add NGO Staff
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-[#647568]">
                            Register a new staff member for your NGO.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close register NGO staff form"
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
                    <section>
                        <h3 className="mb-4 font-bold text-[#183B2A]">
                            Personal information
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="staff-first-name"
                                    className={labelClassName}
                                >
                                    First name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="staff-first-name"
                                        name="first_name"
                                        type="text"
                                        value={form.first_name}
                                        onChange={(event) =>
                                            updateField(
                                                "first_name",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter first name"
                                        aria-invalid={Boolean(
                                            fieldError("first_name")
                                        )}
                                        aria-describedby={
                                            fieldError("first_name")
                                                ? "staff-first-name-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("first_name") && (
                                    <p
                                        id="staff-first-name-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("first_name")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="staff-last-name"
                                    className={labelClassName}
                                >
                                    Last name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="staff-last-name"
                                        name="last_name"
                                        type="text"
                                        value={form.last_name}
                                        onChange={(event) =>
                                            updateField(
                                                "last_name",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter last name"
                                        aria-invalid={Boolean(
                                            fieldError("last_name")
                                        )}
                                        aria-describedby={
                                            fieldError("last_name")
                                                ? "staff-last-name-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("last_name") && (
                                    <p
                                        id="staff-last-name-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("last_name")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="staff-username"
                                    className={labelClassName}
                                >
                                    Username
                                </label>

                                <input
                                    id="staff-username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={(event) =>
                                        updateField(
                                            "username",
                                            event.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Choose a username"
                                    aria-invalid={Boolean(
                                        fieldError("username")
                                    )}
                                    aria-describedby={
                                        fieldError("username")
                                            ? "staff-username-error"
                                            : undefined
                                    }
                                />

                                {fieldError("username") && (
                                    <p
                                        id="staff-username-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("username")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="staff-phone"
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
                                        id="staff-phone"
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
                                        aria-describedby={
                                            fieldError("phone")
                                                ? "staff-phone-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("phone") && (
                                    <p
                                        id="staff-phone-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("phone")}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="staff-email"
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
                                        id="staff-email"
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
                                        aria-describedby={
                                            fieldError("email")
                                                ? "staff-email-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("email") && (
                                    <p
                                        id="staff-email-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("email")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <div className="mb-4">
                            <h3 className="font-bold text-[#183B2A]">
                                Account security
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                Set the login password for the new staff account.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="staff-password"
                                    className={labelClassName}
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="staff-password"
                                        name="password"
                                        type="password"
                                        value={form.password}
                                        onChange={(event) =>
                                            updateField(
                                                "password",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(
                                            fieldError("password")
                                        )}
                                        aria-describedby={
                                            fieldError("password")
                                                ? "staff-password-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("password") && (
                                    <p
                                        id="staff-password-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("password")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="staff-confirm-password"
                                    className={labelClassName}
                                >
                                    Confirm password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        id="staff-confirm-password"
                                        name="confirm_password"
                                        type="password"
                                        value={form.confirm_password}
                                        onChange={(event) =>
                                            updateField(
                                                "confirm_password",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(
                                            fieldError("confirm_password")
                                        )}
                                        aria-describedby={
                                            fieldError("confirm_password")
                                                ? "staff-confirm-password-error"
                                                : undefined
                                        }
                                    />
                                </div>

                                {fieldError("confirm_password") && (
                                    <p
                                        id="staff-confirm-password-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("confirm_password")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <label
                            htmlFor="staff-profile-picture"
                            className={labelClassName}
                        >
                            Profile picture
                        </label>

                        <label
                            htmlFor="staff-profile-picture"
                            className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C9DCC4] bg-white p-4 transition hover:border-[#35A45C] hover:bg-[#F5F9F2]"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <ImagePlus size={21} />
                            </span>

                            <span className="min-w-0">
                                <span className="block break-words text-sm font-semibold text-[#35543B]">
                                    {form.profile_picture?.name ??
                                        "Choose profile picture"}
                                </span>

                                <span className="mt-1 block text-xs text-[#829184]">
                                    Select a profile image from your device
                                </span>
                            </span>
                        </label>

                        <input
                            id="staff-profile-picture"
                            name="profile_picture"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            aria-invalid={Boolean(
                                fieldError("profile_picture")
                            )}
                            aria-describedby={
                                fieldError("profile_picture")
                                    ? "staff-profile-picture-error"
                                    : undefined
                            }
                        />

                        {fieldError("profile_picture") && (
                            <p
                                id="staff-profile-picture-error"
                                className="mt-1.5 text-xs leading-5 text-red-600"
                            >
                                {fieldError("profile_picture")}
                            </p>
                        )}
                    </section>

                    {(fieldError("general") ||
                        fieldError("non_field_errors")) && (
                            <p className="text-xs leading-5 text-red-600">
                                {fieldError("general") ??
                                    fieldError("non_field_errors")}
                            </p>
                        )}

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
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Registering staff...
                                </>
                            ) : (
                                "Register Staff"
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
