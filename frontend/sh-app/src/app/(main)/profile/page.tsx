"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileUser } from "@/types/profile";
import {
    deleteProfile,
    getProfile,
    requestEmailVerification,
} from "@/services/profileService";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import ProfileForm from "@/components/form/ProfileForm";

function formatRole(role?: string) {
    if (!role) return "Member";

    return role
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const response = error as Record<string, unknown>;

        if (typeof response.message === "string") return response.message;
        if (typeof response.detail === "string") return response.detail;
        if (typeof response.error === "string") return response.error;
        if (typeof response.email === "string") return response.email;
    }

    return "Something went wrong. Please try again.";
}

function ProfileField({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string | null;
    icon: ReactNode;
}) {
    return (
        <div className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-[#E6EDE4] bg-white p-4 transition hover:border-[#C8DDC8] sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F6ED] text-[#287341]">
                {icon}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs font-medium text-[#718174]">{label}</p>
                <p className="mt-1.5 break-words text-sm font-semibold text-[#24432D]">
                    {value?.trim() || "Not provided"}
                </p>
            </div>
        </div>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
            <path
                d="m4 7 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M7 3H5a2 2 0 0 0-2 2 16 16 0 0 0 16 16 2 2 0 0 0 2-2v-2l-5-2-2 3a13 13 0 0 1-6-6l3-2-2-5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
                d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function VerifyIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
            <path
                d="m5 12 4 4L19 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
                d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15v5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function ProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileError, setProfileError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [verificationError, setVerificationError] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setProfileError("");

        try {
            const response = await getProfile();
            setUser(response.user);
        } catch (error: unknown) {
            setProfileError(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const closeEditForm = useCallback(() => {
        setIsEditOpen(false);
    }, []);

    function handleProfileUpdated(updatedUser: ProfileUser) {
        setUser(updatedUser);
        setIsEditOpen(false);
    }

    async function handleRequestEmailVerification() {
        if (isSendingOtp || user?.is_verified) return;

        setIsSendingOtp(true);
        setVerificationError("");

        try {
            await requestEmailVerification();
            router.push("/profile/verify-email");
        } catch (error: unknown) {
            setVerificationError(getErrorMessage(error));
        } finally {
            setIsSendingOtp(false);
        }
    }

    async function handleDeleteProfile() {
        if (isDeleting) return;

        setIsDeleting(true);
        setDeleteError("");

        try {
            await deleteProfile();

            setUser(null);
            setIsDeleteOpen(false);

            window.dispatchEvent(new Event("auth-change"));

            router.replace("/");
            router.refresh();
        } catch (error: unknown) {
            setDeleteError(getErrorMessage(error));
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (profileError) {
        return (
            <main className="min-h-[65vh] bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="mx-auto max-w-lg rounded-3xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F6ED] text-[#166534]">
                        <UserIcon />
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                        Unable to load profile
                    </h1>

                    <p role="alert" className="mt-3 text-sm leading-6 text-[#718174]">
                        {profileError}
                    </p>

                    <button
                        type="button"
                        onClick={() => void loadProfile()}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-[65vh] bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="mx-auto max-w-lg rounded-3xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F1E4] text-[#166534]">
                        <UserIcon />
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                        Sign in to view your profile
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#718174]">
                        Log in to see your account information and profile details.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Log in
                    </Link>
                </div>
            </main>
        );
    }

    const username = user.username;

    const fullName = [user.first_name, user.last_name]
        .filter((name) => name?.trim())
        .join(" ");

    const profilePicture =
        typeof user.profile_picture === "string"
            ? user.profile_picture.startsWith("http")
                ? user.profile_picture
                : `${API_URL ?? ""}${user.profile_picture}`
            : null;

    return (
        <>
            <main className="min-h-screen bg-[#FFFCF6] px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[#35A45C]">
                            Account settings
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl">
                            My Profile
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#718174] sm:text-base">
                            Manage your personal details and account information.
                        </p>
                    </div>

                    <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                        <aside className="rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-7">
                            <div className="flex flex-col items-center text-center">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt={`${fullName || username}'s profile`}
                                        className="h-24 w-24 rounded-full border-4 border-[#F0F6ED] bg-[#E4F1E4] object-cover"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#F0F6ED] bg-[#E4F1E4] text-3xl font-extrabold uppercase text-[#166534]">
                                        {(fullName || username).charAt(0) || "U"}
                                    </div>
                                )}

                                <h2 className="mt-4 max-w-full break-words text-xl font-extrabold text-[#14532D]">
                                    {fullName || "Name not provided"}
                                </h2>

                                <p className="mt-1 text-sm text-[#718174]">
                                    {formatRole(user.role)}
                                </p>

                                <span
                                    className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${user.is_verified
                                        ? "border-[#D7E9D5] bg-[#F0F7ED] text-[#287341]"
                                        : "border-[#E8DFC7] bg-[#FAF5E8] text-[#8A7138]"
                                        }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${user.is_verified
                                            ? "bg-[#35A45C]"
                                            : "bg-[#B7A16A]"
                                            }`}
                                    />
                                    {user.is_verified
                                        ? "Verified account"
                                        : "Not verified"}
                                </span>
                            </div>

                            <div className="my-6 border-t border-[#E6EDE4]" />

                            <div className="space-y-3">
                                {!user.is_verified && (
                                    <button
                                        type="button"
                                        onClick={handleRequestEmailVerification}
                                        disabled={isSendingOtp}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#BBD9BC] bg-[#F0F7ED] px-4 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#E4F1E4] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <VerifyIcon />
                                        {isSendingOtp
                                            ? "Sending OTP..."
                                            : "Verify Email"}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeleteError("");
                                        setIsDeleteOpen(true);
                                    }}
                                    disabled={isDeleting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <TrashIcon />
                                    Delete Account
                                </button>

                                {verificationError && (
                                    <p
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                                    >
                                        {verificationError}
                                    </p>
                                )}
                            </div>

                            <p className="mt-4 text-center text-xs leading-5 text-[#879487]">
                                Keep your account information up to date.
                            </p>
                        </aside>

                        <section className="min-w-0 rounded-3xl border border-[#E6EDE4] bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-[#14532D] sm:text-xl">
                                        Personal information
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-[#718174]">
                                        Your details associated with ShareHope.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(true)}
                                    aria-label="Edit profile"
                                    title="Edit profile"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D7E9D5] bg-[#F0F7ED] text-[#287341] transition hover:border-[#A8CCA9] hover:bg-[#E4F1E4] focus:outline-none focus:ring-2 focus:ring-[#35A45C] focus:ring-offset-2"
                                >
                                    <EditIcon />
                                </button>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <ProfileField
                                    label="Username"
                                    value={user.username}
                                    icon={<UserIcon />}
                                />

                                <ProfileField
                                    label="Email address"
                                    value={user.email}
                                    icon={<MailIcon />}
                                />

                                <ProfileField
                                    label="Phone number"
                                    value={user.phone}
                                    icon={<PhoneIcon />}
                                />

                                <ProfileField
                                    label="Account role"
                                    value={formatRole(user.role)}
                                    icon={<ShieldIcon />}
                                />
                            </div>

                            <div className="mt-6 rounded-2xl border border-[#E6EDE4] bg-[#F7F9F4] p-4 sm:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#287341] shadow-sm">
                                        <ShieldIcon />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-[#24432D]">
                                            Account security
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-[#718174]">
                                            {user.is_verified
                                                ? "Your email address is verified. Keep your account information up to date."
                                                : "Verify your email address to help secure your ShareHope account."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <p className="mt-6 text-center text-xs text-[#879487]">
                        Thank you for being part of ShareHope.
                    </p>
                </div>
            </main>

            {isEditOpen && (
                <ProfileForm
                    user={user}
                    apiBaseUrl={API_URL ?? ""}
                    onClose={closeEditForm}
                    onUpdated={handleProfileUpdated}
                />
            )}

            {isDeleteOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 py-8"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isDeleting
                        ) {
                            setIsDeleteOpen(false);
                            setDeleteError("");
                        }
                    }}
                >
                    <section
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-profile-title"
                        aria-describedby="delete-profile-description"
                        className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-[#FFFCF6] p-6 shadow-2xl sm:p-8"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <TrashIcon />
                        </div>

                        <h2
                            id="delete-profile-title"
                            className="mt-5 text-xl font-extrabold text-[#14532D]"
                        >
                            Delete your account?
                        </h2>

                        <p
                            id="delete-profile-description"
                            className="mt-3 text-sm leading-6 text-[#718174]"
                        >
                            This will permanently delete your ShareHope account.
                            This action cannot be undone.
                        </p>

                        {deleteError && (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
                            >
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteOpen(false);
                                    setDeleteError("");
                                }}
                                disabled={isDeleting}
                                className="rounded-xl border border-[#DDE7DC] px-5 py-3 text-sm font-semibold text-[#31523C] transition hover:bg-[#EDF5EC] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteProfile}
                                disabled={isDeleting}
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeleting
                                    ? "Deleting account..."
                                    : "Delete account"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}