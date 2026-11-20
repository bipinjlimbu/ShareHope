"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Users,
    UserPlus,
    Mail,
    Search,
    X,
    CheckCircle2,
    Clock3,
    UserX,
    UserMinus,
    RefreshCw,
    Filter,
    ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getNGOStaff } from "@/services/ngoService";
import type { NGOStaffResponse, NGOMembership } from "@/types/ngo";
import type { User } from "@/types/user";

type StaffStatus = "ACTIVE" | "INACTIVE";
type StatusFilter = "ALL" | StaffStatus;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 650;

function getProfilePictureUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getFullName(user: User): string {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    return fullName || user.username;
}

function getInitials(user: User): string {
    const first = user.first_name?.trim().charAt(0) ?? "";
    const last = user.last_name?.trim().charAt(0) ?? "";

    return (
        `${first}${last}`.toUpperCase() ||
        user.username.charAt(0).toUpperCase()
    );
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
}) {
    return (
        <div className="group rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[#647568]">
                        {title}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                        {value.toLocaleString("en-NP")}
                    </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534] transition-colors group-hover:bg-[#D8EBD3]">
                    <Icon size={21} />
                </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#647568]">
                {description}
            </p>
        </div>
    );
}

function StaffImage({ membership }: { membership: NGOMembership }) {
    const user = membership.user;
    const [imageFailed, setImageFailed] = useState(false);

    const picture = getProfilePictureUrl(user.profile_picture);

    return (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#E5F2E1] text-[#166534] sm:h-[72px] sm:w-[72px]">
            {picture && !imageFailed ? (
                <img
                    src={picture}
                    alt={getFullName(user)}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    {user.profile_picture ? (
                        <ImageIcon size={27} strokeWidth={1.5} />
                    ) : (
                        <span className="text-xl font-bold">
                            {getInitials(user)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

function StaffCard({ membership }: { membership: NGOMembership }) {
    const user = membership.user;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex min-w-0 items-center gap-4 p-5 sm:p-6">
                <StaffImage membership={membership} />

                <div className="min-w-0 flex-1">
                    <h3 className="break-words text-lg font-bold leading-6 text-[#183B2A]">
                        {getFullName(user)}
                    </h3>

                    <p className="mt-1 truncate text-sm text-[#829184]">
                        @{user.username}
                    </p>
                </div>
            </div>

            <div className="mx-5 border-t border-[#EDF2E9] sm:mx-6" />

            <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-4">
                <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#E5EDE3] bg-[#FAFCF8] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E5F2E1] text-[#166534]">
                        <Mail size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#829184]">
                            Email Address
                        </p>

                        <p className="mt-0.5 break-all text-sm font-medium text-[#35543B]">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="mt-auto space-y-3 pt-5">
                    <button
                        type="button"
                        disabled
                        title="Staff details functionality will be connected later"
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white opacity-50"
                    >
                        <Search size={16} />
                        View Details
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            disabled
                            title="Staff status management will be available later"
                            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6] px-3 py-2.5 text-sm font-semibold text-[#526B56] opacity-50"
                        >
                            <RefreshCw size={15} />
                            {membership.is_active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                            type="button"
                            disabled
                            title="Staff removal will be available later"
                            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2.5 text-sm font-semibold text-red-400 opacity-50"
                        >
                            <UserMinus size={15} />
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

function StaffSkeleton() {
    return (
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6 2xl:gap-7">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-200 sm:h-[72px] sm:w-[72px]" />

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-5 w-3/4 rounded bg-gray-200" />
                            <div className="h-3 w-1/2 rounded bg-gray-100" />
                        </div>
                    </div>

                    <div className="mt-6 h-16 rounded-xl bg-gray-100" />

                    <div className="mt-5 h-11 rounded-xl bg-gray-100" />

                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="h-10 rounded-xl bg-gray-100" />
                        <div className="h-10 rounded-xl bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function NGOStaffPage() {
    const [staff, setStaff] = useState<NGOStaffResponse>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("ALL");

    const loadStaff = useCallback(async () => {
        setLoading(true);
        setError("");

        const startedAt = Date.now();

        try {
            const result = await getNGOStaff();

            setStaff(Array.isArray(result) ? result : []);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "We couldn't load NGO staff. Please try again.";

            setError(message);
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(
                0,
                MINIMUM_LOADING_TIME - elapsed
            );

            if (remaining > 0) {
                await new Promise<void>((resolve) => {
                    window.setTimeout(resolve, remaining);
                });
            }

            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadStaff();
    }, [loadStaff]);

    const activeCount = staff.filter(
        (member) => member.is_active
    ).length;

    const inactiveCount = staff.filter(
        (member) => !member.is_active
    ).length;

    const filteredStaff = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return staff.filter((membership) => {
            const user = membership.user;

            const searchableValues = [
                getFullName(user),
                user.first_name,
                user.last_name,
                user.email,
                user.username,
            ];

            const matchesSearch =
                !query ||
                searchableValues.some((value) =>
                    value.toLowerCase().includes(query)
                );

            const memberStatus: StaffStatus = membership.is_active
                ? "ACTIVE"
                : "INACTIVE";

            const matchesStatus =
                statusFilter === "ALL" ||
                memberStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [staff, searchQuery, statusFilter]);

    const hasFilters =
        searchQuery.trim() !== "" || statusFilter !== "ALL";

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("ALL");
    };

    if (loading) {
        return (
            <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                <div className="mx-auto w-full max-w-[1600px] space-y-8">
                    <div className="animate-pulse rounded-2xl border border-[#E5EDE3] bg-white p-7 shadow-sm">
                        <div className="h-9 w-64 rounded bg-gray-200" />
                        <div className="mt-4 h-4 max-w-xl rounded bg-gray-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-[#E5EDE3] bg-white p-6"
                            >
                                <div className="h-5 w-28 rounded bg-gray-200" />
                                <div className="mt-4 h-10 w-16 rounded bg-gray-100" />
                                <div className="mt-4 h-3 w-40 rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>

                    <div className="animate-pulse rounded-2xl border border-[#E5EDE3] bg-white p-5">
                        <div className="h-5 w-52 rounded bg-gray-200" />
                        <div className="mt-5 h-12 rounded-xl bg-gray-100" />
                    </div>

                    <StaffSkeleton />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                            Staff Management
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                            Manage your NGO team, monitor staff accounts,
                            and keep track of staff invitations and
                            membership statuses.
                        </p>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <Users size={19} />
                            </div>

                            <div>
                                <p className="text-xl font-bold leading-6 text-[#183B2A]">
                                    {staff.length.toLocaleString("en-NP")}
                                </p>

                                <p className="mt-0.5 whitespace-nowrap text-xs text-[#647568]">
                                    Total members
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:min-w-[155px]">
                            <button
                                type="button"
                                disabled
                                title="Add staff functionality will be connected later"
                                className="inline-flex min-h-[46px] cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white opacity-50 shadow-sm"
                            >
                                <UserPlus size={17} />
                                Add Staff
                            </button>

                            <button
                                type="button"
                                disabled
                                title="Staff invitation functionality will be connected later"
                                className="inline-flex min-h-[46px] cursor-not-allowed items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#C9DFC4] bg-[#F5F9F2] px-5 py-3 text-sm font-semibold text-[#166534] opacity-50"
                            >
                                <Mail size={17} />
                                Invite Staff
                            </button>
                        </div>
                    </div>
                </header>

                <section
                    aria-label="Staff statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    <SummaryCard
                        title="Total Members"
                        value={staff.length}
                        description="All staff accounts associated with your NGO"
                        icon={Users}
                    />

                    <SummaryCard
                        title="Active Staff"
                        value={activeCount}
                        description="Staff members with currently active accounts"
                        icon={CheckCircle2}
                    />

                    <SummaryCard
                        title="Inactive Staff"
                        value={inactiveCount}
                        description="Staff accounts that are currently deactivated"
                        icon={UserX}
                    />

                    <SummaryCard
                        title="Pending Invitations"
                        value={0}
                        description="Invitation records are not connected yet"
                        icon={Clock3}
                    />
                </section>

                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter size={17} className="text-[#27824B]" />

                        <h2 className="text-sm font-bold text-[#183B2A]">
                            Search and Filter Staff
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="relative min-w-0 flex-1">
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
                                placeholder="Search name, username or email address..."
                                aria-label="Search staff"
                                className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
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

                        <div className="xl:w-64">
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as StatusFilter
                                    )
                                }
                                aria-label="Filter staff by status"
                                className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                            >
                                <option value="ALL">All statuses</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-[#183B2A]">
                            Staff Members
                        </h2>

                        <p className="mt-1 text-sm text-[#647568]">
                            Showing{" "}
                            {filteredStaff.length.toLocaleString("en-NP")} of{" "}
                            {staff.length.toLocaleString("en-NP")} staff
                            members
                        </p>
                    </div>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDE7D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] sm:self-auto"
                        >
                            <X size={15} />
                            Clear filters
                        </button>
                    )}
                </div>

                {error ? (
                    <section className="rounded-2xl border border-dashed border-red-200 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                            <RefreshCw size={25} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                            Unable to load staff members
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadStaff()}
                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                        >
                            Try Again
                        </button>
                    </section>
                ) : filteredStaff.length === 0 ? (
                    <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <Search size={25} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                            {staff.length === 0
                                ? "No staff members yet"
                                : "No matching staff members"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                            {staff.length === 0
                                ? "Your organization's staff members will appear here once they are added."
                                : "No staff records match your current search or filters. Try a different search term or adjust your filters."}
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                            >
                                Reset filters
                            </button>
                        )}
                    </section>
                ) : (
                    <section
                        aria-label="Staff members list"
                        className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6 2xl:gap-7"
                    >
                        {filteredStaff.map((member) => (
                            <StaffCard
                                key={member.id}
                                membership={member}
                            />
                        ))}
                    </section>
                )}

                <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                    Manage your NGO team, review staff information, and
                    monitor membership statuses.
                </p>
            </div>
        </main>
    );
}
