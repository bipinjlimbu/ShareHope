"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Coins,
    FileText,
    ImageIcon,
    Layers3,
    Package,
    Plus,
    RefreshCw,
    Search,
    Target,
    X,
    XCircle,
} from "lucide-react";
import { getCampaigns } from "@/services/campaignService";
import type {
    Campaign,
    CampaignDonationType,
    CampaignStatus,
} from "@/types/campaign";
import CampaignsSkeleton from "@/components/skeleton/ngo-admin-dashboard/CampaignsSkeleton";
import CreateCampaignForm from "@/components/form/CreateCampaignForm";
import { useToast } from "@/components/toast/ToastProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

type StatusFilter = "ALL" | CampaignStatus;
type DonationTypeFilter = "ALL" | CampaignDonationType;

const campaignStatusStyles: Record<CampaignStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-sky-50 text-sky-700",
    REJECTED: "bg-red-50 text-red-700",
    ACTIVE: "bg-emerald-50 text-emerald-700",
    COMPLETED: "bg-violet-50 text-violet-700",
    CANCELLED: "bg-[#F4F7F0] text-[#647568]",
};

const campaignStatusLabels: Record<CampaignStatus, string> = {
    DRAFT: "Draft",
    PENDING: "Pending Approval",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

function normalizeStatus(status: string): CampaignStatus | null {
    const normalized = status.toUpperCase();

    if (
        normalized === "DRAFT" ||
        normalized === "PENDING" ||
        normalized === "APPROVED" ||
        normalized === "REJECTED" ||
        normalized === "ACTIVE" ||
        normalized === "COMPLETED" ||
        normalized === "CANCELLED"
    ) {
        return normalized;
    }

    return null;
}

function getCampaignImageUrl(path: string | null): string | null {
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

function StatusBadge({ status }: { status: string }) {
    const normalizedStatus = normalizeStatus(status);

    const className = normalizedStatus
        ? campaignStatusStyles[normalizedStatus]
        : "bg-[#F4F7F0] text-[#647568]";

    const label = normalizedStatus
        ? campaignStatusLabels[normalizedStatus]
        : status;

    const Icon =
        normalizedStatus === "REJECTED" || normalizedStatus === "CANCELLED"
            ? XCircle
            : normalizedStatus === "ACTIVE" ||
                normalizedStatus === "COMPLETED" ||
                normalizedStatus === "APPROVED"
                ? CheckCircle2
                : Clock3;

    return (
        <span
            className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            <Icon size={13} className="shrink-0" />
            <span>{label}</span>
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
    const imageUrl = getCampaignImageUrl(campaign.campaign_image);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign.campaign_image]);

    return (
        <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#EAF3E6] sm:h-52">
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={campaign.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-[#166534]">
                    <ImageIcon size={30} />
                </div>
            )}

            <div className="absolute left-4 top-4">
                <StatusBadge status={campaign.status} />
            </div>
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
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    const fetchCampaigns = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setError(null);

        try {
            const response = await getCampaigns();

            if (!Array.isArray(response)) {
                throw new Error(
                    "The campaign API returned an unexpected response."
                );
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
                statusFilter === "ALL" ||
                campaign.status.toUpperCase() === statusFilter;

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
                matchesStatus &&
                matchesDonationType &&
                searchableText.includes(query)
            );
        });
    }, [campaigns, searchQuery, statusFilter, donationTypeFilter]);

    const activeCount = campaigns.filter(
        (campaign) => campaign.status.toUpperCase() === "ACTIVE"
    ).length;

    const pendingCount = campaigns.filter(
        (campaign) => campaign.status.toUpperCase() === "PENDING"
    ).length;

    const completedCount = campaigns.filter(
        (campaign) => campaign.status.toUpperCase() === "COMPLETED"
    ).length;

    if (isLoading) {
        return <CampaignsSkeleton />;
    }

    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            {isCreateFormOpen && (
                <CreateCampaignForm
                    onClose={() => setIsCreateFormOpen(false)}
                    onSuccess={() => {
                        setIsCreateFormOpen(false);
                        void fetchCampaigns();
                    }}
                />
            )}

            <div className="mx-auto w-full max-w-[1600px]">
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                            Campaigns
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                            View campaign records, track their approval
                            status, and review donation goals and schedules.
                        </p>
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 text-sm text-[#183B2A]">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <Layers3 size={19} />
                            </div>

                            <div>
                                <p className="text-xl font-bold leading-6">
                                    {campaigns.length.toLocaleString("en-NP")}
                                </p>
                                <p className="mt-0.5 whitespace-nowrap text-xs text-[#647568]">
                                    Total campaigns
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsCreateFormOpen(true)}
                            className="inline-flex min-h-[58px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                        >
                            <Plus size={19} />
                            Create Campaign
                        </button>
                    </div>
                </header>

                {error ? (
                    <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCEFEA] text-red-600">
                            <FileText size={25} />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-[#183B2A]">
                            Unable to load campaigns
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647568]">
                            Campaign records could not be loaded. Check your
                            connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => void fetchCampaigns()}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                        >
                            <RefreshCw size={16} />
                            Retry loading campaigns
                        </button>
                    </section>
                ) : (
                    <>
                        <section
                            aria-label="Campaign statistics"
                            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                        >
                            <SummaryCard
                                title="Total Campaigns"
                                value={campaigns.length}
                                description="All campaign records returned by the API"
                                icon={Layers3}
                            />

                            <SummaryCard
                                title="Active Campaigns"
                                value={activeCount}
                                description="Campaigns currently marked active"
                                icon={CheckCircle2}
                            />

                            <SummaryCard
                                title="Pending Approval"
                                value={pendingCount}
                                description="Campaigns waiting for an admin decision"
                                icon={Clock3}
                            />

                            <SummaryCard
                                title="Completed Campaigns"
                                value={completedCount}
                                description="Campaigns marked as completed"
                                icon={Target}
                            />
                        </section>

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
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Search title, category, NGO or creator..."
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

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto">
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
                                        <option value="ALL">All statuses</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PENDING">
                                            Pending Approval
                                        </option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>

                                    <select
                                        value={donationTypeFilter}
                                        onChange={(event) =>
                                            setDonationTypeFilter(
                                                event.target.value as DonationTypeFilter
                                            )
                                        }
                                        aria-label="Filter campaigns by donation type"
                                        className="h-12 min-w-0 rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                    >
                                        <option value="ALL">
                                            All donation types
                                        </option>
                                        <option value="FUND">Funds</option>
                                        <option value="ITEM">
                                            Physical Items
                                        </option>
                                        <option value="BOTH">
                                            Funds and Items
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <h2 className="text-xl font-bold text-[#183B2A]">
                                    Campaign records
                                </h2>

                                <p className="mt-1 text-sm text-[#647568]">
                                    Showing{" "}
                                    {filteredCampaigns.length.toLocaleString(
                                        "en-NP"
                                    )}{" "}
                                    of{" "}
                                    {campaigns.length.toLocaleString("en-NP")}{" "}
                                    campaigns
                                </p>
                            </div>

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
                                        ? "No campaigns available"
                                        : "No matching campaigns"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                    {campaigns.length === 0
                                        ? "Campaigns will appear here when campaign records are available."
                                        : "Try a different search term or change your filters."}
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
                                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                                        >
                                            Reset filters
                                        </button>
                                    )}
                            </section>
                        ) : (
                            <section
                                aria-label="Campaign list"
                                className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-7"
                            >
                                {filteredCampaigns.map((campaign) => (
                                    <article
                                        key={campaign.id}
                                        className="group min-w-0 overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md"
                                    >
                                        <CampaignImage campaign={campaign} />

                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex min-w-0 items-center gap-1.5 rounded-lg bg-[#F1F7ED] px-2.5 py-1.5 text-xs font-semibold text-[#166534]">
                                                    <FileText
                                                        size={13}
                                                        className="shrink-0"
                                                    />
                                                    <span className="truncate">
                                                        {campaign.category ||
                                                            "Uncategorized"}
                                                    </span>
                                                </span>

                                                <span className="shrink-0 text-xs text-[#829184]">
                                                    #{campaign.id}
                                                </span>
                                            </div>

                                            <h3 className="mt-4 line-clamp-2 break-words text-xl font-bold leading-7 text-[#183B2A]">
                                                {campaign.title}
                                            </h3>

                                            <p className="mt-2 line-clamp-3 min-h-[4.5rem] break-words text-sm leading-6 text-[#647568]">
                                                {campaign.description ||
                                                    "No description provided."}
                                            </p>

                                            <div className="mt-4 flex items-start gap-2 text-sm text-[#647568]">
                                                <Layers3
                                                    size={16}
                                                    className="mt-0.5 shrink-0 text-[#35A45C]"
                                                />
                                                <span className="min-w-0 break-words">
                                                    <span className="text-[#829184]">
                                                        Organization:{" "}
                                                    </span>
                                                    <span className="font-semibold text-[#35543B]">
                                                        {campaign.ngo?.name ??
                                                            "Unknown NGO"}
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="mt-4 rounded-xl border border-[#E5EDE3] bg-[#FAFCF8] p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                                        {campaign.donation_type ===
                                                            "FUND" ? (
                                                            <Coins size={19} />
                                                        ) : campaign.donation_type ===
                                                            "ITEM" ? (
                                                            <Package size={19} />
                                                        ) : (
                                                            <Target size={19} />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-[#829184]">
                                                            Donation type
                                                        </p>
                                                        <p className="mt-1 break-words text-sm font-bold text-[#183B2A]">
                                                            {getDonationTypeLabel(
                                                                campaign.donation_type
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-[#E5EDE3] pt-3">
                                                    <p className="text-xs font-medium text-[#829184]">
                                                        Campaign goal
                                                    </p>
                                                    <p className="mt-1 break-words text-sm font-semibold leading-6 text-[#35543B]">
                                                        {getGoalDescription(
                                                            campaign
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                    <CalendarDays
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#35A45C]"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-[#829184]">
                                                            Start date
                                                        </p>
                                                        <p className="mt-0.5 break-words font-medium text-[#35543B]">
                                                            {formatDate(
                                                                campaign.start_date
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                    <CalendarDays
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#35A45C]"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-[#829184]">
                                                            End date
                                                        </p>
                                                        <p className="mt-0.5 break-words font-medium text-[#35543B]">
                                                            {formatDate(
                                                                campaign.end_date
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="my-5 border-t border-[#EDF2E9]" />

                                            <div className="flex min-w-0 items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs text-[#829184]">
                                                        Created by
                                                    </p>
                                                    <p className="mt-1 break-words text-sm font-semibold text-[#35543B]">
                                                        {getCreatorName(
                                                            campaign
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p className="text-xs text-[#829184]">
                                                        Created on
                                                    </p>
                                                    <p className="mt-1 text-sm font-medium text-[#35543B]">
                                                        {formatDate(
                                                            campaign.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        )}

                        <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                            Review campaign details, donation goals, schedules,
                            and approval statuses.
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}