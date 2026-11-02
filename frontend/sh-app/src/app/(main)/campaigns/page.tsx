"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    Coins,
    ImageIcon,
    Layers3,
    Package,
    RefreshCw,
    Search,
    Target,
    X,
} from "lucide-react";
import { getCampaigns } from "@/services/campaignService";
import type {
    Campaign,
    CampaignDonationType,
} from "@/types/campaign";
import CampaignsDataFetchSkeleton from "@/components/skeleton/main/CampaignsDataFetchSkeleton";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

type DonationTypeFilter = "ALL" | CampaignDonationType;

function getCampaignImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
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

function formatAmount(amount: string | null, currency: string): string {
    if (amount === null || amount === "") {
        return "No fund goal";
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
        return `${currency} ${amount}`;
    }

    return `${currency} ${numericAmount.toLocaleString("en-NP", {
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

function getCampaignGoal(campaign: Campaign): string[] {
    const goals: string[] = [];

    if (
        (campaign.donation_type === "FUND" ||
            campaign.donation_type === "BOTH") &&
        campaign.goal_amount !== null
    ) {
        goals.push(
            formatAmount(campaign.goal_amount, campaign.currency)
        );
    }

    if (
        (campaign.donation_type === "ITEM" ||
            campaign.donation_type === "BOTH") &&
        campaign.goal_quantity !== null
    ) {
        const itemName = campaign.goal_item_name?.trim();

        goals.push(
            `${campaign.goal_quantity.toLocaleString("en-NP")} ${itemName || "items"}`
        );
    }

    return goals;
}

function getCampaignProgress(campaign: Campaign): number {
    const progress: number[] = [];

    if (
        (campaign.donation_type === "FUND" ||
            campaign.donation_type === "BOTH") &&
        campaign.goal_amount !== null
    ) {
        const goal = Number(campaign.goal_amount);
        const collected = Number(campaign.collected_amount);

        if (goal > 0 && Number.isFinite(collected)) {
            progress.push((collected / goal) * 100);
        }
    }

    if (
        (campaign.donation_type === "ITEM" ||
            campaign.donation_type === "BOTH") &&
        campaign.goal_quantity !== null &&
        campaign.goal_quantity > 0
    ) {
        progress.push(
            (campaign.collected_quantity / campaign.goal_quantity) * 100
        );
    }

    if (progress.length === 0) return 0;

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                progress.reduce((sum, value) => sum + value, 0) /
                progress.length
            )
        )
    );
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [search, setSearch] = useState("");
    const [donationType, setDonationType] =
        useState<DonationTypeFilter>("ALL");
    const [category, setCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCampaigns = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getCampaigns();

            if (!Array.isArray(response)) {
                throw new Error(
                    "The campaign API returned an unexpected response."
                );
            }

            setCampaigns(
                response.filter(
                    (campaign) =>
                        campaign.status?.toUpperCase() === "ACTIVE"
                )
            );
        } catch (err: unknown) {
            console.error("Failed to load campaigns:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "We couldn't load the campaigns. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCampaigns();
    }, [loadCampaigns]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    campaigns
                        .map((campaign) => campaign.category?.trim())
                        .filter((value): value is string => Boolean(value))
                )
            ).sort((a, b) => a.localeCompare(b)),
        [campaigns]
    );

    const query = search.trim().toLowerCase();

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((campaign) => {
            const matchesDonationType =
                donationType === "ALL" ||
                campaign.donation_type === donationType;

            const matchesCategory =
                category === "ALL" || campaign.category === category;

            const searchableText = [
                campaign.title,
                campaign.description,
                campaign.category,
                campaign.ngo?.name,
                campaign.goal_item_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesDonationType &&
                matchesCategory &&
                searchableText.includes(query)
            );
        });
    }, [campaigns, donationType, category, query]);

    const hasFilters =
        Boolean(search) ||
        donationType !== "ALL" ||
        category !== "ALL";

    const clearFilters = () => {
        setSearch("");
        setDonationType("ALL");
        setCategory("ALL");
    };

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-sm font-semibold text-[#166534]">
                        <Target size={16} />
                        Make a Difference
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                        Explore Campaigns
                        <span className="block text-[#29904C]">
                            Be Part of the Change
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647568] sm:text-base">
                        Discover meaningful campaigns from verified
                        organizations and support the causes that matter
                        to you. Every contribution can make a difference.
                    </p>
                </header>

                <section className="mx-auto mb-10 max-w-3xl">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829184]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search campaigns, causes or organizations..."
                            aria-label="Search campaigns"
                            className="h-12 w-full rounded-2xl border border-[#DDE7D9] bg-white pl-12 pr-11 text-sm text-[#183B2A] shadow-sm outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#647568] transition hover:bg-[#E5F2E1]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <select
                            value={donationType}
                            onChange={(event) =>
                                setDonationType(
                                    event.target.value as DonationTypeFilter
                                )
                            }
                            aria-label="Filter by donation type"
                            className="h-11 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        >
                            <option value="ALL">All donation types</option>
                            <option value="FUND">Funds</option>
                            <option value="ITEM">Physical Items</option>
                            <option value="BOTH">Funds and Items</option>
                        </select>

                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            aria-label="Filter by campaign category"
                            className="h-11 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        >
                            <option value="ALL">All categories</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {loading ? (
                    <CampaignsDataFetchSkeleton />
                ) : error ? (
                    <div
                        role="alert"
                        className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
                    >
                        <AlertCircle
                            size={28}
                            className="mx-auto text-red-600"
                        />

                        <h2 className="mt-3 font-bold text-red-800">
                            Unable to load campaigns
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadCampaigns()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                ) : filteredCampaigns.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <Target size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#183B2A]">
                            {campaigns.length === 0
                                ? "No active campaigns yet"
                                : "No matching campaigns"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                            {campaigns.length === 0
                                ? "There are currently no active campaigns. Please check back later to discover new causes."
                                : "Try changing your search term or filters to find a campaign."}
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-[#183B2A] sm:text-xl">
                                    Discover Campaigns
                                </h2>

                                <p className="mt-1 text-sm text-[#647568]">
                                    Find a cause and make your contribution count.
                                </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                                {filteredCampaigns.length}{" "}
                                {filteredCampaigns.length === 1
                                    ? "campaign"
                                    : "campaigns"}
                            </span>
                        </div>

                        <section
                            aria-label="Active campaigns"
                            className="grid grid-cols-1 gap-6 md:grid-cols-2"
                        >
                            {filteredCampaigns.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))}
                        </section>

                        {hasFilters && (
                            <div className="mt-8 text-center">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-5 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED]"
                                >
                                    <X size={15} />
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = getCampaignImageUrl(campaign.campaign_image);
    const goals = getCampaignGoal(campaign);
    const progress = getCampaignProgress(campaign);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign.campaign_image]);

    return (
        <Link
            href={`/campaigns/${campaign.id}/`}
            aria-label={`View campaign: ${campaign.title}`}
            className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9DFC4] hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#35A45C]/30"
        >
            <div className="relative h-56 w-full overflow-hidden bg-[#E5F2E1] sm:h-64">
                {imageUrl && !imageFailed ? (
                    <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E5F2E1] via-[#F0F7ED] to-[#D8EBD3]">
                        <ImageIcon
                            size={64}
                            strokeWidth={1.2}
                            className="text-[#166534]/50"
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#183B2A]/50 via-transparent to-black/5" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#166534] shadow-sm backdrop-blur-sm">
                    <CheckCircle2 size={13} />
                    Active Campaign
                </span>

                <span className="absolute bottom-4 left-4 rounded-full bg-[#183B2A]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {campaign.category || "General"}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-7">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#29904C]">
                        {campaign.donation_type === "FUND" ? (
                            <Coins size={15} />
                        ) : campaign.donation_type === "ITEM" ? (
                            <Package size={15} />
                        ) : (
                            <Layers3 size={15} />
                        )}

                        {getDonationTypeLabel(campaign.donation_type)}
                    </div>

                    <h2 className="mt-3 break-words text-xl font-bold leading-7 text-[#183B2A] transition-colors group-hover:text-[#166534] sm:text-2xl">
                        {campaign.title}
                    </h2>
                </div>

                <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#647568]">
                        <Target size={15} className="text-[#27824B]" />
                        Campaign Goal
                    </div>

                    {goals.length > 0 ? (
                        <div className="mt-2 space-y-1">
                            {goals.map((goal, index) => (
                                <p
                                    key={index}
                                    className="break-words text-sm font-bold leading-6 text-[#183B2A]"
                                >
                                    {goal}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2 text-sm font-semibold text-[#183B2A]">
                            No specific goal provided
                        </p>
                    )}
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-semibold text-[#526B56]">
                            Collection progress
                        </span>
                        <span className="font-bold text-[#166534]">
                            {progress}%
                        </span>
                    </div>

                    <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5EDE3]"
                        role="progressbar"
                        aria-label="Campaign collection progress"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className="h-full rounded-full bg-[#29904C] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {campaign.donation_type !== "ITEM" && (
                        <p className="mt-2 text-xs text-[#829184]">
                            {formatAmount(
                                campaign.collected_amount,
                                campaign.currency
                            )} collected
                        </p>
                    )}

                    {campaign.donation_type === "ITEM" && (
                        <p className="mt-2 text-xs text-[#829184]">
                            {campaign.collected_quantity.toLocaleString("en-NP")} items collected
                        </p>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EDF2E9] pt-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[#29904C]">
                            <CalendarDays size={14} />
                            <span className="text-xs font-semibold text-[#526B56]">
                                Starts
                            </span>
                        </div>

                        <p className="mt-1.5 break-words text-sm font-medium text-[#526B56]">
                            {formatDate(campaign.start_date)}
                        </p>
                    </div>

                    <div className="min-w-0 border-l border-[#EDF2E9] pl-3">
                        <div className="flex items-center gap-1.5 text-[#29904C]">
                            <CalendarDays size={14} />
                            <span className="text-xs font-semibold text-[#526B56]">
                                Ends
                            </span>
                        </div>

                        <p className="mt-1.5 break-words text-sm font-medium text-[#526B56]">
                            {formatDate(campaign.end_date)}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <div className="flex items-center gap-2 border-t border-[#EDF2E9] pt-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F2E1] text-[#166534]">
                            <Layers3 size={16} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-[11px] text-[#829184]">
                                Organized by
                            </p>
                            <p className="truncate text-sm font-semibold text-[#35543B]">
                                {campaign.ngo?.name || "ShareHope Partner"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
