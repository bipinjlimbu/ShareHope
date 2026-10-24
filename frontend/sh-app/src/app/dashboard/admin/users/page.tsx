"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode, KeyboardEvent } from "react";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Mail,
    MoreHorizontal,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";
import {
    deleteUser,
    getUsers,
    updateUserStatus,
} from "@/services/userService";
import type { RoleFilter, StatusFilter, User } from "@/types/user";
import UsersSkeleton from "@/components/skeleton/admin-dashboard/UsersSkeleton";
import UserDetailsModal from "@/components/admin-dashboard/UserDetailsModal";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 650;

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

function formatDate(date: string): string {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Unknown";

    return parsedDate.toLocaleDateString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    });
}

function getRoleLabel(role: string): string {
    switch (role) {
        case "DONOR":
            return "Donor";
        case "NGO_ADMIN":
            return "NGO Admin";
        case "NGO_STAFF":
            return "NGO Staff";
        default:
            return role.replaceAll("_", " ");
    }
}

function getInitials(user: User): string {
    const first = user.first_name?.trim().charAt(0) ?? "";
    const last = user.last_name?.trim().charAt(0) ?? "";

    return (
        `${first}${last}`.toUpperCase() ||
        user.username.charAt(0).toUpperCase()
    );
}

function StatCard({
    label,
    value,
    description,
    icon,
}: {
    label: string;
    value: number;
    description: string;
    icon: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#647568]">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#183B2A]">
                        {value.toLocaleString("en-NP")}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-xs text-[#647568]">{description}</p>
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [updatingUserIds, setUpdatingUserIds] = useState<number[]>([]);
    const [statusUpdateError, setStatusUpdateError] = useState("");
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState("");
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError("");

        const startedAt = Date.now();

        try {
            const result = await getUsers();

            setUsers(
                Array.isArray(result)
                    ? result.filter((user) => user.role !== "ADMIN")
                    : []
            );
        } catch {
            setError("We couldn't load users. Please try again.");
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

    const handleToggleUserStatus = useCallback(
        async (user: User) => {
            if (updatingUserIds.includes(user.id)) return;

            const nextIsActive = !user.is_active;

            setStatusUpdateError("");
            setStatusUpdateSuccess("");
            setUpdatingUserIds((current) => [...current, user.id]);

            try {
                const response = await updateUserStatus(
                    user.id,
                    nextIsActive
                );

                setUsers((currentUsers) =>
                    currentUsers.map((currentUser) =>
                        currentUser.id === user.id
                            ? { ...currentUser, is_active: nextIsActive }
                            : currentUser
                    )
                );

                setStatusUpdateSuccess(response.message);
            } catch (err: unknown) {
                setStatusUpdateError(
                    err instanceof Error
                        ? err.message
                        : "We couldn't update the account status. Please try again."
                );
            } finally {
                setUpdatingUserIds((current) =>
                    current.filter((id) => id !== user.id)
                );
            }
        },
        [updatingUserIds]
    );

    const handleDeleteUser = useCallback(async () => {
        if (!userToDelete || isDeletingUser) return;

        const userId = userToDelete.id;

        setDeleteError("");
        setStatusUpdateError("");
        setStatusUpdateSuccess("");
        setIsDeletingUser(true);

        try {
            const response = await deleteUser(userId);

            setUsers((currentUsers) =>
                currentUsers.filter((user) => user.id !== userId)
            );

            setStatusUpdateSuccess(response.message);
            setUserToDelete(null);

            if (selectedUserId === userId) {
                setSelectedUserId(null);
            }
        } catch (err: unknown) {
            setDeleteError(
                err instanceof Error
                    ? err.message
                    : "We couldn't delete this account. Please try again."
            );
        } finally {
            setIsDeletingUser(false);
        }
    }, [userToDelete, isDeletingUser, selectedUserId]);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const searchableValues = [
                getDisplayName(user),
                user.username,
                user.email,
                user.phone ?? "",
            ];

            const matchesSearch =
                !query ||
                searchableValues.some((value) =>
                    value.toLowerCase().includes(query)
                );

            const matchesRole =
                roleFilter === "ALL" || user.role === roleFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && user.is_active) ||
                (statusFilter === "INACTIVE" && !user.is_active);

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const activeCount = users.filter((user) => user.is_active).length;

    const donorCount = users.filter(
        (user) => user.role === "DONOR"
    ).length;

    const ngoAdminCount = users.filter(
        (user) => user.role === "NGO_ADMIN"
    ).length;

    const verifiedCount = users.filter(
        (user) => user.is_verified
    ).length;

    const hasActiveFilters =
        Boolean(search) ||
        roleFilter !== "ALL" ||
        statusFilter !== "ALL";

    const closeUserDetails = useCallback(() => {
        setSelectedUserId(null);
    }, []);

    function handleCardKeyDown(
        event: KeyboardEvent<HTMLElement>,
        userId: number
    ) {
        if (event.target !== event.currentTarget) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedUserId(userId);
        }
    }

    function clearFilters() {
        setSearch("");
        setRoleFilter("ALL");
        setStatusFilter("ALL");
    }

    if (loading) {
        return <UsersSkeleton />;
    }

    return (
        <>
            <main className="min-h-screen bg-[#FFFCF6] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#35A45C]">
                                <Users size={17} />
                                User management
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                Users
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568]">
                                View and manage donor and NGO accounts across ShareHope.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start rounded-xl border border-[#D8E8D4] bg-white px-4 py-3 text-sm text-[#183B2A] sm:self-auto">
                            <Users size={18} className="text-[#35A45C]" />
                            <span>
                                <strong>{users.length}</strong>{" "}
                                user{users.length === 1 ? "" : "s"}
                            </span>
                        </div>
                    </header>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <AlertCircle size={19} className="shrink-0" />
                                {error}
                            </div>

                            <button
                                type="button"
                                onClick={() => void loadUsers()}
                                className="rounded-lg border border-red-200 px-3 py-2 font-semibold transition hover:bg-red-100"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {statusUpdateError && (
                        <div
                            role="alert"
                            className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            <AlertCircle size={19} className="shrink-0" />
                            {statusUpdateError}
                        </div>
                    )}

                    {deleteError && (
                        <div
                            role="alert"
                            className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            <AlertCircle size={19} className="shrink-0" />
                            {deleteError}
                        </div>
                    )}

                    {statusUpdateSuccess && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-2 rounded-2xl border border-[#D8E8D4] bg-[#E5F2E1] p-4 text-sm text-[#166534]"
                        >
                            <CheckCircle2 size={19} className="shrink-0" />
                            {statusUpdateSuccess}
                        </div>
                    )}

                    <section
                        aria-label="User statistics"
                        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    >
                        <StatCard
                            label="Total users"
                            value={users.length}
                            description="Non-admin accounts"
                            icon={<Users size={21} />}
                        />

                        <StatCard
                            label="Donors"
                            value={donorCount}
                            description="Community members who donate"
                            icon={<UserRound size={21} />}
                        />

                        <StatCard
                            label="NGO administrators"
                            value={ngoAdminCount}
                            description="Accounts managing NGO activities"
                            icon={<ShieldCheck size={21} />}
                        />

                        <StatCard
                            label="Verified accounts"
                            value={verifiedCount}
                            description={`${activeCount} accounts currently active`}
                            icon={<CheckCircle2 size={21} />}
                        />
                    </section>

                    <section className="mb-6 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-3 lg:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search
                                    size={19}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search name, username, email or phone..."
                                    aria-label="Search users"
                                    className="h-11 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] hover:bg-[#E5F2E1]"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <select
                                    value={roleFilter}
                                    onChange={(event) =>
                                        setRoleFilter(
                                            event.target.value as RoleFilter
                                        )
                                    }
                                    aria-label="Filter by role"
                                    className="h-11 rounded-xl border border-[#DDE7D9] bg-white px-3 text-sm text-[#183B2A] outline-none focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                >
                                    <option value="ALL">All roles</option>
                                    <option value="DONOR">Donors</option>
                                    <option value="NGO_ADMIN">NGO Admins</option>
                                    <option value="NGO_STAFF">NGO Staff</option>
                                </select>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowFilters((value) => !value)
                                    }
                                    className={`h-11 rounded-xl border px-4 text-sm font-semibold transition ${showFilters
                                        ? "border-[#35A45C] bg-[#E5F2E1] text-[#166534]"
                                        : "border-[#DDE7D9] bg-white text-[#183B2A] hover:bg-[#F5F9F2]"
                                        }`}
                                >
                                    {showFilters ? "Hide filters" : "More filters"}
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="mt-4 border-t border-[#EDF2E9] pt-4">
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#647568]">
                                    Account status
                                </label>

                                <div className="flex flex-wrap gap-2">
                                    {(
                                        [
                                            ["ALL", "All accounts"],
                                            ["ACTIVE", "Active"],
                                            ["INACTIVE", "Inactive"],
                                        ] as const
                                    ).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setStatusFilter(value)}
                                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${statusFilter === value
                                                ? "border-[#166534] bg-[#166534] text-white"
                                                : "border-[#DDE7D9] bg-white text-[#647568] hover:border-[#35A45C] hover:text-[#166534]"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-[#183B2A]">
                                All accounts
                            </h2>

                            <p className="mt-1 text-sm text-[#647568]">
                                Showing {filteredUsers.length} of {users.length} users
                            </p>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-semibold text-[#166534] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {!error && filteredUsers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Search size={25} />
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                No users found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                Try another search term or change your filters to find the account you&apos;re looking for.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                            >
                                Reset filters
                            </button>
                        </div>
                    ) : !error ? (
                        <section
                            aria-label="User accounts"
                            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                        >
                            {filteredUsers.map((user) => {
                                const picture = getProfilePictureUrl(
                                    user.profile_picture
                                );
                                const isUpdating = updatingUserIds.includes(user.id);

                                return (
                                    <article
                                        key={user.id}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`View details for ${getDisplayName(user)}`}
                                        onClick={() => setSelectedUserId(user.id)}
                                        onKeyDown={(event) =>
                                            handleCardKeyDown(event, user.id)
                                        }
                                        className="group cursor-pointer rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                    >
                                        <div className="flex items-start gap-3">
                                            {picture ? (
                                                <img
                                                    src={picture}
                                                    alt={`${getDisplayName(user)} profile`}
                                                    className="h-14 w-14 shrink-0 rounded-2xl border border-[#E5EDE3] object-cover"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-lg font-bold text-[#166534]">
                                                    {getInitials(user)}
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1 pt-0.5">
                                                <h3 className="truncate font-bold text-[#183B2A]">
                                                    {getDisplayName(user)}
                                                </h3>

                                                <p className="mt-1 truncate text-sm text-[#647568]">
                                                    @{user.username}
                                                </p>

                                                <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-[#647568]">
                                                    <Mail
                                                        size={14}
                                                        className="shrink-0 text-[#35A45C]"
                                                    />
                                                    <span className="truncate">
                                                        {user.email}
                                                    </span>
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label={`More options for ${user.username}`}
                                                title="More options not connected"
                                                onClick={(event) => event.stopPropagation()}
                                                className="rounded-lg p-2 text-[#829184] transition hover:bg-[#F0F5ED] hover:text-[#183B2A]"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </div>

                                        <div className="mt-5 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#E5F2E1] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                                                {getRoleLabel(user.role)}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${user.is_active
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${user.is_active
                                                        ? "bg-emerald-500"
                                                        : "bg-amber-500"
                                                        }`}
                                                />
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>

                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${user.is_verified
                                                    ? "bg-sky-50 text-sky-700"
                                                    : "bg-stone-100 text-stone-600"
                                                    }`}
                                            >
                                                {user.is_verified ? (
                                                    <CheckCircle2 size={13} />
                                                ) : (
                                                    <Clock3 size={13} />
                                                )}
                                                {user.is_verified
                                                    ? "Verified"
                                                    : "Unverified"}
                                            </span>
                                        </div>

                                        <div className="my-5 border-t border-[#EDF2E9]" />

                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <div className="min-w-0">
                                                <p className="text-xs text-[#829184]">
                                                    Joined ShareHope
                                                </p>

                                                <p className="mt-1 flex items-center gap-1.5 font-medium text-[#183B2A]">
                                                    <CalendarDays
                                                        size={14}
                                                        className="text-[#35A45C]"
                                                    />
                                                    {formatDate(user.date_joined)}
                                                </p>
                                            </div>

                                            {user.phone && (
                                                <div className="min-w-0 text-right">
                                                    <p className="text-xs text-[#829184]">
                                                        Phone
                                                    </p>
                                                    <p className="mt-1 truncate font-medium text-[#183B2A]">
                                                        {user.phone}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                disabled={isUpdating}
                                                title={
                                                    isUpdating
                                                        ? "Updating account status..."
                                                        : user.is_active
                                                            ? "Deactivate account"
                                                            : "Activate account"
                                                }
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    void handleToggleUserStatus(user);
                                                }}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6] px-3 py-2.5 text-sm font-semibold text-[#829184] transition hover:bg-[#E5F2E1] disabled:cursor-wait disabled:opacity-60"
                                            >
                                                <span
                                                    className={`relative h-4 w-7 rounded-full ${user.is_active
                                                        ? "bg-[#35A45C]"
                                                        : "bg-[#C9D3C6]"
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm ${user.is_active
                                                            ? "right-0.5"
                                                            : "left-0.5"
                                                            }`}
                                                    />
                                                </span>

                                                {isUpdating
                                                    ? "Updating..."
                                                    : user.is_active
                                                        ? "Deactivate"
                                                        : "Activate"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setDeleteError("");
                                                    setUserToDelete(user);
                                                }}
                                                title={`Delete ${user.username}`}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 size={15} />
                                                Delete
                                            </button>
                                        </div>

                                        <p className="mt-4 text-center text-xs font-semibold text-[#35A45C] opacity-0 transition group-hover:opacity-100 group-focus:opacity-100">
                                            Click to view full details
                                        </p>
                                    </article>
                                );
                            })}
                        </section>
                    ) : null}

                    <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                        Account activation and deletion are currently display-only.
                        Connect the relevant admin API endpoints before enabling these actions.
                    </p>
                </div>
            </main>

            {selectedUserId !== null && (
                <UserDetailsModal
                    userId={selectedUserId}
                    onClose={closeUserDetails}
                />
            )}

            <DeleteConfirmationModal
                isOpen={userToDelete !== null}
                title="Delete user account?"
                description="This will permanently delete the selected user account. This action cannot be undone."
                itemName={
                    userToDelete
                        ? `${getDisplayName(userToDelete)} (@${userToDelete.username})`
                        : undefined
                }
                confirmText="Delete account"
                isDeleting={isDeletingUser}
                onConfirm={() => void handleDeleteUser()}
                onCancel={() => {
                    if (!isDeletingUser) {
                        setUserToDelete(null);
                    }
                }}
            />
        </>
    );
}