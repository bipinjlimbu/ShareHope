"use client";

import { useMemo, useState } from "react";
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ImageIcon,
    Layers3,
    LoaderCircle,
    PencilLine,
    Search,
    X,
    XCircle,
} from "lucide-react";

import type { PendingNGOChange } from "@/types/ngo";

interface PendingNGOChangesSectionProps {
    pendingChanges: PendingNGOChange[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onViewDetails: (changeId: number) => void;
    onApprove: (change: PendingNGOChange) => void;
    approvingId: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getNGOLogoUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value: string): string {
    if (!value) return "Not specified";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function getRequesterName(change: PendingNGOChange): string {
    const firstName = change.submitted_by?.first_name?.trim() ?? "";
    const lastName = change.submitted_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || change.submitted_by?.username || "Unknown user";
}

function getRelatedNGOId(change: PendingNGOChange): number {
    return typeof change.ngo === "number" ? change.ngo : change.ngo.id;
}

function getRelatedNGOName(change: PendingNGOChange): string {
    return typeof change.ngo === "number" ? "" : change.ngo.name;
}

function PendingStatusBadge() {
    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock3 size={13} className="shrink-0" />
            <span>Edit Pending</span>
        </span>
    );
}

function DisabledAction({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 opacity-55"
        >
            {children}
        </button>
    );
}

function PendingNGOChangeCard({
    change,
    onViewDetails,
    onApprove,
    approvingId,
}: {
    change: PendingNGOChange;
    onViewDetails: (changeId: number) => void;
    onApprove: (change: PendingNGOChange) => void;
    approvingId: number | null;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const logoUrl = getNGOLogoUrl(change.ngo_logo);

    const isApproving = approvingId === change.id;
    const isApprovalInProgress = approvingId !== null;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex min-w-0 items-start gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EAF3E5] text-[#166534] sm:h-24 sm:w-24">
                    {logoUrl && !imageFailed ? (
                        <img
                            src={logoUrl}
                            alt={`${change.name} logo`}
                            className="h-full w-full object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <ImageIcon size={30} strokeWidth={1.5} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <PendingStatusBadge />

                        <span className="rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-semibold text-[#526B56]">
                            NGO Profile Edit
                        </span>
                    </div>

                    <h3 className="mt-3 break-words text-lg font-bold leading-6 text-[#183B2A] sm:text-xl">
                        {change.name || "Unnamed NGO"}
                    </h3>

                    <p className="mt-1 text-xs text-[#829184]">
                        NGO #{getRelatedNGOId(change)} · Request #{change.id}
                    </p>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 pt-5 sm:p-6 sm:pt-5">
                <div className="rounded-xl border border-[#E5EDE3] bg-[#FAFCF8] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#647568]">
                        <Layers3 size={15} className="text-[#27824B]" />
                        Registration Details
                    </div>

                    <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                        Registration No. {change.registration_number || "Not provided"}
                    </p>

                    {change.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#647568]">
                            {change.description}
                        </p>
                    )}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                        <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                            <CalendarDays size={14} />
                            Request Date
                        </p>

                        <p className="mt-1.5 break-words text-sm font-semibold text-[#35543B]">
                            {formatDate(change.submitted_at)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                        <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                            <PencilLine size={14} />
                            Requested By
                        </p>

                        <p className="mt-1.5 break-words text-sm font-semibold text-[#35543B]">
                            {getRequesterName(change)}
                        </p>
                    </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#E5EDE3] bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#647568]">
                        Contact Information
                    </p>

                    <p className="mt-2 break-all text-sm text-[#526B56]">
                        {change.email || "No email provided"}
                    </p>

                    <p className="mt-1 break-words text-sm text-[#526B56]">
                        {change.phone || "No phone provided"}
                    </p>

                    <p className="mt-1 break-words text-sm text-[#526B56]">
                        {change.address || "No address provided"}
                    </p>
                </div>

                <div className="mt-auto pt-5">
                    <div className="mb-4 border-t border-[#EDF2E9] pt-4">
                        <p className="text-xs leading-5 text-[#829184]">
                            An NGO has submitted changes to its existing
                            organization profile. Review the existing and
                            proposed information before processing the request.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => onViewDetails(change.id)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#166534] bg-[#166534] px-3 py-3 text-sm font-semibold text-white transition hover:border-[#124D29] hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                        >
                            <Search size={16} />
                            View Details
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => onApprove(change)}
                                disabled={isApprovalInProgress}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isApproving ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Approve
                                    </>
                                )}
                            </button>

                            <DisabledAction>
                                <XCircle size={16} />
                                Reject
                            </DisabledAction>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function PendingNGOChangesSection({
    pendingChanges,
    searchQuery,
    onSearchChange,
    onViewDetails,
    onApprove,
    approvingId,
}: PendingNGOChangesSectionProps) {
    const filteredChanges = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return pendingChanges;

        return pendingChanges.filter((change) => {
            const searchableText = [
                change.name,
                change.registration_number,
                change.email,
                change.phone,
                change.address,
                change.description,
                change.submitted_by?.username,
                change.submitted_by?.first_name,
                change.submitted_by?.last_name,
                String(change.id),
                String(getRelatedNGOId(change)),
                getRelatedNGOName(change),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [pendingChanges, searchQuery]);

    return (
        <>
            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                <div className="relative min-w-0">
                    <Search
                        size={19}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                    />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search NGO, registration number or requester..."
                        aria-label="Search pending NGO profile changes"
                        className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] transition hover:bg-[#E5F2E1]"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </section>

            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-[#183B2A]">
                        NGO profile change requests
                    </h2>

                    <p className="mt-1 text-sm text-[#647568]">
                        Showing {filteredChanges.length.toLocaleString("en-NP")} of{" "}
                        {pendingChanges.length.toLocaleString("en-NP")} pending
                        edit requests
                    </p>
                </div>

                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDE7D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] sm:self-auto"
                    >
                        <X size={15} />
                        Clear search
                    </button>
                )}
            </div>

            {filteredChanges.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                        <PencilLine size={25} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                        {pendingChanges.length === 0
                            ? "No pending NGO changes"
                            : "No matching change requests"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                        {pendingChanges.length === 0
                            ? "When NGOs request changes to their organization profiles, those requests will appear here."
                            : "Try a different search term."}
                    </p>

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                        >
                            Clear search
                        </button>
                    )}
                </section>
            ) : (
                <section
                    aria-label="Pending NGO profile change requests"
                    className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7"
                >
                    {filteredChanges.map((change) => (
                        <PendingNGOChangeCard
                            key={change.id}
                            change={change}
                            onViewDetails={onViewDetails}
                            onApprove={onApprove}
                            approvingId={approvingId}
                        />
                    ))}
                </section>
            )}
        </>
    );
}
