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
    PencilLine,
    RefreshCw,
    Search,
    Target,
    X,
    XCircle,
} from "lucide-react";
import {
    approveCampaign,
    getCampaigns,
    rejectCampaign,
    getPendingCampaignChanges,
} from "@/services/campaignService";
import type {
    Campaign,
    CampaignDonationType,
    PendingCampaignChange,
} from "@/types/campaign";
import CampaignDetailsModal from "@/components/dashboard/CampaignDetailsModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PendingCampaignsSkeleton from "@/components/skeleton/admin-dashboard/PendingCampaignsSkeleton";
import { useToast } from "@/components/toast/ToastProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

type DonationTypeFilter = "ALL" | CampaignDonationType;
type ApprovalTab = "NEW" | "EDITS";

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

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object") {
        const errorData = error as Record<string, unknown>;
        const message = errorData.detail ?? errorData.message;

        if (typeof message === "string") {
            return message;
        }
    }

    return "Something went wrong. Please try again.";
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
}: {
    children: React.ReactNode;
    variant: "primary" | "success" | "danger";
}) {
    const styles = {
        primary:
            "border-[#166534] bg-[#166534] text-white",
        success:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        danger:
            "border-red-200 bg-red-50 text-red-600",
    };

    return (
        <span
            aria-disabled="true"
            className={`inline-flex cursor-default items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold ${styles[variant]}`}
        >
            {children}
        </span>
    );
}

