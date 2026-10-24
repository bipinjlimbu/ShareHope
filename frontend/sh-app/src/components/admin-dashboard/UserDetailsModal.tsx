"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
    X,
} from "lucide-react";
import { getUserById } from "@/services/userService";
import type { User } from "@/types/user";

interface UserDetailsModalProps {
    userId: number;
    onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getProfilePictureUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getDisplayName(user: User): string {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
    return fullName || user.username;
}

function getInitials(user: User): string {
    const initials = `${user.first_name?.trim().charAt(0) ?? ""}${user.last_name?.trim().charAt(0) ?? ""}`.toUpperCase();
    return initials || user.username.charAt(0).toUpperCase();
}

function formatDate(date: string | null | undefined): string {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kathmandu",
    });
}

function getRoleLabel(role: string): string {
    switch (role) {
        case "ADMIN":
            return "Administrator";
        case "DONOR":
            return "Donor";
        case "NGO_ADMIN":
            return "NGO Administrator";
        case "NGO_STAFF":
            return "NGO Staff";
        default:
            return role.replaceAll("_", " ");
    }
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-[#E5EDE3] bg-[#FFFCF6] p-3.5">
            <p className="text-xs font-medium text-[#829184]">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#183B2A]">
                {value || "Not available"}
            </p>
        </div>
    );
}

function StatusBadge({
    active,
    activeLabel,
    inactiveLabel,
}: {
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
                }`}
        >
            {active ? (
                <CheckCircle2 size={14} />
            ) : (
                <Clock3 size={14} />
            )}
            {active ? activeLabel : inactiveLabel}
        </span>
    );
}

export default function UserDetailsModal({
    userId,
    onClose,
}: UserDetailsModalProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadUser = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const result = await getUserById(userId);
            setUser(result);
        } catch {
            setError("We couldn't load this user's details. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void loadUser();
    }, [loadUser]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const picture = user ? getProfilePictureUrl(user.profile_picture) : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#10291C]/55 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-details-title"
                className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <header className="flex items-center justify-between border-b border-[#E5EDE3] bg-white px-5 py-4 sm:px-7">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#35A45C]">
                            User management
                        </p>
                        <h2
                            id="user-details-title"
                            className="mt-1 text-xl font-bold text-[#183B2A]"
                        >
                            User details
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close user details"
                        className="rounded-xl border border-[#E5EDE3] p-2.5 text-[#647568] transition hover:bg-[#E5F2E1] hover:text-[#166534]"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="overflow-y-auto p-5 sm:p-7">
                    {loading ? (
                        <div
                            role="status"
                            className="space-y-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 animate-pulse rounded-2xl bg-[#E5EDE3]" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-2/3 animate-pulse rounded-lg bg-[#E5EDE3]" />
                                    <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[#E5EDE3]" />
                                    <div className="h-4 w-1/3 animate-pulse rounded-lg bg-[#E5EDE3]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {Array.from({ length: 8 }, (_, index) => (
                                    <div
                                        key={index}
                                        className="h-[76px] animate-pulse rounded-xl bg-[#E5EDE3]"
                                    />
                                ))}
                            </div>

                            <p className="text-center text-sm text-[#647568]">
                                Loading user information...
                            </p>
                        </div>
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
                        >
                            <AlertCircle
                                size={32}
                                className="mx-auto text-red-600"
                            />

                            <h3 className="mt-3 font-bold text-red-900">
                                Unable to load details
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-red-800">
                                {error}
                            </p>

                            <div className="mt-5 flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => void loadUser()}
                                    className="rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                                >
                                    Try again
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : user ? (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 rounded-2xl border border-[#D8E8D4] bg-white p-5 sm:flex-row sm:items-center">
                                {picture ? (
                                    <img
                                        src={picture}
                                        alt={`${getDisplayName(user)} profile`}
                                        className="h-20 w-20 shrink-0 rounded-2xl border border-[#E5EDE3] object-cover"
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-2xl font-bold text-[#166534]">
                                        {getInitials(user)}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words text-xl font-bold text-[#183B2A]">
                                        {getDisplayName(user)}
                                    </h3>

                                    <p className="mt-1 break-all text-sm text-[#647568]">
                                        @{user.username}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="rounded-full bg-[#E5F2E1] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                                            {getRoleLabel(user.role)}
                                        </span>

                                        <StatusBadge
                                            active={user.is_active}
                                            activeLabel="Active"
                                            inactiveLabel="Inactive"
                                        />

                                        <StatusBadge
                                            active={user.is_verified}
                                            activeLabel="Verified"
                                            inactiveLabel="Unverified"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#183B2A]">
                                    <UserRound size={17} className="text-[#35A45C]" />
                                    Personal information
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <DetailRow
                                        label="First name"
                                        value={user.first_name || "Not provided"}
                                    />

                                    <DetailRow
                                        label="Last name"
                                        value={user.last_name || "Not provided"}
                                    />

                                    <DetailRow
                                        label="Username"
                                        value={user.username}
                                    />

                                    <DetailRow
                                        label="Email address"
                                        value={user.email}
                                    />

                                    <DetailRow
                                        label="Phone number"
                                        value={user.phone || "Not provided"}
                                    />

                                    <DetailRow
                                        label="User ID"
                                        value={String(user.id)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#183B2A]">
                                    <ShieldCheck size={17} className="text-[#35A45C]" />
                                    Account information
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <DetailRow
                                        label="Account role"
                                        value={getRoleLabel(user.role)}
                                    />

                                    <DetailRow
                                        label="Email verification"
                                        value={user.is_verified ? "Verified" : "Not verified"}
                                    />

                                    <DetailRow
                                        label="Account status"
                                        value={user.is_active ? "Active" : "Inactive"}
                                    />

                                    <DetailRow
                                        label="Staff permissions"
                                        value={user.is_staff ? "Staff account" : "Standard account"}
                                    />

                                    <DetailRow
                                        label="Superuser access"
                                        value={user.is_superuser ? "Enabled" : "Disabled"}
                                    />

                                    <DetailRow
                                        label="Joined ShareHope"
                                        value={formatDate(user.date_joined)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#183B2A]">
                                    <CalendarDays size={17} className="text-[#35A45C]" />
                                    Account activity
                                </h3>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <DetailRow
                                        label="Last login"
                                        value={formatDate(user.last_login)}
                                    />

                                    <DetailRow
                                        label="Profile picture"
                                        value={user.profile_picture ? "Uploaded" : "Not uploaded"}
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-[#D8E8D4] bg-[#E5F2E1]/60 p-4">
                                <Mail
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#166534]"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[#183B2A]">
                                        User account information
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#647568]">
                                        These details are retrieved from the user detail API. Passwords, tokens, OTPs, and password-reset secrets are intentionally not displayed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <footer className="flex justify-end border-t border-[#E5EDE3] bg-white px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                    >
                        Close details
                    </button>
                </footer>
            </section>
        </div>
    );
}