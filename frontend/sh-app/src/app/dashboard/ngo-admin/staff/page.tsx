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
import {
    getNGOStaff,
    updateNGOStaffStatus,
} from "@/services/ngoService";
import { NGOMembership, NGOStaffResponse } from "@/types/ngo";
import { User } from "@/types/user";
import StaffManagementSkeleton from "@/components/skeleton/ngo-admin-dashboard/StaffManagementSkeleton";
import NGOStaffDetailsModal from "@/components/dashboard/NGOStaffDetailsModal";
import RegisterNGOStaffForm from "@/components/form/RegisterNGOStaffForm";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    if (!fullName) {
        return user.username.slice(0, 2).toUpperCase();
    }

    return fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
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
    icon: typeof Users;
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

function StaffImage({ user }: { user: User }) {
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

function StaffCard({
    membership,
    onViewDetails,
    onToggleStatus,
    isUpdating,
}: {
    membership: NGOMembership;
    onViewDetails: (membershipId: number) => void;
    onToggleStatus: (membership: NGOMembership) => void;
    isUpdating: boolean;
}) {
    const user = membership.user;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex min-w-0 items-center gap-4 p-5 sm:p-6">
                <StaffImage user={user} />

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
                        onClick={() => onViewDetails(membership.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        <Search size={16} />
                        View Details
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => onToggleStatus(membership)}
                            disabled={isUpdating}
                            title={
                                membership.is_active
                                    ? "Deactivate this staff member"
                                    : "Activate this staff member"
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${membership.is_active
                                ? "border-[#DDE7D9] bg-[#F8FAF6] text-[#526B56] hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                : "border-[#C9DFC4] bg-[#F5F9F2] text-[#166534] hover:bg-[#E5F2E1]"
                                }`}
                        >
                            {isUpdating ? (
                                <>
                                    <RefreshCw
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={15} />
                                    {membership.is_active
                                        ? "Deactivate"
                                        : "Activate"}
                                </>
                            )}
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

export default function NGOStaffPage() {
    const [staff, setStaff] = useState<NGOStaffResponse>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
    const [updatingStaffId, setUpdatingStaffId] = useState<number | null>(null);

    const loadStaff = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getNGOStaff();

            setStaff(
                Array.isArray(response)
                    ? response.filter((membership) => !membership.is_admin)
                    : []
            );
        } catch (err) {
            console.error("Failed to load NGO staff:", err);
            setError("Unable to load staff members. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadStaff();
    }, [loadStaff]);

    const handleRegistrationSuccess = () => {
        setIsRegisterFormOpen(false);
        void loadStaff();
    };

    const handleToggleStatus = async (membership: NGOMembership) => {
        if (updatingStaffId !== null || membership.is_admin) return;

        const newStatus = !membership.is_active;

        setUpdatingStaffId(membership.id);
        setActionError("");

        try {
            await updateNGOStaffStatus(membership.id, {
                is_active: newStatus,
            });

            setStaff((currentStaff) =>
                currentStaff.map((member) =>
                    member.id === membership.id && !member.is_admin
                        ? {
                            ...member,
                            is_active: newStatus,
                        }
                        : member
                )
            );
        } catch (err) {
            console.error("Failed to update NGO staff status:", err);

            setActionError(
                `Unable to ${newStatus ? "activate" : "deactivate"
                } ${getFullName(membership.user)}. Please try again.`
            );
        } finally {
            setUpdatingStaffId(null);
        }
    };

    const activeCount = staff.filter(
        (member) => !member.is_admin && member.is_active
    ).length;

    const inactiveCount = staff.filter(
        (member) => !member.is_admin && !member.is_active
    ).length;

    const filteredStaff = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return staff.filter((membership) => {
            if (membership.is_admin) return false;

            const user = membership.user;

            const matchesSearch = [
                user.first_name ?? "",
                user.last_name ?? "",
                user.email,
                user.username,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && membership.is_active) ||
                (statusFilter === "INACTIVE" && !membership.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [staff, searchQuery, statusFilter]);

    const hasFilters =
        searchQuery.trim() !== "" || statusFilter !== "ALL";

    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("ALL");
    };

    if (isLoading) {
        return <StaffManagementSkeleton />;
    }

    return (
        <>
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
                                    onClick={() => setIsRegisterFormOpen(true)}
                                    className="inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
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
                            description="All non-admin staff accounts associated with your NGO"
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
                            description="Invitation records not connected yet"
                            icon={Clock3}
                        />
                    </section>

                    {actionError && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
                        >
                            <p>{actionError}</p>

                            <button
                                type="button"
                                onClick={() => setActionError("")}
                                aria-label="Dismiss error"
                                className="shrink-0 rounded-md p-1 text-red-500 transition hover:bg-red-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

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

                    {error ? (
                        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="font-semibold text-red-700">
                                        Something went wrong
                                    </p>

                                    <p className="mt-1 text-sm text-red-600">
                                        {error}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => void loadStaff()}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw size={16} />
                                    Try Again
                                </button>
                            </div>
                        </section>
                    ) : (
                        <>
                            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div className="min-w-0">
                                    <h2 className="text-xl font-bold text-[#183B2A]">
                                        Staff Members
                                    </h2>

                                    <p className="mt-1 text-sm text-[#647568]">
                                        Showing{" "}
                                        {filteredStaff.length.toLocaleString("en-NP")}{" "}
                                        of{" "}
                                        {staff.length.toLocaleString("en-NP")}{" "}
                                        staff members
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

                            {filteredStaff.length === 0 ? (
                                <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                        <Search size={25} />
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                        {staff.length === 0
                                            ? "No Staff Members Yet"
                                            : "No matching staff members"}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                        {staff.length === 0
                                            ? "Your non-admin NGO staff members will appear here once they have been added to your organization."
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
                                    {filteredStaff.map((membership) => (
                                        <StaffCard
                                            key={membership.id}
                                            membership={membership}
                                            onViewDetails={setSelectedStaffId}
                                            onToggleStatus={handleToggleStatus}
                                            isUpdating={
                                                updatingStaffId === membership.id
                                            }
                                        />
                                    ))}
                                </section>
                            )}
                        </>
                    )}

                    <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                        Manage your NGO team, review staff information,
                        and monitor membership statuses.
                    </p>
                </div>
            </main>

            {isRegisterFormOpen && (
                <RegisterNGOStaffForm
                    onClose={() => setIsRegisterFormOpen(false)}
                    onSuccess={handleRegistrationSuccess}
                />
            )}

            {selectedStaffId !== null && (
                <NGOStaffDetailsModal
                    membershipId={selectedStaffId}
                    onClose={() => setSelectedStaffId(null)}
                />
            )}
        </>
    );
}