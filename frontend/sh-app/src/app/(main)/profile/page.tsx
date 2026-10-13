"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AuthUser } from "@/types/auth";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";

type ProfileUser = AuthUser & {
    email?: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
    profile_picture?: string | null;
};

function getStoredUser(): ProfileUser | null {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

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
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <div className="rounded-2xl border border-[#E6EDE4] bg-white p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718174]">
                {label}
            </p>
            <p className="mt-2 break-words text-sm font-semibold text-[#24432D]">
                {value?.trim() || "Not provided"}
            </p>
        </div>
    );
}

export default function ProfilePage() {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setUser(getStoredUser());
        setIsLoading(false);
    }, []);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "");

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return (
            <main className="min-h-[65vh] bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="mx-auto max-w-lg rounded-3xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E4F1E4] text-[#166534]">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-8 w-8"
                            aria-hidden="true"
                        >
                            <path
                                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                        Sign in to view your profile
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#718174]">
                        Log in to see your account information and profile
                        details.
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

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-10 sm:px-8 sm:py-14">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold text-[#35A45C]">
                        Your account
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl">
                        My Profile
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718174] sm:text-base">
                        View your personal information and account details
                        on ShareHope.
                    </p>
                </div>

                <section className="overflow-hidden rounded-3xl border border-[#E6EDE4] bg-white shadow-sm">
                    <div className="h-32 bg-gradient-to-r from-[#14532D] via-[#166534] to-[#35A45C] sm:h-40" />

                    <div className="px-5 pb-7 sm:px-8 sm:pb-9">
                        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:gap-6">
                            {user?.profile_picture ? (
                                <img
                                    src={`${API_URL}${user.profile_picture}`}
                                    alt={`${username}'s profile`}
                                    className="h-24 w-24 rounded-3xl border-4 border-white bg-[#E4F1E4] object-cover shadow-sm sm:h-28 sm:w-28"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#E4F1E4] text-3xl font-extrabold uppercase text-[#166534] shadow-sm sm:h-28 sm:w-28 sm:text-4xl">
                                    {username.charAt(0) || "U"}
                                </div>
                            )}

                            <div className="min-w-0 flex-1 pb-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="break-words text-2xl font-extrabold text-[#14532D]">
                                        {username}
                                    </h2>

                                    {user.is_verified && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E4F1E4] px-3 py-1 text-xs font-bold text-[#166534]">
                                            <svg
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="m5 10 3 3 7-7"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            Verified
                                        </span>
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-[#718174]">
                                    {formatRole(user.role)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-9 border-t border-[#E6EDE4] pt-7">
                            <div className="mb-5">
                                <h3 className="text-lg font-bold text-[#14532D]">
                                    Personal information
                                </h3>
                                <p className="mt-1 text-sm text-[#718174]">
                                    Your account details in one place.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <ProfileField
                                    label="Username"
                                    value={user.username}
                                />
                                <ProfileField
                                    label="Email address"
                                    value={user.email}
                                />
                                <ProfileField
                                    label="Phone number"
                                    value={user.phone}
                                />
                                <ProfileField
                                    label="Account role"
                                    value={formatRole(user.role)}
                                />
                            </div>
                        </div>

                        <div className="mt-7 rounded-2xl border border-[#DDE7DC] bg-[#F5F8F1] p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4F1E4] text-[#166534]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
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
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#24432D]">
                                        Account status
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-[#718174]">
                                        {user.is_verified
                                            ? "Your account is verified."
                                            : "Your account is not marked as verified yet."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <p className="mt-5 text-center text-xs leading-5 text-[#879487]">
                    Your profile information is displayed from your saved
                    account details.
                </p>
            </div>
        </main>
    );
}