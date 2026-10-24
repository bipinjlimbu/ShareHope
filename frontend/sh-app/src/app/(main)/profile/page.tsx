"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProfileUser, ProfileFieldProps } from "@/types/profile";
import type { NGOStatus, NGOUserResponse } from "@/types/ngo";
import {
    deleteProfile,
    getProfile,
    requestEmailVerification,
} from "@/services/profileService";
import { getNGOByUser } from "@/services/ngoService";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import ProfileForm from "@/components/form/ProfileForm";
import NGOPending from "@/components/ngo/NGOPending";
import NGORejected from "@/components/ngo/NGORejected";
import { useToast } from "@/components/ToastProvider";
import { getAuthStatus, setAuthStatus } from "@/lib/authStatus";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

type NGOReviewPage =
    | {
        status: "PENDING";
    }
    | {
        status: "REJECTED";
        rejectionReason?: string;
    }
    | null;

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

function getErrorStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    const response = error as Record<string, unknown>;

    if (typeof response.status === "number") {
        return response.status;
    }

    if (typeof response.status_code === "number") {
        return response.status_code;
    }

    if (
        typeof response.response === "object" &&
        response.response !== null
    ) {
        const nestedResponse = response.response as Record<string, unknown>;

        if (typeof nestedResponse.status === "number") {
            return nestedResponse.status;
        }
    }

    return undefined;
}

function normalizeNGOStatus(
    status: NGOUserResponse["status"] | NGOUserResponse["verification_status"]
): NGOStatus | null {
    if (typeof status !== "string") return null;

    const normalized = status.trim().toUpperCase();

    if (
        normalized === "PENDING" ||
        normalized === "APPROVED" ||
        normalized === "REJECTED"
    ) {
        return normalized;
    }

    return null;
}

function ProfileField({ label, value, icon }: ProfileFieldProps) {
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
    const { showToast } = useToast();

    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [profileError, setProfileError] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isCheckingNGO, setIsCheckingNGO] = useState(false);
    const [ngoPage, setNgoPage] = useState<NGOReviewPage>(null);

    const redirectingRef = useRef(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    const dashboardRoutes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        DONOR: "/dashboard/donor",
        NGO_ADMIN: "/dashboard/ngo-admin",
        NGO_STAFF: "/dashboard/ngo-staff",
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            if (!getAuthStatus()) {
                if (!redirectingRef.current) {
                    redirectingRef.current = true;

                    showToast(
                        "You must be logged in to access your profile.",
                        "error"
                    );

                    router.replace("/login");
                }

                return;
            }

            redirectingRef.current = false;
            setIsAuthChecked(true);
        };

        checkAuthStatus();

        window.addEventListener("auth-change", checkAuthStatus);

        return () => {
            window.removeEventListener("auth-change", checkAuthStatus);
        };
    }, [router, showToast]);

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setProfileError(false);

        try {
            const response = await getProfile();
            setUser(response.user);
        } catch (error: unknown) {
            setProfileError(true);
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (!isAuthChecked) return;

        void loadProfile();
    }, [isAuthChecked, loadProfile]);

    const closeEditForm = useCallback(() => {
        setIsEditOpen(false);
    }, []);

    function handleProfileUpdated(updatedUser: ProfileUser) {
        setUser(updatedUser);
        setIsEditOpen(false);
        showToast("Your profile has been updated successfully.", "success");
    }

    async function handleRequestEmailVerification() {
        if (isSendingOtp || user?.is_verified) return;

        setIsSendingOtp(true);

        try {
            await requestEmailVerification();

            showToast("Verification code sent successfully.", "success");
            router.push("/profile/verify-email");
        } catch (error: unknown) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsSendingOtp(false);
        }
    }

    async function handleDeleteProfile() {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            await deleteProfile();

            setUser(null);
            setIsDeleteOpen(false);
            setAuthStatus(false);

            showToast("Your account has been deleted successfully.", "success");

            router.replace("/");
            router.refresh();
        } catch (error: unknown) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsDeleting(false);
        }
    }

    async function handleDashboardAccess() {
        if (!user || isCheckingNGO) return;

        if (user.role !== "NGO_ADMIN") {
            const dashboardLink = user.role
                ? dashboardRoutes[user.role]
                : undefined;

            if (dashboardLink) {
                router.push(dashboardLink);
            } else {
                showToast(
                    "Dashboard access is unavailable for this account role.",
                    "error"
                );
            }

            return;
        }

        setIsCheckingNGO(true);

        try {
            const ngo = await getNGOByUser();
            const status = normalizeNGOStatus(
                ngo.status ?? ngo.verification_status
            );

            if (status === "APPROVED") {
                router.push("/dashboard/ngo-admin");
                return;
            }

            if (status === "PENDING") {
                setNgoPage({ status: "PENDING" });
                return;
            }

            if (status === "REJECTED") {
                setNgoPage({
                    status: "REJECTED",
                    rejectionReason:
                        typeof ngo.rejection_reason === "string"
                            ? ngo.rejection_reason
                            : undefined,
                });
                return;
            }

            showToast(
                "The NGO review status could not be recognized. Please try again later.",
                "error"
            );
        } catch (error: unknown) {
            if (getErrorStatus(error) === 404) {
                router.push("/register/ngo");
                return;
            }

            showToast(getErrorMessage(error), "error");
        } finally {
            setIsCheckingNGO(false);
        }
    }

    if (!isAuthChecked || isLoading || redirectingRef.current) {
        return <ProfileSkeleton />;
    }

    if (profileError) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F6ED] text-[#166534]">
                        <UserIcon />
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                        Unable to load profile
                    </h1>

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

    if (ngoPage?.status === "PENDING") {
        return (
            <NGOPending
                onBackToProfile={() => setNgoPage(null)}
            />
        );
    }

    if (ngoPage?.status === "REJECTED") {
        return (
            <NGORejected
                rejectionReason={ngoPage.rejectionReason}
                onBackToProfile={() => setNgoPage(null)}
            />
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

    const dashboardLink = user.role
        ? dashboardRoutes[user.role]
        : undefined;

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
                                {user.is_verified ? (
                                    dashboardLink ? (
                                        <button
                                            type="button"
                                            onClick={handleDashboardAccess}
                                            disabled={isCheckingNGO}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isCheckingNGO
                                                ? "Checking NGO status..."
                                                : "Access Dashboard"}
                                        </button>
                                    ) : (
                                        <p className="text-sm leading-5 text-[#718174]">
                                            Dashboard access is unavailable for this account role.
                                        </p>
                                    )
                                ) : (
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
                                    onClick={() => setIsDeleteOpen(true)}
                                    disabled={isDeleting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <TrashIcon />
                                    Delete Account
                                </button>
                            </div>

                            <p className="mt-4 text-center text-xs leading-5 text-[#879487]">
                                Keep your account information up to date.
                            </p>
                        </aside>

                        <div className="min-w-0 space-y-6">
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
                    </div>

                    <p className="mt-6 text-center text-xs text-[#879487]">
                        {user.is_verified
                            ? "Thank you for being part of ShareHope."
                            : "Please verify your email to access your ShareHope dashboard."}
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

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                title="Delete your account?"
                description="This will permanently delete your ShareHope account and remove your access. This action cannot be undone."
                itemName={username}
                confirmText="Delete account"
                isDeleting={isDeleting}
                onConfirm={() => void handleDeleteProfile()}
                onCancel={() => {
                    if (!isDeleting) {
                        setIsDeleteOpen(false);
                    }
                }}
            />
        </>
    );
}