"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Building2,
    CalendarDays,
    CheckCircle2,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldCheck,
    Trash2,
    Users,
    X,
    XCircle,
} from "lucide-react";
import {
    deleteNGO,
    getNGOs,
    updateNGOStatus,
} from "@/services/ngoService";
import type { NGOListItem, NGOStatus } from "@/types/ngo";
import NGOSkeleton from "@/components/skeleton/admin-dashboard/NGOsSkeleton";
import NGODetailsModal from "@/components/admin-dashboard/NGODetailsModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

type StatusFilter = "ALL" | Extract<NGOStatus, "APPROVED" | "REJECTED">;

const statusStyles: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-700",
};

function getNGOLogoUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

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
        statusStyles[normalized] ?? "bg-[#F4F7F0] text-[#536653]";

    const Icon = normalized === "REJECTED" ? XCircle : CheckCircle2;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
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
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof Building2;
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

function NGOLogo({ ngo }: { ngo: NGOListItem }) {
    const [imageFailed, setImageFailed] = useState(false);
    const logoUrl = getNGOLogoUrl(ngo.ngo_logo);

    useEffect(() => {
        setImageFailed(false);
    }, [ngo.ngo_logo]);

    return (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#E5F2E1] text-[#166534]">
            {logoUrl && !imageFailed ? (
                <img
                    src={logoUrl}
                    alt={`${ngo.name} logo`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <Building2 size={26} />
            )}
        </div>
    );
}

export default function AdminNGOsPage() {
    const [ngos, setNgos] = useState<NGOListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [selectedNGOId, setSelectedNGOId] = useState<number | null>(null);

    const [updatingNGOIds, setUpdatingNGOIds] = useState<number[]>([]);
    const [statusUpdateError, setStatusUpdateError] = useState("");
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState("");

    const [selectedDeleteNGO, setSelectedDeleteNGO] =
        useState<NGOListItem | null>(null);
    const [isDeletingNGO, setIsDeletingNGO] = useState(false);

    const fetchNGOs = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setError(null);

        try {
            const response = await getNGOs();

            setNgos(
                Array.isArray(response)
                    ? response.filter((ngo) => {
                        const status = ngo.status?.toUpperCase();
                        return status === "APPROVED" || status === "REJECTED";
                    })
                    : []
            );
        } catch (err: unknown) {
            console.error("Failed to fetch NGOs:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load NGO records. Please try again."
            );
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, MINIMUM_LOADING_TIME - elapsed);

            if (remaining > 0) {
                await new Promise<void>((resolve) => {
                    window.setTimeout(resolve, remaining);
                });
            }

            setIsLoading(false);
        }
    }, []);

    const handleToggleNGOStatus = useCallback(
        async (ngo: NGOListItem) => {
            if (updatingNGOIds.includes(ngo.id)) return;

            const nextIsActive = !ngo.is_active;

            setStatusUpdateError("");
            setStatusUpdateSuccess("");
            setUpdatingNGOIds((current) => [...current, ngo.id]);

            try {
                const response = await updateNGOStatus(ngo.id, {
                    is_active: nextIsActive,
                });

                setNgos((currentNGOs) =>
                    currentNGOs.map((currentNGO) =>
                        currentNGO.id === ngo.id
                            ? {
                                ...currentNGO,
                                is_active: nextIsActive,
                            }
                            : currentNGO
                    )
                );

                setStatusUpdateSuccess(
                    response.message ||
                    (nextIsActive
                        ? `${ngo.name} activated successfully.`
                        : `${ngo.name} deactivated successfully.`)
                );
            } catch (err: unknown) {
                console.error("Failed to update NGO status:", err);

                setStatusUpdateError(
                    err instanceof Error
                        ? err.message
                        : "Unable to update the NGO status. Please try again."
                );
            } finally {
                setUpdatingNGOIds((current) =>
                    current.filter((id) => id !== ngo.id)
                );
            }
        },
        [updatingNGOIds]
    );

    const handleDeleteNGO = useCallback(async () => {
        if (!selectedDeleteNGO || isDeletingNGO) return;

        const ngoToDelete = selectedDeleteNGO;

        setStatusUpdateError("");
        setStatusUpdateSuccess("");
        setIsDeletingNGO(true);

        try {
            const response = await deleteNGO(ngoToDelete.id);

            setNgos((currentNGOs) =>
                currentNGOs.filter((ngo) => ngo.id !== ngoToDelete.id)
            );

            setSelectedDeleteNGO(null);

            setStatusUpdateSuccess(
                response?.message ||
                `${ngoToDelete.name} deleted successfully.`
            );
        } catch (err: unknown) {
            console.error("Failed to delete NGO:", err);

            setSelectedDeleteNGO(null);

            setStatusUpdateError(
                err instanceof Error
                    ? err.message
                    : `Unable to delete ${ngoToDelete.name}. Please try again.`
            );
        } finally {
            setIsDeletingNGO(false);
        }
    }, [selectedDeleteNGO, isDeletingNGO]);

    useEffect(() => {
        void fetchNGOs();
    }, [fetchNGOs]);

    const filteredNGOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return ngos.filter((ngo) => {
            const status = ngo.status?.toUpperCase();

            if (status !== "APPROVED" && status !== "REJECTED") {
                return false;
            }

            const matchesStatus =
                statusFilter === "ALL" || status === statusFilter;

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

    const approvedCount = ngos.filter(
        (ngo) => ngo.status?.toUpperCase() === "APPROVED"
    ).length;

    const rejectedCount = ngos.filter(
        (ngo) => ngo.status?.toUpperCase() === "REJECTED"
    ).length;

    const activeCount = ngos.filter((ngo) => ngo.is_active).length;

    if (isLoading) {
        return <NGOSkeleton />;
    }

    return (
        <>
            <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                <div className="mx-auto w-full max-w-[1600px] space-y-0">
                    <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                NGO Management
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                                Manage approved and rejected organizations and
                                their registration records.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 text-sm text-[#183B2A] sm:self-auto">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <Building2 size={19} />
                            </div>

                            <div>
                                <p className="text-xl font-bold leading-6">
                                    {ngos.length.toLocaleString("en-NP")}
                                </p>
                                <p className="mt-0.5 text-xs text-[#647568]">
                                    Reviewed NGOs
                                </p>
                            </div>
                        </div>
                    </header>

                    {error && (
                        <div
                            role="alert"
                            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-start gap-2">
                                <XCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="font-semibold">
                                        Could not load NGO records
                                    </p>
                                    <p className="mt-1 break-words">{error}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => void fetchNGOs()}
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
                            <span>{statusUpdateError}</span>
                        </div>
                    )}

                    {statusUpdateSuccess && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-2 rounded-2xl border border-[#D8E8D4] bg-[#E5F2E1] p-4 text-sm text-[#166534]"
                        >
                            <CheckCircle2 size={19} className="shrink-0" />
                            <span>{statusUpdateSuccess}</span>
                        </div>
                    )}

                    {!error && (
                        <>
                            <section
                                aria-label="NGO statistics"
                                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                            >
                                <SummaryCard
                                    title="Total NGOs"
                                    value={ngos.length}
                                    description="Approved and rejected organizations"
                                    icon={Building2}
                                />

                                <SummaryCard
                                    title="Approved NGOs"
                                    value={approvedCount}
                                    description="Organizations approved by the admin"
                                    icon={CheckCircle2}
                                />

                                <SummaryCard
                                    title="Rejected NGOs"
                                    value={rejectedCount}
                                    description="Organizations rejected by the admin"
                                    icon={XCircle}
                                />

                                <SummaryCard
                                    title="Active NGOs"
                                    value={activeCount}
                                    description="Reviewed organizations currently active"
                                    icon={ShieldCheck}
                                />
                            </section>

                            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                                <div className="flex flex-col gap-3 lg:flex-row">
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
                                            placeholder="Search NGO name, registration number, email or phone..."
                                            aria-label="Search NGOs"
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

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <select
                                            value={statusFilter}
                                            onChange={(event) =>
                                                setStatusFilter(
                                                    event.target.value as StatusFilter
                                                )
                                            }
                                            aria-label="Filter NGOs by status"
                                            className="h-12 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                        >
                                            <option value="ALL">All statuses</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <h2 className="text-xl font-bold text-[#183B2A]">
                                        Registered organizations
                                    </h2>

                                    <p className="mt-1 text-sm text-[#647568]">
                                        Showing {filteredNGOs.length} of{" "}
                                        {ngos.length} organizations
                                    </p>
                                </div>
                            </div>

                            {filteredNGOs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                        <Search size={25} />
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                        {ngos.length === 0
                                            ? "No reviewed NGOs yet"
                                            : "No matching organizations"}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                        {ngos.length === 0
                                            ? "Approved and rejected NGO records will appear here after an admin review."
                                            : "Try changing your search term or selecting a different status."}
                                    </p>

                                    {(searchQuery || statusFilter !== "ALL") && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setStatusFilter("ALL");
                                            }}
                                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                                        >
                                            Reset filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <section
                                    aria-label="Registered NGOs"
                                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                                >
                                    {filteredNGOs.map((ngo) => {
                                        const isUpdating = updatingNGOIds.includes(
                                            ngo.id
                                        );

                                        return (
                                            <article
                                                key={ngo.id}
                                                className="group rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6 lg:p-7"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex min-w-0 items-start gap-4">
                                                        <NGOLogo ngo={ngo} />

                                                        <div className="min-w-0 flex-1 pt-0.5">
                                                            <h3 className="break-words text-lg font-bold text-[#183B2A]">
                                                                {ngo.name}
                                                            </h3>

                                                            <p className="mt-1 text-sm text-[#647568]">
                                                                Registration No.{" "}
                                                                <span className="font-medium text-[#35543B]">
                                                                    {ngo.registration_number ||
                                                                        "Not provided"}
                                                                </span>
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#829184]">
                                                                NGO ID: #{ngo.id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                                        <StatusBadge status={ngo.status} />

                                                        <span
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${ngo.is_active
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-amber-50 text-amber-700"
                                                                }`}
                                                        >
                                                            <span
                                                                className={`h-1.5 w-1.5 rounded-full ${ngo.is_active
                                                                    ? "bg-emerald-500"
                                                                    : "bg-amber-500"
                                                                    }`}
                                                            />
                                                            {ngo.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <Mail
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span className="break-all">
                                                            {ngo.email ||
                                                                "No email provided"}
                                                        </span>
                                                    </p>

                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <Phone
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span className="break-words">
                                                            {ngo.phone ||
                                                                "No phone provided"}
                                                        </span>
                                                    </p>

                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <MapPin
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span className="break-words">
                                                            {ngo.address ||
                                                                "No address provided"}
                                                        </span>
                                                    </p>

                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <CalendarDays
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span>
                                                            Registered{" "}
                                                            {formatDate(ngo.created_at)}
                                                        </span>
                                                    </p>

                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <FileText
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span>
                                                            {ngo.document_count ??
                                                                ngo.documents?.length ??
                                                                0}{" "}
                                                            documents
                                                        </span>
                                                    </p>

                                                    <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                        <Users
                                                            size={15}
                                                            className="mt-0.5 shrink-0 text-[#35A45C]"
                                                        />
                                                        <span>
                                                            {ngo.membership_count ??
                                                                ngo.members?.length ??
                                                                0}{" "}
                                                            members
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="my-5 border-t border-[#EDF2E9]" />

                                                <div className="text-xs text-[#829184]">
                                                    Registered by{" "}
                                                    <span className="font-semibold text-[#526B56]">
                                                        {getDisplayName(ngo)}
                                                    </span>
                                                </div>

                                                <div className="mt-5 space-y-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedNGOId(ngo.id)
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                                    >
                                                        <Building2 size={16} />
                                                        View Details
                                                    </button>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            disabled={isUpdating}
                                                            aria-label={
                                                                ngo.is_active
                                                                    ? `Deactivate ${ngo.name}`
                                                                    : `Activate ${ngo.name}`
                                                            }
                                                            title={
                                                                ngo.is_active
                                                                    ? "Deactivate NGO"
                                                                    : "Activate NGO"
                                                            }
                                                            onClick={() =>
                                                                void handleToggleNGOStatus(
                                                                    ngo
                                                                )
                                                            }
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6] px-3 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#E5F2E1] hover:text-[#166534] disabled:cursor-wait disabled:opacity-60"
                                                        >
                                                            <span
                                                                className={`relative h-4 w-7 shrink-0 rounded-full ${ngo.is_active
                                                                    ? "bg-[#35A45C]"
                                                                    : "bg-[#C9D3C6]"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm ${ngo.is_active
                                                                        ? "right-0.5"
                                                                        : "left-0.5"
                                                                        }`}
                                                                />
                                                            </span>

                                                            {isUpdating
                                                                ? "Updating..."
                                                                : ngo.is_active
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setStatusUpdateError("");
                                                                setStatusUpdateSuccess("");
                                                                setSelectedDeleteNGO(ngo);
                                                            }}
                                                            title={`Delete ${ngo.name}`}
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            <Trash2 size={15} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </section>
                            )}
                        </>
                    )}

                    <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                        Manage reviewed NGO registrations, review organization
                        details, and control account activation.
                    </p>
                </div>
            </main>

            <NGODetailsModal
                isOpen={selectedNGOId !== null}
                ngoId={selectedNGOId}
                onClose={() => setSelectedNGOId(null)}
            />

            <ConfirmationModal
                isOpen={selectedDeleteNGO !== null}
                title="Delete NGO?"
                description="This action cannot be undone. The NGO and its associated records may be permanently deleted."
                itemName={selectedDeleteNGO?.name}
                confirmText="Delete NGO"
                isDeleting={isDeletingNGO}
                buttonColor="bg-[#166534]"
                buttonHoverColor="hover:bg-[#14532D]"
                iconBackgroundColor="bg-[#E5F2E1]"
                iconColor="text-[#166534]"
                onConfirm={() => void handleDeleteNGO()}
                onCancel={() => {
                    if (!isDeletingNGO) {
                        setSelectedDeleteNGO(null);
                    }
                }}
            />
        </>
    );
}