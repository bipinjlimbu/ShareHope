"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    Users,
    XCircle,
} from "lucide-react";
import { getNGOs } from "@/services/ngoService";
import type { NGOListItem, NGOStatus } from "@/types/ngo";
import NGOSkeleton from "@/components/skeleton/admin-dashboard/NGOSkeleton";

type StatusFilter = "ALL" | NGOStatus;

const statusStyles: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    APPROVED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
};

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function getDisplayName(ngo: NGOListItem): string {
    const firstName = ngo.created_by?.first_name?.trim() ?? "";
    const lastName = ngo.created_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || ngo.created_by?.username || "Unknown user";
}

function getStatusLabel(status: string): string {
    const normalized = status.toLowerCase();

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toUpperCase();
    const className =
        statusStyles[normalized] ??
        "border-[#E1E9DC] bg-[#F4F7F0] text-[#536653]";

    const Icon =
        normalized === "APPROVED"
            ? CheckCircle2
            : normalized === "REJECTED"
                ? XCircle
                : Clock3;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            <Icon size={13} />
            {getStatusLabel(status)}
        </span>
    );
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof Building2;
    iconClassName: string;
}) {
    return (
        <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[#6A796B]">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-[#183B2A]">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-[#7B887B]">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

export default function AdminNGOsPage() {
    const [ngos, setNgos] = useState<NGOListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    const fetchNGOs = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getNGOs();
            setNgos(Array.isArray(response) ? response : []);
        } catch (err: unknown) {
            console.error("Failed to fetch NGOs:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load NGO records. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchNGOs();
    }, [fetchNGOs]);

    const filteredNGOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return ngos.filter((ngo) => {
            const matchesStatus =
                statusFilter === "ALL" ||
                ngo.status?.toUpperCase() === statusFilter;

            const searchableText = [
                ngo.name,
                ngo.registration_number,
                ngo.email,
                ngo.phone,
                ngo.address,
                getDisplayName(ngo),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesStatus && searchableText.includes(query);
        });
    }, [ngos, searchQuery, statusFilter]);

    const pendingCount = ngos.filter(
        (ngo) => ngo.status?.toUpperCase() === "PENDING"
    ).length;

    const approvedCount = ngos.filter(
        (ngo) => ngo.status?.toUpperCase() === "APPROVED"
    ).length;

    const rejectedCount = ngos.filter(
        (ngo) => ngo.status?.toUpperCase() === "REJECTED"
    ).length;

    return (
        <div className="mx-auto max-w-[1600px] space-y-7 pb-8">
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <Link
                        href="/dashboard/admin"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#537257] transition hover:text-[#166534]"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#27824B]">
                        <ShieldCheck size={17} />
                        Administration
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                        NGO Management
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6A796B] sm:text-base">
                        Review registered organizations and keep their
                        registration records organized.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void fetchNGOs()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                >
                    <RefreshCw
                        size={16}
                        className={isLoading ? "animate-spin" : ""}
                    />
                    {isLoading ? "Refreshing..." : "Refresh"}
                </button>
            </section>

            {error && (
                <section
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-5"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <XCircle
                                size={21}
                                className="mt-0.5 shrink-0 text-red-600"
                            />
                            <div>
                                <h2 className="font-semibold text-red-800">
                                    Could not load NGO records
                                </h2>
                                <p className="mt-1 break-words text-sm leading-6 text-red-700">
                                    {error}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => void fetchNGOs()}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                        >
                            Try again
                        </button>
                    </div>
                </section>
            )}

            {isLoading ? (
                <NGOSkeleton />
            ) : !error ? (
                <>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            title="Total NGOs"
                            value={ngos.length}
                            description="All registered organizations"
                            icon={Building2}
                            iconClassName="bg-[#E5F2E1] text-[#166534]"
                        />

                        <SummaryCard
                            title="Pending review"
                            value={pendingCount}
                            description="Awaiting an admin decision"
                            icon={Clock3}
                            iconClassName="bg-amber-50 text-amber-700"
                        />

                        <SummaryCard
                            title="Approved NGOs"
                            value={approvedCount}
                            description="Organizations approved"
                            icon={CheckCircle2}
                            iconClassName="bg-green-50 text-green-700"
                        />

                        <SummaryCard
                            title="Rejected NGOs"
                            value={rejectedCount}
                            description="Organizations not approved"
                            icon={XCircle}
                            iconClassName="bg-red-50 text-red-700"
                        />
                    </section>

                    <section className="space-y-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-[#183B2A]">
                                    Registered organizations
                                </h2>
                                <p className="mt-1 text-sm text-[#6A796B]">
                                    {filteredNGOs.length}{" "}
                                    {filteredNGOs.length === 1
                                        ? "organization"
                                        : "organizations"}{" "}
                                    found
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative min-w-0 sm:min-w-[280px]">
                                    <Search
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B887B]"
                                    />
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Search NGOs..."
                                        aria-label="Search NGOs"
                                        className="w-full rounded-xl border border-[#DDE6D8] bg-[#FFFCF6] py-3 pl-10 pr-4 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA597] focus:border-[#27824B] focus:ring-2 focus:ring-[#27824B]/10"
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value as StatusFilter
                                        )
                                    }
                                    aria-label="Filter NGOs by status"
                                    className="rounded-xl border border-[#DDE6D8] bg-[#FFFCF6] px-4 py-3 text-sm font-medium text-[#35543B] outline-none focus:border-[#27824B] focus:ring-2 focus:ring-[#27824B]/10"
                                >
                                    <option value="ALL">All statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>

                        {filteredNGOs.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#D8E3D3] bg-[#FFFCF6] px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                    <Building2 size={25} />
                                </div>
                                <h3 className="mt-4 font-bold text-[#183B2A]">
                                    {ngos.length === 0
                                        ? "No NGOs registered yet"
                                        : "No matching organizations"}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6A796B]">
                                    {ngos.length === 0
                                        ? "Registered NGOs will appear here when records are available."
                                        : "Try changing your search term or selecting a different status."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 xl:grid-cols-2">
                                {filteredNGOs.map((ngo) => (
                                    <article
                                        key={ngo.id}
                                        className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] transition hover:border-[#C7D9C1] hover:shadow-sm"
                                    >
                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534]">
                                                    <Building2 size={26} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="break-words text-lg font-bold text-[#183B2A]">
                                                            {ngo.name}
                                                        </h3>
                                                        <StatusBadge
                                                            status={ngo.status}
                                                        />
                                                    </div>

                                                    <p className="mt-1 text-sm text-[#6A796B]">
                                                        Registration No.{" "}
                                                        <span className="font-semibold text-[#35543B]">
                                                            {ngo.registration_number ||
                                                                "Not provided"}
                                                        </span>
                                                    </p>

                                                    <p className="mt-2 text-xs text-[#7B887B]">
                                                        NGO ID: #{ngo.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {ngo.description && (
                                                <p className="mt-5 line-clamp-2 text-sm leading-6 text-[#617263]">
                                                    {ngo.description}
                                                </p>
                                            )}

                                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                                <div className="flex min-w-0 items-start gap-2.5">
                                                    <Mail
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-[#4C8154]"
                                                    />
                                                    <span className="break-all text-sm text-[#536653]">
                                                        {ngo.email ||
                                                            "No email provided"}
                                                    </span>
                                                </div>

                                                <div className="flex min-w-0 items-start gap-2.5">
                                                    <Phone
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-[#4C8154]"
                                                    />
                                                    <span className="break-words text-sm text-[#536653]">
                                                        {ngo.phone ||
                                                            "No phone provided"}
                                                    </span>
                                                </div>

                                                <div className="flex min-w-0 items-start gap-2.5 sm:col-span-2">
                                                    <MapPin
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-[#4C8154]"
                                                    />
                                                    <span className="break-words text-sm text-[#536653]">
                                                        {ngo.address ||
                                                            "No address provided"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E8EDE4] pt-4">
                                                <div className="inline-flex items-center gap-2 text-xs text-[#6A796B]">
                                                    <FileText
                                                        size={15}
                                                        className="text-[#4C8154]"
                                                    />
                                                    {ngo.document_count ??
                                                        ngo.documents?.length ??
                                                        0}{" "}
                                                    documents
                                                </div>

                                                <div className="inline-flex items-center gap-2 text-xs text-[#6A796B]">
                                                    <Users
                                                        size={15}
                                                        className="text-[#4C8154]"
                                                    />
                                                    {ngo.membership_count ??
                                                        ngo.members?.length ??
                                                        0}{" "}
                                                    members
                                                </div>

                                                <div className="inline-flex items-center gap-2 text-xs text-[#6A796B]">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-[#4C8154]"
                                                    />
                                                    Submitted{" "}
                                                    {formatDate(ngo.created_at)}
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-col gap-3 border-t border-[#E8EDE4] pt-5 sm:flex-row">
                                                <button
                                                    type="button"
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#BBD4B5] bg-[#F0F7ED] px-4 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#E5F2E1]"
                                                >
                                                    <Building2 size={16} />
                                                    View Full Details
                                                </button>

                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 sm:min-w-[120px]"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-[#E8EDE4] bg-[#F7F9F3] px-5 py-3 sm:px-6">
                                            <p className="text-xs text-[#718071]">
                                                Registered by{" "}
                                                <span className="font-semibold text-[#4D634F]">
                                                    {getDisplayName(ngo)}
                                                </span>
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            ) : null}
        </div>
    );
}