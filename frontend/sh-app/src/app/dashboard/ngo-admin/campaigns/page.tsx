"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit,
    ImageIcon,
    Layers3,
    Package,
    Search,
    Target,
    Trash2,
    X,
} from "lucide-react";
import { getCampaigns } from "@/services/campaignService";
import type {
    Campaign,
    CampaignDonationType,
    CampaignStatus,
} from "@/types/campaign";
import CampaignDetailsModal from "@/components/ngo-admin-dashboard/CampaignDetailsModal";
import CampaignsSkeleton from "@/components/skeleton/ngo-admin-dashboard/CampaignsSkeleton";
import { useToast } from "@/components/toast/ToastProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

type StatusFilter = "ALL" | CampaignStatus;
type DonationTypeFilter = "ALL" | CampaignDonationType;

const statusStyles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    ACTIVE: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    COMPLETED: "bg-blue-50 text-blue-700",
    CANCELLED: "bg-slate-100 text-slate-600",
};

function getMediaUrl(path: string | null): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value: string | null | undefined): string {
    if (!value) return "Not provided";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Not provided";

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function formatAmount(value: string | number | null | undefined): string {
    const amount = Number(value ?? 0);

    if (!Number.isFinite(amount)) return "0";

    return new Intl.NumberFormat("en-NP", {
        maximumFractionDigits: 2,
    }).format(amount);
}

function getDonationTypeLabel(type: CampaignDonationType): string {
    const labels: Record<CampaignDonationType, string> = {
        FUND: "Funds",
        ITEM: "Items",
        BOTH: "Funds and items",
    };

    return labels[type] ?? String(type);
}

function getStatusLabel(status: string): string {
    const normalized = (status || "UNKNOWN").toLowerCase();

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function getGoalDescription(campaign: Campaign): string {
    const goals: string[] = [];

    if (
        campaign.donation_type === "FUND" ||
        campaign.donation_type === "BOTH"
    ) {
        goals.push(
            `${campaign.currency || "NPR"} ${formatAmount(campaign.goal_amount)}`
        );
    }

    if (
        campaign.donation_type === "ITEM" ||
        campaign.donation_type === "BOTH"
    ) {
        goals.push(
            campaign.goal_quantity != null
                ? `${formatAmount(campaign.goal_quantity)} ${campaign.goal_item_name?.trim() || "items"}`
                : "Item goal not specified"
        );
    }

    return goals.join(" · ") || "Goal not specified";
}

function StatusBadge({ status }: { status: CampaignStatus }) {
    const normalized = String(status || "PENDING").toUpperCase();

    const className =
        statusStyles[normalized] ?? "bg-[#F4F7F0] text-[#536653]";

    const Icon =
        normalized === "ACTIVE" ||
            normalized === "APPROVED" ||
            normalized === "COMPLETED"
            ? CheckCircle2
            : Clock3;

    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            <Icon size={13} />
            {getStatusLabel(normalized)}
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
    icon: typeof Layers3;
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

function CampaignImage({ campaign }: { campaign: Campaign }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = getMediaUrl(campaign.campaign_image);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign.campaign_image]);

    return (
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#E5F2E1] text-[#166534] sm:h-32 sm:w-32">
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon size={30} />
                </div>
            )}
        </div>
    );
}

