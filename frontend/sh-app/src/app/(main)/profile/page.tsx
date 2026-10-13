
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { ProfileUser } from "@/types/profile";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";

function getStoredUser(): ProfileUser | null {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) return null;

        const parsed: unknown = JSON.parse(storedUser);

        if (
            typeof parsed === "object" &&
            parsed !== null &&
            "username" in parsed &&
            typeof parsed.username === "string"
        ) {
            return parsed as ProfileUser;
        }

        return null;
    } catch {
        return null;
    }
}

function formatRole(role?: string) {
    if (!role) return "Member";

    return role
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
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
                <p className="text-xs font-medium text-[#718174]">
                    {label}
                </p>
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
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

export default function ProfilePage() {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setUser(getStoredUser());
        setIsLoading(false);
    }, []);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    if (isLoading) {
        return <ProfileSkeleton />;
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

                            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D7E9D5] bg-[#F0F7ED] px-3 py-1.5 text-xs font-semibold text-[#287341]">
                                <span
                                    className={`h-2 w-2 rounded-full ${user.is_verified
                                        ? "bg-[#35A45C]"
                                        : "bg-[#B7A16A]"
                                        }`}
                                />
                                {user.is_verified ? "Verified account" : "Not verified"}
                            </span>
                        </div>

                        <div className="my-6 border-t border-[#E6EDE4]" />

                        <div className="space-y-3">
                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                    <path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l0 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Edit Profile
                            </button>

                            <button
                                type="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                                    <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Delete Profile
                            </button>
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

                            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F6ED] text-[#287341] sm:flex">
                                <UserIcon />
                            </div>
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
                                        Your account information is shown here for easy reference. Contact the ShareHope team if you need help with your account.
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
    );
}
