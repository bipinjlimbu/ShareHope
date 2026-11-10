"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Building2,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import {
    approveNGO,
    getNGOs,
    getPendingNGOChanges,
    rejectNGO,
} from "@/services/ngoService";

import type {
    NGOListItem,
    PendingNGOChange,
} from "@/types/ngo";

import PendingNGOsSection from "@/components/admin-dashboard/PendingNGOsSection";
import PendingNGOChangesSection from "@/components/admin-dashboard/PendingNGOChangesSection";
import PendingNGOsSkeleton from "@/components/skeleton/admin-dashboard/PendingNGOsSkeleton";
import PendingNGOChangeDetailsModal from "@/components/admin-dashboard/PendingNGOChangeDetailsModal";
import NGODetailsModal from "@/components/dashboard/NGODetailsModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useToast } from "@/components/toast/ToastProvider";

const MINIMUM_LOADING_TIME = 500;

type ReviewAction = "APPROVE" | "REJECT";
type ApprovalTab = "NEW" | "EDITS";

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
    ) {
        return error.message;
    }

    return fallback;
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

export default function PendingNGOsPage() {
    const { showToast } = useToast();

    const [ngos, setNgos] = useState<NGOListItem[]>([]);
    const [pendingChanges, setPendingChanges] = useState<PendingNGOChange[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [activeTab, setActiveTab] = useState<ApprovalTab>("NEW");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedNGOId, setSelectedNGOId] = useState<number | null>(null);
    const [selectedChangeId, setSelectedChangeId] = useState<number | null>(null);

    const [selectedReviewNGO, setSelectedReviewNGO] =
        useState<NGOListItem | null>(null);

    const [reviewAction, setReviewAction] = useState<ReviewAction>("REJECT");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const fetchPendingNGOs = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setLoadError(false);

        try {
            const [ngoResponse, changeResponse] = await Promise.all([
                getNGOs(),
                getPendingNGOChanges(),
            ]);

            const allNGOs = Array.isArray(ngoResponse) ? ngoResponse : [];
            const allChanges = Array.isArray(changeResponse)
                ? changeResponse
                : [];

            setNgos(
                allNGOs.filter(
                    (ngo) => ngo.status?.toUpperCase() === "PENDING"
                )
            );

            setPendingChanges(allChanges);
        } catch (error: unknown) {
            console.error("Failed to fetch pending NGO records:", error);

            setLoadError(true);

            showToast(
                getErrorMessage(
                    error,
                    "Unable to load pending NGO records. Please try again."
                ),
                "error"
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
    }, [showToast]);

    useEffect(() => {
        void fetchPendingNGOs();
    }, [fetchPendingNGOs]);

    const openReviewConfirmation = (
        ngo: NGOListItem,
        action: ReviewAction
    ) => {
        setSelectedReviewNGO(ngo);
        setReviewAction(action);
    };

    const closeReviewConfirmation = () => {
        if (isSubmittingReview) return;

        setSelectedReviewNGO(null);
    };

    const handleReviewNGO = async () => {
        if (!selectedReviewNGO || isSubmittingReview) return;

        const ngoToReview = selectedReviewNGO;
        const action = reviewAction;

        setIsSubmittingReview(true);

        try {
            if (action === "APPROVE") {
                await approveNGO(ngoToReview.id);
            } else {
                await rejectNGO(ngoToReview.id);
            }

            setNgos((currentNGOs) =>
                currentNGOs.filter((ngo) => ngo.id !== ngoToReview.id)
            );

            setSelectedReviewNGO(null);

            showToast(
                action === "APPROVE"
                    ? `${ngoToReview.name} has been approved successfully.`
                    : `${ngoToReview.name} has been rejected.`,
                "success"
            );
        } catch (error: unknown) {
            console.error(
                `Failed to ${action.toLowerCase()} NGO application:`,
                error
            );

            showToast(
                getErrorMessage(
                    error,
                    action === "APPROVE"
                        ? "Unable to approve this NGO application. Please try again."
                        : "Unable to reject this NGO application. Please try again."
                ),
                "error"
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const totalPendingRecords = useMemo(
        () => ngos.length + pendingChanges.length,
        [ngos.length, pendingChanges.length]
    );

    const isApproving = reviewAction === "APPROVE";

    return (
        <>
            {isLoading ? (
                <PendingNGOsSkeleton />
            ) : (
                <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                    <div className="mx-auto w-full max-w-[1600px]">
                        <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                    NGO Approvals & Changes
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                                    Review new NGO registration applications
                                    and view submitted organization profile
                                    change requests.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 text-sm text-[#183B2A] sm:self-auto">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                    <Building2 size={19} />
                                </div>

                                <div>
                                    <p className="text-xl font-bold leading-6">
                                        {totalPendingRecords.toLocaleString("en-NP")}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#647568]">
                                        Pending records
                                    </p>
                                </div>
                            </div>
                        </header>

                        {loadError ? (
                            <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                    <Clock3 size={25} />
                                </div>

                                <h2 className="mt-4 text-lg font-bold text-[#183B2A]">
                                    Unable to load NGO records
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                    Something went wrong while retrieving NGO
                                    applications and profile change requests.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => void fetchPendingNGOs()}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                                >
                                    <Clock3 size={16} />
                                    Retry loading
                                </button>
                            </section>
                        ) : (
                            <>
                                <section
                                    aria-label="Pending NGO statistics"
                                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                                >
                                    <SummaryCard
                                        title="Pending applications"
                                        value={ngos.length}
                                        description="New NGO registrations awaiting an admin decision"
                                        icon={Clock3}
                                    />

                                    <SummaryCard
                                        title="Profile change requests"
                                        value={pendingChanges.length}
                                        description="Existing NGOs with submitted profile modifications"
                                        icon={Building2}
                                    />

                                    <SummaryCard
                                        title="Total pending records"
                                        value={totalPendingRecords}
                                        description="Combined new applications and profile change requests"
                                        icon={ShieldCheck}
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
                                            <Building2 size={17} />
                                            <span>New NGO Applications</span>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "NEW"
                                                    ? "bg-white/20 text-white"
                                                    : "bg-[#E5F2E1] text-[#166534]"
                                                    }`}
                                            >
                                                {ngos.length}
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
                                            <ShieldCheck size={17} />
                                            <span>Profile Change Requests</span>

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
                                    <PendingNGOsSection
                                        ngos={ngos}
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        onViewDetails={setSelectedNGOId}
                                        onApprove={(ngo) =>
                                            openReviewConfirmation(ngo, "APPROVE")
                                        }
                                        onReject={(ngo) =>
                                            openReviewConfirmation(ngo, "REJECT")
                                        }
                                        isSubmittingReview={isSubmittingReview}
                                    />
                                ) : (
                                    <PendingNGOChangesSection
                                        pendingChanges={pendingChanges}
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        onViewDetails={setSelectedChangeId}
                                    />
                                )}

                                <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                                    {activeTab === "NEW"
                                        ? "Review NGO registration details, submitted documents, and organization information before approving or rejecting an application."
                                        : "Review submitted organization profile modification requests."}
                                </p>
                            </>
                        )}

                        <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                            Review NGO registration details carefully before
                            approving or rejecting an application.
                        </p>
                    </div>
                </main>
            )}

            <NGODetailsModal
                isOpen={selectedNGOId !== null}
                ngoId={selectedNGOId}
                onClose={() => setSelectedNGOId(null)}
            />

            <PendingNGOChangeDetailsModal
                isOpen={selectedChangeId !== null}
                changeId={selectedChangeId}
                onClose={() => setSelectedChangeId(null)}
            />

            <ConfirmationModal
                isOpen={selectedReviewNGO !== null}
                title={
                    isApproving
                        ? "Approve NGO application?"
                        : "Reject NGO application?"
                }
                description={
                    isApproving
                        ? "This will approve the NGO registration and activate the organization. The NGO administrator will receive an email notification."
                        : "This will mark the application as rejected. Make sure the submitted application has been reviewed before continuing."
                }
                itemName={
                    selectedReviewNGO
                        ? `${selectedReviewNGO.name} · Registration No. ${selectedReviewNGO.registration_number ||
                        "Not provided"
                        } · NGO ID: #${selectedReviewNGO.id}`
                        : undefined
                }
                confirmText={
                    isApproving ? "Confirm Approval" : "Confirm Rejection"
                }
                isDeleting={isSubmittingReview}
                buttonColor={isApproving ? "bg-[#166534]" : "bg-red-700"}
                buttonHoverColor={
                    isApproving ? "hover:bg-[#124D29]" : "hover:bg-red-800"
                }
                iconBackgroundColor={
                    isApproving ? "bg-[#E5F2E1]" : "bg-red-50"
                }
                iconColor={isApproving ? "text-[#166534]" : "text-red-700"}
                onConfirm={() => void handleReviewNGO()}
                onCancel={closeReviewConfirmation}
            />
        </>
    );
}