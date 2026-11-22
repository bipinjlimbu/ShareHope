"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Users,
    Search,
    X,
    Mail,
    UserRound,
    UserPlus,
    RefreshCw,
    XCircle,
    BadgeCheck,
} from "lucide-react";
import { getUsers } from "@/services/userService";
import type { User } from "@/types/user";
import NGOStaffInvitationUsersListModalSkeleton from "@/components/skeleton/dashboard/NGOStaffInvitationUsersListModalSkeleton";

interface NGOStaffInvitationUsersListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getMediaUrl(path: string | null): string {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getFullName(user: User): string {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    return fullName || user.username || "Unknown user";
}

function getInitials(user: User): string {
    const fullName = getFullName(user);

    return fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object") {
        const errorObject = error as Record<string, unknown>;

        if (typeof errorObject.message === "string") {
            return errorObject.message;
        }

        if (typeof errorObject.detail === "string") {
            return errorObject.detail;
        }

        if (typeof errorObject.error === "string") {
            return errorObject.error;
        }
    }

    return "Unable to load donor accounts. Please try again.";
}

function DonorProfilePicture({ user }: { user: User }) {
    const [imageFailed, setImageFailed] = useState(false);

    const profilePicture = getMediaUrl(user.profile_picture);

    useEffect(() => {
        setImageFailed(false);
    }, [profilePicture]);

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534]">
            {profilePicture && !imageFailed ? (
                <img
                    src={profilePicture}
                    alt={`${getFullName(user)} profile`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <span className="text-sm font-bold">
                    {getInitials(user)}
                </span>
            )}
        </div>
    );
}

function DonorCard({ user }: { user: User }) {
    return (
        <article className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#E5EDE3] bg-white p-4 transition hover:border-[#C9DFC4] hover:shadow-sm sm:gap-4">
            <DonorProfilePicture user={user} />

            <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-bold text-[#183B2A] sm:text-base">
                    {getFullName(user)}
                </h3>

                <p className="mt-1 truncate text-xs text-[#829184]">
                    @{user.username}
                </p>

                <p className="mt-2 flex min-w-0 items-center gap-1.5 break-all text-xs text-[#647568]">
                    <Mail size={13} className="shrink-0" />
                    {user.email}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#DDE8D7] bg-[#F0F7ED] px-2.5 py-1 text-[11px] font-semibold text-[#35543B]">
                        <UserRound size={12} />
                        Donor
                    </span>

                    {user.is_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F2E1] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                            <BadgeCheck size={12} />
                            Verified
                        </span>
                    )}
                </div>
            </div>

            <button
                type="button"
                disabled
                title="Invitation functionality will be available later"
                className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-xl border border-[#DDE7D9] bg-[#F5F9F2] px-3 py-2.5 text-xs font-semibold text-[#829184] opacity-60 sm:px-4 sm:text-sm"
            >
                <UserPlus size={15} />
                <span className="hidden sm:inline">Invite</span>
            </button>
        </article>
    );
}

export default function NGOStaffInvitationUsersListModal({
    isOpen,
    onClose,
}: NGOStaffInvitationUsersListModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getUsers();

            setUsers(
                Array.isArray(response)
                    ? response.filter((user) => user.role === "DONOR")
                    : []
            );
        } catch (err: unknown) {
            console.error("Failed to load donor users:", err);
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
            return;
        }

        void loadUsers();
    }, [isOpen, loadUsers, retryKey]);

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return users.filter((user) => {
            return [
                user.first_name ?? "",
                user.last_name ?? "",
                user.username ?? "",
                user.email ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }, [users, searchQuery]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102719]/55 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="ngo-staff-invitation-title"
                className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] shadow-2xl sm:rounded-3xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-[#E1E9DC] px-5 py-5 sm:px-7">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <Users size={24} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#27824B]">
                                NGO team management
                            </p>

                            <h2
                                id="ngo-staff-invitation-title"
                                className="mt-1 break-words text-xl font-bold text-[#183B2A] sm:text-2xl"
                            >
                                Donor Accounts
                            </h2>

                            <p className="mt-1 text-sm text-[#718071]">
                                Browse registered donor accounts for your NGO team.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close donor list"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#617263] transition hover:bg-[#EAF2E5] hover:text-[#183B2A]"
                    >
                        <X size={21} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-base font-bold text-[#183B2A]">
                                Available Donors
                            </h3>

                            {!isLoading && !error && (
                                <p className="mt-1 text-sm text-[#718071]">
                                    {filteredUsers.length.toLocaleString("en-NP")}{" "}
                                    of {users.length.toLocaleString("en-NP")}{" "}
                                    donor accounts
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-5">
                        <Search
                            size={19}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                        />

                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            placeholder="Search donor name, username or email..."
                            aria-label="Search donors"
                            className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-white pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] transition hover:bg-[#E5F2E1]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <NGOStaffInvitationUsersListModalSkeleton />
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-5"
                        >
                            <div className="flex items-start gap-3">
                                <XCircle
                                    size={22}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <h3 className="font-bold text-red-800">
                                        Unable to load donor accounts
                                    </h3>

                                    <p className="mt-2 break-words text-sm leading-6 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setRetryKey((current) => current + 1)
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                            >
                                <RefreshCw size={15} />
                                Try again
                            </button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-14 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Search size={25} />
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                {users.length === 0
                                    ? "No Donor Accounts Found"
                                    : "No Matching Donors"}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {users.length === 0
                                    ? "Registered donor accounts will appear here when they are available."
                                    : "No donor accounts match your search. Try another name, username or email address."}
                            </p>

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredUsers.map((user) => (
                                <DonorCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-[#E1E9DC] bg-[#F7F9F3] px-5 py-4 sm:px-7">
                    <p className="text-xs text-[#829184]">
                        Showing donor accounts only
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Close
                    </button>
                </footer>
            </section>
        </div>
    );
}