function PendingEditCard({
    change,
}: {
    change: PendingCampaignChange;
}) {
    const campaign = change.campaign;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md">
            <div className="flex items-start gap-4 p-5 pb-0 sm:p-6 sm:pb-0">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3E5] text-[#166534]">
                    <PencilLine size={27} strokeWidth={1.6} />
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
                            An NGO has submitted changes to an existing campaign.
                            Review the proposed modifications before making an
                            approval decision.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <PlaceholderAction variant="primary">
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

export default function PendingCampaignsPage() {
    const { showToast } = useToast();

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [pendingChanges, setPendingChanges] = useState<
        PendingCampaignChange[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<ApprovalTab>("NEW");
    const [searchQuery, setSearchQuery] = useState("");

    const [donationTypeFilter, setDonationTypeFilter] =
        useState<DonationTypeFilter>("ALL");

    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
        null
    );

    const [campaignToApprove, setCampaignToApprove] =
        useState<Campaign | null>(null);

    const [campaignToReject, setCampaignToReject] =
        useState<Campaign | null>(null);

    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

    const fetchPendingCampaigns = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setError(null);

        try {
            const [campaignResponse, changeResponse] = await Promise.all([
                getCampaigns(),
                getPendingCampaignChanges(),
            ]);

            if (
                !Array.isArray(campaignResponse) ||
                !Array.isArray(changeResponse)
            ) {
                throw new Error(
                    "The campaign API returned an unexpected response."
                );
            }

            setCampaigns(
                campaignResponse.filter(
                    (campaign) =>
                        campaign.status?.toUpperCase() === "PENDING"
                )
            );

            setPendingChanges(changeResponse);
        } catch (err: unknown) {
            console.error("Failed to fetch pending campaign approvals:", err);

            const message =
                getErrorMessage(err) ||
                "Unable to load pending campaign approvals. Please try again.";

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
        void fetchPendingCampaigns();
    }, [fetchPendingCampaigns]);

    const handleApproveCampaign = async () => {
        if (!campaignToApprove || isApproving || isRejecting) return;

        setIsApproving(true);

        try {
            await approveCampaign(campaignToApprove.id);

            setCampaigns((previousCampaigns) =>
                previousCampaigns.filter(
                    (campaign) => campaign.id !== campaignToApprove.id
                )
            );

            showToast("Campaign approved successfully.", "success");
            setCampaignToApprove(null);
        } catch (err: unknown) {
            console.error("Failed to approve campaign:", err);

            showToast(
                getErrorMessage(err) || "Failed to approve campaign.",
                "error"
            );
        } finally {
            setIsApproving(false);
        }
    };

    const handleRejectCampaign = async () => {
        if (!campaignToReject || isRejecting || isApproving) return;

        setIsRejecting(true);

        try {
            await rejectCampaign(campaignToReject.id);

            setCampaigns((previousCampaigns) =>
                previousCampaigns.filter(
                    (campaign) => campaign.id !== campaignToReject.id
                )
            );

            showToast("Campaign rejected successfully.", "success");
            setCampaignToReject(null);
        } catch (err: unknown) {
            console.error("Failed to reject campaign:", err);

            showToast(
                getErrorMessage(err) || "Failed to reject campaign.",
                "error"
            );
        } finally {
            setIsRejecting(false);
        }
    };

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

    const fundCampaignCount = campaigns.filter(
        (campaign) =>
            campaign.donation_type === "FUND" ||
            campaign.donation_type === "BOTH"
    ).length;

    const itemCampaignCount = campaigns.filter(
        (campaign) =>
            campaign.donation_type === "ITEM" ||
            campaign.donation_type === "BOTH"
    ).length;

    if (isLoading) {
        return <PendingCampaignsSkeleton />;
    }

    return (
        <>
            <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                <div className="mx-auto w-full max-w-[1600px]">
                    <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                Campaign Approvals
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                                Review new campaign submissions and proposed
                                changes from registered NGOs before approving
                                them.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                    <Layers3 size={19} />
                                </div>

                                <div>
                                    <p className="text-xl font-bold leading-6 text-[#183B2A]">
                                        {campaigns.length.toLocaleString("en-NP")}
                                    </p>
                                    <p className="mt-0.5 whitespace-nowrap text-xs text-[#647568]">
                                        New requests
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                    <PencilLine size={19} />
                                </div>

                                <div>
                                    <p className="text-xl font-bold leading-6 text-[#183B2A]">
                                        {pendingChanges.length.toLocaleString("en-NP")}
                                    </p>
                                    <p className="mt-0.5 whitespace-nowrap text-xs text-[#647568]">
                                        Edit requests
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {error ? (
                        <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCEFEA] text-red-600">
                                <FileText size={25} />
                            </div>

                            <h2 className="mt-4 text-lg font-bold text-[#183B2A]">
                                Unable to load campaign approvals
                            </h2>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647568]">
                                Campaign approval records could not be loaded.
                                Check your connection and try again.
                            </p>

                            <button
                                type="button"
                                onClick={() => void fetchPendingCampaigns()}
                                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                            >
                                <RefreshCw size={16} />
                                Retry loading
                            </button>
                        </section>
                    ) : (
                        <>
                            <section
                                aria-label="Campaign approval statistics"
                                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                            >
                                <SummaryCard
                                    title="New Campaigns"
                                    value={campaigns.length}
                                    description="First-time campaign submissions waiting for admin review"
                                    icon={Clock3}
                                />

                                <SummaryCard
                                    title="Fund Campaigns"
                                    value={fundCampaignCount}
                                    description="New submissions accepting monetary donations"
                                    icon={Coins}
                                />

                                <SummaryCard
                                    title="Item Campaigns"
                                    value={itemCampaignCount}
                                    description="New submissions requesting physical item donations"
                                    icon={Package}
                                />
                            </section>

                            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-2 shadow-sm sm:p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab("NEW");
                                            setSearchQuery("");
                                        }}
                                        className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition sm:px-5 ${activeTab === "NEW"
                                            ? "bg-[#166534] text-white shadow-sm"
                                            : "text-[#647568] hover:bg-[#F1F7ED] hover:text-[#183B2A]"
                                            }`}
                                    >
                                        <Layers3 size={17} />
                                        <span>New Campaigns</span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "NEW"
                                                ? "bg-white/20 text-white"
                                                : "bg-[#E5F2E1] text-[#166534]"
                                                }`}
                                        >
                                            {campaigns.length}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab("EDITS");
                                            setSearchQuery("");
                                        }}
                                        className={`flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition sm:px-5 ${activeTab === "EDITS"
                                            ? "bg-[#166534] text-white shadow-sm"
                                            : "text-[#647568] hover:bg-[#F1F7ED] hover:text-[#183B2A]"
                                            }`}
                                    >
                                        <PencilLine size={17} />
                                        <span>Edit Requests</span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "EDITS"
                                                ? "bg-white/20 text-white"
                                                : "bg-amber-100 text-amber-700"
                                                }`}
                                        >
                                            {pendingChanges.length}
                                        </span>
                                    </button>
                                </div>
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
                                            placeholder={
                                                activeTab === "NEW"
                                                    ? "Search title, category, NGO or creator..."
                                                    : "Search campaign, NGO or requester..."
                                            }
                                            aria-label="Search campaign approvals"
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

                                    {activeTab === "NEW" && (
                                        <div className="xl:w-64">
                                            <select
                                                value={donationTypeFilter}
                                                onChange={(event) =>
                                                    setDonationTypeFilter(
                                                        event.target.value as DonationTypeFilter
                                                    )
                                                }
                                                aria-label="Filter campaigns by donation type"
                                                className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-white px-4 text-sm text-[#183B2A] outline-none transition focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
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
                                    )}
                                </div>
                            </section>

                            {activeTab === "NEW" ? (
                                <>
                                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold text-[#183B2A]">
                                                New campaign submissions
                                            </h2>

                                            <p className="mt-1 text-sm text-[#647568]">
                                                Showing{" "}
                                                {filteredCampaigns.length.toLocaleString("en-NP")}{" "}
                                                of{" "}
                                                {campaigns.length.toLocaleString("en-NP")}{" "}
                                                pending campaigns
                                            </p>
                                        </div>

                                        {(searchQuery ||
                                            donationTypeFilter !== "ALL") && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery("");
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
                                                    ? "No pending campaigns"
                                                    : "No matching campaigns"}
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                                {campaigns.length === 0
                                                    ? "New campaign submissions from NGOs will appear here when they are ready for admin review."
                                                    : "Try a different search term or change your donation type filter."}
                                            </p>

                                            {(searchQuery ||
                                                donationTypeFilter !== "ALL") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchQuery("");
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
                                                                        setSelectedCampaignId(campaign.id)
                                                                    }
                                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                                                >
                                                                    <Search size={16} />
                                                                    View Details
                                                                </button>

                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setCampaignToApprove(campaign)
                                                                        }
                                                                        disabled={isApproving || isRejecting}
                                                                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        <CheckCircle2 size={16} />
                                                                        Approve
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setCampaignToReject(campaign)
                                                                        }
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
                            ) : (
                                <>
                                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                        <div className="min-w-0">
                                            <h2 className="text-xl font-bold text-[#183B2A]">
                                                Campaign edit requests
                                            </h2>

                                            <p className="mt-1 text-sm text-[#647568]">
                                                Showing{" "}
                                                {filteredChanges.length.toLocaleString("en-NP")}{" "}
                                                of{" "}
                                                {pendingChanges.length.toLocaleString("en-NP")}{" "}
                                                pending edit requests
                                            </p>
                                        </div>

                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
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
                                                    onClick={() => setSearchQuery("")}
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
                                                />
                                            ))}
                                        </section>
                                    )}
                                </>
                            )}

                            <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                                {activeTab === "NEW"
                                    ? "Review campaign information, NGO details, donation goals, and campaign schedules before making an approval decision."
                                    : "Review each NGO's proposed campaign modifications before approving or rejecting an edit request."}
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

            <ConfirmationModal
                isOpen={campaignToApprove !== null}
                title="Approve Campaign?"
                description="Are you sure you want to approve this campaign? Once approved, it will no longer appear in the pending campaigns list."
                itemName={campaignToApprove?.title}
                confirmText="Approve Campaign"
                isDeleting={isApproving}
                buttonColor="bg-[#166534]"
                buttonHoverColor="hover:bg-[#124D29]"
                iconBackgroundColor="bg-emerald-50"
                iconColor="text-emerald-600"
                onConfirm={handleApproveCampaign}
                onCancel={() => {
                    if (!isApproving) {
                        setCampaignToApprove(null);
                    }
                }}
            />

            <ConfirmationModal
                isOpen={campaignToReject !== null}
                title="Reject Campaign?"
                description="Are you sure you want to reject this campaign? Once rejected, it will no longer appear in the pending campaigns list."
                itemName={campaignToReject?.title}
                confirmText="Reject Campaign"
                isDeleting={isRejecting}
                buttonColor="bg-red-600"
                buttonHoverColor="hover:bg-red-700"
                iconBackgroundColor="bg-red-50"
                iconColor="text-red-600"
                onConfirm={handleRejectCampaign}
                onCancel={() => {
                    if (!isRejecting) {
                        setCampaignToReject(null);
                    }
                }}
            />
        </>
    );
}