export default function NGOCampaignsPage() {
    const { showToast } = useToast();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [donationTypeFilter, setDonationTypeFilter] =
        useState<DonationTypeFilter>("ALL");
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
        null
    );

    const fetchCampaigns = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setError(null);

        try {
            const response = await getCampaigns();

            if (!Array.isArray(response)) {
                throw new Error("The server returned an invalid campaign list.");
            }

            setCampaigns(response);
        } catch (err: unknown) {
            console.error("Failed to fetch campaigns:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to load campaigns. Please try again.";

            setError(message);
            showToast(message, "error");
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
    }, [showToast]);

    useEffect(() => {
        void fetchCampaigns();
    }, [fetchCampaigns]);

    const filteredCampaigns = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return campaigns.filter((campaign) => {
            const matchesStatus =
                statusFilter === "ALL" || campaign.status === statusFilter;

            const matchesDonationType =
                donationTypeFilter === "ALL" ||
                campaign.donation_type === donationTypeFilter;

            const searchableText = [
                campaign.title,
                campaign.description,
                campaign.category,
                campaign.status,
                campaign.donation_type,
                campaign.ngo?.name,
                campaign.goal_item_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesStatus &&
                matchesDonationType &&
                searchableText.includes(query)
            );
        });
    }, [campaigns, searchQuery, statusFilter, donationTypeFilter]);

    const activeCount = campaigns.filter(
        (campaign) => campaign.status === "ACTIVE"
    ).length;

    const pendingCount = campaigns.filter(
        (campaign) => campaign.status === "PENDING"
    ).length;

    const completedCount = campaigns.filter(
        (campaign) => campaign.status === "COMPLETED"
    ).length;

    if (isLoading) {
        return <CampaignsSkeleton />;
    }

    return (
        <>
            <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                <div className="mx-auto w-full max-w-[1600px]">
                    <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                Campaigns
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                                Browse your campaign records, review their
                                progress, and open any campaign to see its
                                complete details.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:self-auto">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <Layers3 size={19} />
                            </div>

                            <div>
                                <p className="text-xl font-bold leading-6 text-[#183B2A]">
                                    {campaigns.length.toLocaleString("en-NP")}
                                </p>
                                <p className="mt-0.5 text-xs text-[#647568]">
                                    Total campaigns
                                </p>
                            </div>
                        </div>
                    </header>

                    {error ? (
                        <section
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-white p-6 sm:p-8"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                    <Layers3 size={21} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="font-bold text-[#183B2A]">
                                        Unable to load campaigns
                                    </h2>
                                    <p className="mt-2 break-words text-sm leading-6 text-[#647568]">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => void fetchCampaigns()}
                                        className="mt-4 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <>
                            <section
                                aria-label="Campaign statistics"
                                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                            >
                                <SummaryCard
                                    title="Total campaigns"
                                    value={campaigns.length}
                                    description="All campaigns available in this list"
                                    icon={Layers3}
                                />

                                <SummaryCard
                                    title="Active campaigns"
                                    value={activeCount}
                                    description="Campaigns currently marked active"
                                    icon={CheckCircle2}
                                />

                                <SummaryCard
                                    title="Pending review"
                                    value={pendingCount}
                                    description="Campaigns awaiting a decision"
                                    icon={Clock3}
                                />

                                <SummaryCard
                                    title="Completed campaigns"
                                    value={completedCount}
                                    description="Campaigns marked as completed"
                                    icon={CalendarDays}
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
                                            placeholder="Search campaign, category, NGO..."
                                            aria-label="Search campaigns"
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

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
                                        <select
                                            value={statusFilter}
                                            onChange={(event) =>
                                                setStatusFilter(
                                                    event.target.value as StatusFilter
                                                )
                                            }
                                            aria-label="Filter campaigns by status"
                                            className="h-12 min-w-0 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                        >
                                            <option value="ALL">
                                                All statuses
                                            </option>
                                            <option value="DRAFT">Draft</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="APPROVED">Approved</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="REJECTED">Rejected</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>

                                        <select
                                            value={donationTypeFilter}
                                            onChange={(event) =>
                                                setDonationTypeFilter(
                                                    event.target
                                                        .value as DonationTypeFilter
                                                )
                                            }
                                            aria-label="Filter campaigns by donation type"
                                            className="h-12 min-w-0 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                        >
                                            <option value="ALL">
                                                All donation types
                                            </option>
                                            <option value="FUND">Funds</option>
                                            <option value="ITEM">Items</option>
                                            <option value="BOTH">
                                                Funds and items
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                                <div>
                                    <h2 className="text-xl font-bold text-[#183B2A]">
                                        Campaign records
                                    </h2>
                                    <p className="mt-1 text-sm text-[#647568]">
                                        Showing {filteredCampaigns.length} of{" "}
                                        {campaigns.length} campaigns
                                    </p>
                                </div>
                            </div>

                            {filteredCampaigns.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                        <Search size={25} />
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                        {campaigns.length === 0
                                            ? "No campaigns available"
                                            : "No matching campaigns"}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                        {campaigns.length === 0
                                            ? "Campaign records will appear here when they are available."
                                            : "Try a different search term or change the selected filters."}
                                    </p>

                                    {(searchQuery ||
                                        statusFilter !== "ALL" ||
                                        donationTypeFilter !== "ALL") && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setStatusFilter("ALL");
                                                    setDonationTypeFilter("ALL");
                                                }}
                                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                                            >
                                                Reset filters
                                            </button>
                                        )}
                                </div>
                            ) : (
                                <section
                                    aria-label="Campaign list"
                                    className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7"
                                >
                                    {filteredCampaigns.map((campaign) => (
                                        <article
                                            key={campaign.id}
                                            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6"
                                        >
                                            <div className="flex min-w-0 items-start gap-4">
                                                <CampaignImage campaign={campaign} />

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <StatusBadge
                                                            status={campaign.status}
                                                        />

                                                        <span className="rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-semibold text-[#526B56]">
                                                            {campaign.category}
                                                        </span>
                                                    </div>

                                                    <h3 className="mt-3 break-words text-lg font-bold leading-6 text-[#183B2A] sm:text-xl">
                                                        {campaign.title}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-[#829184]">
                                                        Campaign #{campaign.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-5 line-clamp-2 min-h-10 text-sm leading-5 text-[#647568]">
                                                {campaign.description ||
                                                    "No campaign description provided."}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5EDE3] bg-[#FAFCF8] px-3 py-2 text-xs font-medium text-[#526B56]">
                                                    <Package size={14} />
                                                    {getDonationTypeLabel(
                                                        campaign.donation_type
                                                    )}
                                                </span>

                                                <span className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-[#E5EDE3] bg-[#FAFCF8] px-3 py-2 text-xs font-medium text-[#526B56]">
                                                    <Layers3
                                                        size={14}
                                                        className="shrink-0"
                                                    />
                                                    <span className="truncate">
                                                        {campaign.ngo?.name ||
                                                            "NGO not specified"}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#647568]">
                                                    <Target
                                                        size={15}
                                                        className="text-[#27824B]"
                                                    />
                                                    Campaign goal
                                                </div>

                                                <p className="mt-2 break-words text-base font-bold leading-6 text-[#183B2A]">
                                                    {getGoalDescription(campaign)}
                                                </p>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3">
                                                <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                                                    <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                                                        <CalendarDays
                                                            size={14}
                                                            className="shrink-0"
                                                        />
                                                        Starts
                                                    </p>
                                                    <p className="mt-1.5 text-sm font-semibold text-[#35543B]">
                                                        {formatDate(
                                                            campaign.start_date
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                                                    <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                                                        <CalendarDays
                                                            size={14}
                                                            className="shrink-0"
                                                        />
                                                        Ends
                                                    </p>
                                                    <p className="mt-1.5 text-sm font-semibold text-[#35543B]">
                                                        {formatDate(
                                                            campaign.end_date
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-5">
                                                <div className="mb-4 flex items-center justify-between gap-3 border-t border-[#EDF2E9] pt-4 text-xs text-[#829184]">
                                                    <span className="min-w-0 truncate">
                                                        Created by{" "}
                                                        <span className="font-semibold text-[#526B56]">
                                                            {[
                                                                campaign.created_by
                                                                    ?.first_name,
                                                                campaign.created_by
                                                                    ?.last_name,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(" ")
                                                                .trim() ||
                                                                campaign.created_by
                                                                    ?.username ||
                                                                "Unknown"}
                                                        </span>
                                                    </span>

                                                    <span className="shrink-0">
                                                        {formatDate(
                                                            campaign.created_at
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="space-y-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedCampaignId(
                                                                campaign.id
                                                            )
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                                    >
                                                        <Search size={16} />
                                                        View Details
                                                    </button>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <button
                                                            type="button"
                                                            title={`Edit ${campaign.title}`}
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6] px-3 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#E5F2E1] hover:text-[#166534] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/10"
                                                        >
                                                            <Edit size={15} />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title={`Delete ${campaign.title}`}
                                                            className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100"
                                                        >
                                                            <Trash2 size={15} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </section>
                            )}

                            <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                                Review campaign goals, timelines, donation
                                progress, and registration details.
                            </p>
                        </>
                    )}
                </div>
            </main>

            <CampaignDetailsModal
                isOpen={selectedCampaignId !== null}
                campaignId={selectedCampaignId}
                onClose={() => setSelectedCampaignId(null)}
            />
        </>
    );
}