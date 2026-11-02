"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Coins,
    FileText,
    Layers3,
    PencilLine,
    Package,
    RefreshCw,
} from "lucide-react";
import {
    approveCampaign,
    getCampaigns,
    getPendingCampaignChanges,
    rejectCampaign,
} from "@/services/campaignService";
import type {
    Campaign,
    CampaignDonationType,
    PendingCampaignChange,
} from "@/types/campaign";
import CampaignDetailsModal from "@/components/dashboard/CampaignDetailsModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import PendingCampaignsSkeleton from "@/components/skeleton/admin-dashboard/PendingCampaignsSkeleton";
import PendingCampaignsSection from "@/components/admin-dashboard/PendingCampaignsSection";
import PendingCampaignChangesSection from "@/components/admin-dashboard/PendingCampaignChangesSection";
import { useToast } from "@/components/toast/ToastProvider";

const MINIMUM_LOADING_TIME = 500;

type ApprovalTab = "NEW" | "EDITS";
type DonationTypeFilter = "ALL" | CampaignDonationType;

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
            console.error(
                "Failed to fetch pending campaign approvals:",
                err
            );

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
                                    icon={Layers3}
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

                            {activeTab === "NEW" ? (
                                <PendingCampaignsSection
                                    campaigns={campaigns}
                                    searchQuery={searchQuery}
                                    donationTypeFilter={donationTypeFilter}
                                    onSearchChange={setSearchQuery}
                                    onDonationTypeFilterChange={setDonationTypeFilter}
                                    onViewDetails={setSelectedCampaignId}
                                    onApprove={setCampaignToApprove}
                                    onReject={setCampaignToReject}
                                    isApproving={isApproving}
                                    isRejecting={isRejecting}
                                />
                            ) : (
                                <PendingCampaignChangesSection
                                    pendingChanges={pendingChanges}
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                />
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