"use client";

import { useMemo, useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    ImageIcon,
    Layers3,
    PencilLine,
    Search,
    X,
    XCircle,
} from "lucide-react";
import type { PendingCampaignChange } from "@/types/campaign";

interface PendingCampaignChangesSectionProps {
    pendingChanges: PendingCampaignChange[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onViewDetails: (id: number) => void;
}

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
)
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

function getCampaignImageUrl(image: string | null | undefined): string | null {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function formatDate(value: string | null): string {
    if (!value) return "Not specified";

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

function PendingStatusBadge({ label = "Pending Approval" }: { label?: string }) {
    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock3 size={13} className="shrink-0" />
            <span>{label}</span>
        </span>
    );
}

function PlaceholderAction({
    children,
    variant,
    onClick,
}: {
    children: React.ReactNode;
    variant: "primary" | "success" | "danger";
    onClick?: () => void;
}) {
    const styles = {
        primary: "border-[#166534] bg-[#166534] text-white",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        danger: "border-red-200 bg-red-50 text-red-600",
    };

    const className = `inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${styles[variant]} ${onClick
        ? "cursor-pointer transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
        : "cursor-default"
        }`;

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={className}
            >
                {children}
            </button>
        );
    }

    return (
        <span aria-disabled="true" className={className}>
            {children}
        </span>
    );
}

function PendingEditCard({
    change,
    onViewDetails,
}: {
    change: PendingCampaignChange;
    onViewDetails: (id: number) => void;
}) {
    const campaign = change.campaign;
    const [imageFailed, setImageFailed] = useState(false);

    const imageUrl = getCampaignImageUrl(campaign?.campaign_image);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign?.campaign_image]);

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex items-start gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-[#EAF3E5] sm:w-40">
                    {imageUrl && !imageFailed ? (
                        <img
                            src={imageUrl}
                            alt={campaign?.title || "Campaign image"}
                            className="h-full w-full object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#166534]">
                            <ImageIcon size={27} strokeWidth={1.6} />
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <PendingStatusBadge label="Edit Pending" />

                        <span className="rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-semibold text-[#526B56]">
                            Campaign Edit
                        </span>
                    </div>

                    <h3 className="mt-3 break-words text-lg font-bold leading-6 text-[#183B2A] sm:text-xl">
                        {campaign?.title || "Untitled campaign"}
                    </h3>

                    <p className="mt-1 text-xs text-[#829184]">
                        Campaign #{campaign?.id ?? "—"} · Request #{change.id}
                    </p>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 pt-5 sm:p-6 sm:pt-5">
                <div className="rounded-xl border border-[#E5EDE3] bg-[#FAFCF8] p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#647568]">
                        <Layers3 size={15} className="text-[#27824B]" />
                        NGO
                    </div>

                    <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                        {campaign?.ngo?.name || "NGO not specified"}
                    </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
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
                            {change.submitted_by?.first_name ||
                                change.submitted_by?.username ||
                                "Unknown user"}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <div className="mb-4 border-t border-[#EDF2E9] pt-4">
                        <p className="text-xs leading-5 text-[#829184]">
                            An NGO has submitted changes to an existing
                            campaign. Review the proposed modifications before
                            making an approval decision.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <PlaceholderAction
                            variant="primary"
                            onClick={() => onViewDetails(change.id)}
                        >
                            <Search size={16} />
                            View Details
                        </PlaceholderAction>

                        <div className="grid grid-cols-2 gap-3">
                            <PlaceholderAction variant="success">
                                <CheckCircle2 size={16} />
                                Approve
                            </PlaceholderAction>

                            <PlaceholderAction variant="danger">
                                <XCircle size={16} />
                                Reject
                            </PlaceholderAction>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function PendingCampaignChangesSection({
    pendingChanges,
    searchQuery,
    onSearchChange,
    onViewDetails,
}: PendingCampaignChangesSectionProps) {
    const filteredChanges = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return pendingChanges.filter((change) => {
            const searchableText = [
                change.campaign?.title,
                change.campaign?.ngo?.name,
                change.submitted_by?.username,
                change.submitted_by?.first_name,
                change.submitted_by?.last_name,
                String(change.id),
                String(change.campaign?.id),
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
                <div className="relative min-w-0 flex-1">
                    <Search
                        size={19}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                    />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) =>
                            onSearchChange(event.target.value)
                        }
                        placeholder="Search campaign, NGO or requester..."
                        aria-label="Search campaign edit requests"
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
                        Campaign edit requests
                    </h2>

                    <p className="mt-1 text-sm text-[#647568]">
                        Showing{" "}
                        {filteredChanges.length.toLocaleString("en-NP")} of{" "}
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
                            ? "No pending edit requests"
                            : "No matching edit requests"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                        {pendingChanges.length === 0
                            ? "When NGOs request changes to their existing campaigns, those requests will appear here."
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
                    aria-label="Pending campaign edit requests"
                    className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7"
                >
                    {filteredChanges.map((change) => (
                        <PendingEditCard
                            key={change.id}
                            change={change}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </section>
            )}
        </>
    );
}
