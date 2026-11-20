"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    Mail,
    Search,
    UserPlus,
    UserRoundPlus,
    Eye,
    UserMinus,
    RefreshCw,
} from "lucide-react";
import { getNGOStaff } from "@/services/ngoService";
import { NGOMembership, NGOStaffResponse } from "@/types/ngo";
import { User } from "@/types/user";
import StaffManagementSkeleton from "@/components/skeleton/ngo-admin-dashboard/StaffManagementSkeleton";

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

function StaffImage({ user }: { user: User }) {
    const [imageError, setImageError] = useState(false);

    const picture = getProfilePictureUrl(user.profile_picture);

    return (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE9D8] bg-[#E5F2E1]">
            {picture && !imageError ? (
                <img
                    src={picture}
                    alt={getFullName(user)}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="text-lg font-bold text-[#166534]">
                    {getInitials(user)}
                </span>
            )}
        </div>
    );
}

function StaffCard({ membership }: { membership: NGOMembership }) {
    const user = membership.user;

    return (
        <div className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex items-center gap-4">
                <StaffImage user={user} />

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-[#183B2A]">
                        {getFullName(user)}
                    </h3>

                    <p className="mt-1 truncate text-sm text-[#71816F]">
                        @{user.username}
                    </p>

                    <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-sm text-[#71816F]">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1EB] pt-4">
                <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#DCE9D8] bg-[#F7FAF5] px-3 py-2 text-sm font-semibold text-[#789075] opacity-70"
                >
                    <Eye className="h-4 w-4" />
                    View Details
                </button>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-[#DCE9D8] bg-[#F7FAF5] px-3 py-2 text-sm font-semibold text-[#789075] opacity-70"
                    >
                        {membership.is_active ? (
                            <>
                                <UserX className="h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <UserCheck className="h-4 w-4" />
                                Activate
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-400 opacity-60"
                    >
                        <UserMinus className="h-4 w-4" />
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    iconBackground,
    iconColor,
}: {
    title: string;
    value: number;
    description: string;
    icon: React.ElementType;
    iconBackground: string;
    iconColor: string;
}) {
    return (
        <div className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#71816F]">{title}</p>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground}`}
                >
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
            </div>

            <p className="mt-4 text-3xl font-bold tracking-tight text-[#183B2A]">
                {value}
            </p>

            <p className="mt-1 text-xs text-[#8A9A87]">{description}</p>
        </div>
    );
}

export default function NGOStaffPage() {
    const [staff, setStaff] = useState<NGOStaffResponse>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStaff = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getNGOStaff();
            setStaff(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error("Failed to load NGO staff:", err);
            setError("Unable to load staff members. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStaff();
    }, [loadStaff]);

    const totalStaff = staff.length;
    const activeStaff = staff.filter((member) => member.is_active).length;
    const inactiveStaff = totalStaff - activeStaff;

    const filteredStaff = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return staff.filter((membership) => {
            const user = membership.user;
            const fullName = getFullName(user).toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                fullName.includes(normalizedSearch) ||
                (user.first_name ?? "").toLowerCase().includes(normalizedSearch) ||
                (user.last_name ?? "").toLowerCase().includes(normalizedSearch) ||
                user.username.toLowerCase().includes(normalizedSearch) ||
                user.email.toLowerCase().includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && membership.is_active) ||
                (statusFilter === "INACTIVE" && !membership.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [staff, searchTerm, statusFilter]);

    if (isLoading) {
        return <StaffManagementSkeleton />;
    }

    return (
        <div className="min-h-screen bg-[#FFFCF6]">
            <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#E5F2E1] px-3 py-1 text-xs font-bold text-[#166534]">
                                <Users className="h-3.5 w-3.5" />
                                NGO TEAM
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                                Staff Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71816F] sm:text-base">
                                Manage your NGO team members, monitor their
                                membership status, and keep your organization
                                connected.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="rounded-xl border border-[#DCE9D8] bg-[#F7FAF5] px-5 py-3">
                                <p className="text-xs font-semibold text-[#71816F]">
                                    Total Members
                                </p>
                                <p className="mt-1 text-2xl font-bold text-[#166534]">
                                    {totalStaff}
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white opacity-50"
                            >
                                <UserPlus className="h-4 w-4" />
                                Add Staff
                            </button>

                            <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#166534] bg-white px-4 py-3 text-sm font-semibold text-[#166534] opacity-50"
                            >
                                <UserRoundPlus className="h-4 w-4" />
                                Invite Staff
                            </button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Members"
                        value={totalStaff}
                        description="All registered team members"
                        icon={Users}
                        iconBackground="bg-[#E5F2E1]"
                        iconColor="text-[#166534]"
                    />

                    <SummaryCard
                        title="Active Members"
                        value={activeStaff}
                        description="Currently active memberships"
                        icon={UserCheck}
                        iconBackground="bg-green-50"
                        iconColor="text-green-700"
                    />

                    <SummaryCard
                        title="Inactive Members"
                        value={inactiveStaff}
                        description="Currently inactive memberships"
                        icon={UserX}
                        iconBackground="bg-orange-50"
                        iconColor="text-orange-600"
                    />

                    <SummaryCard
                        title="Pending Invitations"
                        value={0}
                        description="Invitation records not connected yet"
                        icon={Mail}
                        iconBackground="bg-amber-50"
                        iconColor="text-amber-600"
                    />
                </section>

                <section className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A87]" />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder="Search by name, username, or email..."
                                className="h-11 w-full rounded-xl border border-[#DCE9D8] bg-[#FFFCF6] pl-10 pr-4 text-sm text-[#183B2A] outline-none transition placeholder:text-[#A0ACA0] focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="h-11 rounded-xl border border-[#DCE9D8] bg-[#FFFCF6] px-4 text-sm font-medium text-[#183B2A] outline-none focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10 sm:w-44"
                        >
                            <option value="ALL">All Members</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </section>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
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
                                onClick={loadStaff}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                                />
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {!error && filteredStaff.length === 0 && (
                    <div className="rounded-2xl border border-[#E8EDE5] bg-white px-5 py-14 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1]">
                            <Users className="h-8 w-8 text-[#166534]" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[#183B2A]">
                            {staff.length === 0
                                ? "No Staff Members Yet"
                                : "No Matching Staff Members"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#71816F]">
                            {staff.length === 0
                                ? "Your NGO staff members will appear here once they have been added to your organization."
                                : "We couldn't find any staff members matching your search or selected filter. Try adjusting your search."}
                        </p>

                        {staff.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("ALL");
                                }}
                                className="mt-5 text-sm font-semibold text-[#166534] hover:text-[#14532D]"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {!error && filteredStaff.length > 0 && (
                    <section>
                        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <h2 className="text-lg font-bold text-[#183B2A]">
                                Your Team Members
                            </h2>

                            <p className="text-sm text-[#71816F]">
                                Showing {filteredStaff.length} of {totalStaff}{" "}
                                members
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredStaff.map((membership) => (
                                <StaffCard
                                    key={membership.id}
                                    membership={membership}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
