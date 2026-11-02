"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Coins,
    ImageIcon,
    Package,
    Search,
    Target,
    X,
    XCircle,
    Layers3,
} from "lucide-react";
import type {
    Campaign,
    CampaignDonationType,
} from "@/types/campaign";

type DonationTypeFilter = "ALL" | CampaignDonationType;

interface PendingCampaignsSectionProps {
    campaigns: Campaign[];
    searchQuery: string;
    donationTypeFilter: DonationTypeFilter;
    onSearchChange: (value: string) => void;
    onDonationTypeFilterChange: (value: DonationTypeFilter) => void;
    onViewDetails: (id: number) => void;
    onApprove: (campaign: Campaign) => void;
    onReject: (campaign: Campaign) => void;
    isApproving: boolean;
    isRejecting: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getCampaignImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
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

function formatAmount(amount: string | null, currency: string): string {
    if (amount === null || amount === "") {
        return "No fund goal";
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        return `${currency} ${amount}`;
    }

    return `${currency} ${numericAmount.toLocaleString("en-NP", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function getDonationTypeLabel(type: CampaignDonationType): string {
    switch (type) {
        case "FUND":
            return "Funds";
        case "ITEM":
            return "Physical Items";
        case "BOTH":
            return "Funds and Items";
        default:
            return "Unknown";
    }
}

function getCreatorName(campaign: Campaign): string {
    const firstName = campaign.created_by?.first_name?.trim() ?? "";
    const lastName = campaign.created_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || campaign.created_by?.username || "Unknown user";
}

function getGoalDescription(campaign: Campaign): string {
    const parts: string[] = [];

    if (
        campaign.donation_type === "FUND" ||
        campaign.donation_type === "BOTH"
    ) {
        if (campaign.goal_amount !== null) {
            parts.push(
                `Fund goal: ${formatAmount(
                    campaign.goal_amount,
                    campaign.currency
                )}`
            );
        }
    }

    if (
        campaign.donation_type === "ITEM" ||
        campaign.donation_type === "BOTH"
    ) {
        if (campaign.goal_quantity !== null) {
            const itemName = campaign.goal_item_name?.trim();

            parts.push(
                `Item goal: ${campaign.goal_quantity.toLocaleString("en-NP")}${itemName ? ` ${itemName}` : " items"
                }`
            );
        }
    }

    return parts.length > 0 ? parts.join(" · ") : "No goal specified";
}

function PendingStatusBadge() {
    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <Clock3 size={13} className="shrink-0" />
            <span>Pending Approval</span>
        </span>
    );
}

function CampaignImage({ campaign }: { campaign: Campaign }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = getCampaignImageUrl(campaign.campaign_image);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign.campaign_image]);

    return (
        <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-[#E5F2E1] text-[#166534] sm:w-40">
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={campaign.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={30} strokeWidth={1.5} />
                </div>
            )}
        </div>
    );
}

export default function PendingCampaignsSection({
    campaigns,
    searchQuery,
    donationTypeFilter,
    onSearchChange,
    onDonationTypeFilterChange,
    onViewDetails,
    onApprove,
    onReject,
    isApproving,
    isRejecting,
}: PendingCampaignsSectionProps) {
    const filteredCampaigns = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const matchesDonationType =
                donationTypeFilter === "ALL" ||
                campaign.donation_type === donationTypeFilter;

            const searchableText = [
                campaign.title,
                campaign.description,
                campaign.category,
                campaign.ngo?.name,
                campaign.created_by?.username,
                campaign.created_by?.first_name,
                campaign.created_by?.last_name,
                campaign.goal_item_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesDonationType &&
                searchableText.includes(query)
            );
        });
    }, [campaigns, searchQuery, donationTypeFilter]);

    return (
        <>
            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
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
                                onSearchChange(event.target.value)
                            }
                            placeholder="Search title, category, NGO or creator..."
                            aria-label="Search campaign approvals"
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

                    <div className="xl:w-64">
                        <select
                            value={donationTypeFilter}
                            onChange={(event) =>
                                onDonationTypeFilterChange(
                                    event.target.value as DonationTypeFilter
                                )
                            }
                            aria-label="Filter campaigns by donation type"
                            className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        >
                            <option value="ALL">All donation types</option>
                            <option value="FUND">Funds</option>
                            <option value="ITEM">Physical Items</option>
                            <option value="BOTH">Funds and Items</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0">
                    <h2 className="text-xl font-bold text-[#183B2A]">
                        New campaign submissions
                    </h2>

                    <p className="mt-1 text-sm text-[#647568]">
                        Showing{" "}
                        {filteredCampaigns.length.toLocaleString("en-NP")} of{" "}
                        {campaigns.length.toLocaleString("en-NP")} pending
                        campaigns
                    </p>
                </div>

                {(searchQuery || donationTypeFilter !== "ALL") && (
                    <button
                        type="button"
                        onClick={() => {
                            onSearchChange("");
                            onDonationTypeFilterChange("ALL");
                        }}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDE7D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] sm:self-auto"
                    >
                        <X size={15} />
                        Clear filters
                    </button>
                )}
            </div>

            {filteredCampaigns.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                        <Search size={25} />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                        {campaigns.length === 0
                            ? "No pending campaigns"
                            : "No matching campaigns"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                        {campaigns.length === 0
                            ? "New campaign submissions from NGOs will appear here when they are ready for admin review."
                            : "Try a different search term or change your donation type filter."}
                    </p>

                    {(searchQuery || donationTypeFilter !== "ALL") && (
                        <button
                            type="button"
                            onClick={() => {
                                onSearchChange("");
                                onDonationTypeFilterChange("ALL");
                            }}
                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                        >
                            Reset filters
                        </button>
                    )}
                </section>
            ) : (
                <section
                    aria-label="Pending campaign list"
                    className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7"
                >
                    {filteredCampaigns.map((campaign) => (
                        <article
                            key={campaign.id}
                            className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md"
                        >
                            <div className="flex min-w-0 items-start gap-4 p-5 pb-0 sm:gap-5 sm:p-6 sm:pb-0">
                                <CampaignImage campaign={campaign} />

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                        <PendingStatusBadge />

                                        <span className="max-w-full truncate rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-semibold text-[#526B56]">
                                            {campaign.category || "Uncategorized"}
                                        </span>
                                    </div>

                                    <div className="mt-3 min-w-0">
                                        <h3 className="break-words text-lg font-bold leading-6 text-[#183B2A] sm:text-xl">
                                            {campaign.title}
                                        </h3>

                                        <p className="mt-1 text-xs text-[#829184]">
                                            Campaign #{campaign.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5EDE3] bg-[#FAFCF8] px-3 py-2 text-xs font-medium text-[#526B56]">
                                        <Package size={14} />
                                        {getDonationTypeLabel(campaign.donation_type)}
                                    </span>

                                    <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#E5EDE3] bg-[#FAFCF8] px-3 py-2 text-xs font-medium text-[#526B56]">
                                        <Layers3 size={14} className="shrink-0" />
                                        <span className="truncate">
                                            {campaign.ngo?.name || "NGO not specified"}
                                        </span>
                                    </span>
                                </div>

                                <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#647568]">
                                        {campaign.donation_type === "FUND" ? (
                                            <Coins size={15} className="text-[#27824B]" />
                                        ) : campaign.donation_type === "ITEM" ? (
                                            <Package size={15} className="text-[#27824B]" />
                                        ) : (
                                            <Target size={15} className="text-[#27824B]" />
                                        )}
                                        Campaign goal
                                    </div>

                                    <p className="mt-2 break-words text-base font-bold leading-6 text-[#183B2A]">
                                        {getGoalDescription(campaign)}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                                        <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                                            <CalendarDays size={14} className="shrink-0" />
                                            Starts
                                        </p>
                                        <p className="mt-1.5 break-words text-sm font-semibold text-[#35543B]">
                                            {formatDate(campaign.start_date)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                                        <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                                            <CalendarDays size={14} className="shrink-0" />
                                            Ends
                                        </p>
                                        <p className="mt-1.5 break-words text-sm font-semibold text-[#35543B]">
                                            {formatDate(campaign.end_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto pt-5">
                                    <div className="mb-4 flex items-center justify-between gap-3 border-t border-[#EDF2E9] pt-4 text-xs text-[#829184]">
                                        <span className="min-w-0 truncate">
                                            Submitted by{" "}
                                            <span className="font-semibold text-[#526B56]">
                                                {getCreatorName(campaign)}
                                            </span>
                                        </span>

                                        <span className="shrink-0">
                                            {formatDate(campaign.created_at)}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewDetails(campaign.id)
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                        >
                                            <Search size={16} />
                                            View Details
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onApprove(campaign)}
                                                disabled={isApproving || isRejecting}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <CheckCircle2 size={16} />
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onReject(campaign)}
                                                disabled={isApproving || isRejecting}
                                                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </>
    );
}