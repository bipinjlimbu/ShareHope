
"use client";

import { useEffect, useState, type FormEvent } from "react";
import type {
    ProfileFormErrors,
    ProfileUpdatePayload,
    ProfileUser,
} from "@/types/profile";
import {
    ProfileServiceError,
    updateProfile,
} from "@/services/profileService";

type ProfileFormProps = {
    user: ProfileUser;
    apiBaseUrl: string;
    onClose: () => void;
    onUpdated: (user: ProfileUser) => void;
};

function getFieldError(
    errors: ProfileFormErrors,
    field: string,
): string | undefined {
    const error = errors[field];

    if (Array.isArray(error)) return error.join(" ");
    if (typeof error === "string") return error;

    return undefined;
}

export default function ProfileForm({
    user,
    apiBaseUrl,
    onClose,
    onUpdated,
}: ProfileFormProps) {
    const [username, setUsername] = useState(user.username ?? "");
    const [firstName, setFirstName] = useState(user.first_name ?? "");
    const [lastName, setLastName] = useState(user.last_name ?? "");
    const [email, setEmail] = useState(user.email ?? "");
    const [phone, setPhone] = useState(user.phone ?? "");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<ProfileFormErrors>({});
    const [generalError, setGeneralError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!profilePicture) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(profilePicture);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [profilePicture]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !isSaving) {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSaving, onClose]);

    const currentPicture =
        typeof user.profile_picture === "string"
            ? user.profile_picture.startsWith("http")
                ? user.profile_picture
                : `${apiBaseUrl}${user.profile_picture}`
            : null;

    const displayedPicture = previewUrl || currentPicture;

    const inputClassName =
        "mt-2 w-full rounded-xl border border-[#DDE7DC] bg-white px-4 py-3 text-sm text-[#24432D] outline-none transition placeholder:text-[#A0ACA0] focus:border-[#35A45C] focus:ring-2 focus:ring-[#35A45C]/15 disabled:cursor-not-allowed disabled:bg-[#F7F9F4]";

    const fieldErrorClassName = "mt-1.5 text-xs font-medium text-red-600";

    function clearFieldError(field: string) {
        setErrors((previous) => ({
            ...previous,
            [field]: "",
        }));
        setGeneralError("");
    }

    function fieldError(field: string) {
        const message = getFieldError(errors, field);

        return message ? (
            <p className={fieldErrorClassName} role="alert">
                {message}
            </p>
        ) : null;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrors({});
        setGeneralError("");

        const payload: ProfileUpdatePayload = {
            username: username.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            profile_picture: profilePicture,
        };

        setIsSaving(true);

        try {
            const response = await updateProfile(payload);
            onUpdated(response.user);
        } catch (error) {
            if (error instanceof ProfileServiceError) {
                const serverErrors = error.errors ?? {};
                setErrors(serverErrors);

                const hasFieldErrors = Object.keys(serverErrors).some(
                    (key) =>
                        key !== "detail" &&
                        key !== "message" &&
                        Boolean(getFieldError(serverErrors, key)),
                );

                if (!hasFieldErrors) {
                    setGeneralError(error.message);
                }
            } else {
                setGeneralError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#183322]/45 p-4 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-profile-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E6EDE4] bg-[#FFFCF6] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#E6EDE4] bg-white px-5 py-5 sm:px-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#35A45C]">
                            Account settings
                        </p>
                        <h2
                            id="edit-profile-title"
                            className="mt-1 text-xl font-extrabold text-[#14532D] sm:text-2xl"
                        >
                            Edit Profile
                        </h2>
                        <p className="mt-1 text-sm text-[#718174]">
                            Update your personal information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close edit profile form"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E6EDE4] bg-white text-xl text-[#718174] transition hover:bg-[#F0F6ED] hover:text-[#14532D] disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                <form noValidate onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
                        {generalError && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {generalError}
                            </div>
                        )}

                        <div className="flex flex-col items-center rounded-2xl border border-[#E6EDE4] bg-white p-5">
                            {displayedPicture ? (
                                <img
                                    src={displayedPicture}
                                    alt="Profile preview"
                                    className="h-24 w-24 rounded-full border-4 border-[#F0F6ED] bg-[#E4F1E4] object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#F0F6ED] bg-[#E4F1E4] text-3xl font-extrabold uppercase text-[#166534]">
                                    {(firstName || username).charAt(0) || "U"}
                                </div>
                            )}

                            <label
                                htmlFor="profile_picture"
                                className="mt-4 cursor-pointer rounded-xl border border-[#D7E9D5] bg-[#F0F7ED] px-4 py-2.5 text-sm font-semibold text-[#287341] transition hover:bg-[#E4F1E4]"
                            >
                                Change profile picture
                            </label>

                            <input
                                id="profile_picture"
                                name="profile_picture"
                                type="file"
                                accept="image/*"
                                disabled={isSaving}
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    setProfilePicture(file);
                                    clearFieldError("profile_picture");
                                }}
                                className="sr-only"
                            />

                            <p className="mt-2 text-xs text-[#879487]">
                                Choose an image from your device.
                            </p>

                            {fieldError("profile_picture")}
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="text-sm font-semibold text-[#24432D]"
                                >
                                    First name
                                </label>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    value={firstName}
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
                                        clearFieldError("first_name");
                                    }}
                                    disabled={isSaving}
                                    className={inputClassName}
                                    placeholder="Enter first name"
                                    aria-invalid={Boolean(getFieldError(errors, "first_name"))}
                                />
                                {fieldError("first_name")}
                            </div>

                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="text-sm font-semibold text-[#24432D]"
                                >
                                    Last name
                                </label>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(event) => {
                                        setLastName(event.target.value);
                                        clearFieldError("last_name");
                                    }}
                                    disabled={isSaving}
                                    className={inputClassName}
                                    placeholder="Enter last name"
                                    aria-invalid={Boolean(getFieldError(errors, "last_name"))}
                                />
                                {fieldError("last_name")}
                            </div>

                            <div>
                                <label
                                    htmlFor="username"
                                    className="text-sm font-semibold text-[#24432D]"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                        clearFieldError("username");
                                    }}
                                    disabled={isSaving}
                                    className={inputClassName}
                                    placeholder="Enter username"
                                    aria-invalid={Boolean(getFieldError(errors, "username"))}
                                />
                                {fieldError("username")}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-[#24432D]"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        clearFieldError("email");
                                    }}
                                    disabled={isSaving}
                                    className={inputClassName}
                                    placeholder="Enter email address"
                                    aria-invalid={Boolean(getFieldError(errors, "email"))}
                                />
                                {fieldError("email")}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="phone"
                                    className="text-sm font-semibold text-[#24432D]"
                                >
                                    Phone number
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={phone}
                                    onChange={(event) => {
                                        setPhone(event.target.value);
                                        clearFieldError("phone");
                                    }}
                                    disabled={isSaving}
                                    className={inputClassName}
                                    placeholder="Enter phone number"
                                    aria-invalid={Boolean(getFieldError(errors, "phone"))}
                                />
                                {fieldError("phone")}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#E6EDE4] bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-xl border border-[#DDE7DC] bg-white px-5 py-3 text-sm font-semibold text-[#526653] transition hover:bg-[#F7F9F4] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}
                            {isSaving ? "Saving changes..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
