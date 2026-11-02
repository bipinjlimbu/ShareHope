"use client";

import { useEffect, useState } from "react";
import {
    AlertCircle,
    CalendarDays,
    Clock3,
    ImageIcon,
    MinusCircle,
    X,
} from "lucide-react";
import { getPendingCampaignChangeById } from "@/services/campaignService";
import type { PendingCampaignChange } from "@/types/campaign";
import PendingCampaignChangeDetailsModalSkeleton from "@/components/skeleton/admin-dashboard/PendingCampaignChangeDetailsModalSkeleton";

interface PendingCampaignChangeDetailsModalProps {
    isOpen: boolean;
    changeId: number | null;
    onClose: () => void;
}

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
)
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

function getImageUrl(image: string | null | undefined): string | null {
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
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function normalizeText(value: string | null | undefined): string {
    return (value ?? "").trim();
}

function normalizeAmount(value: string | null): string {
    if (value === null || value === "") return "";

    const numericValue = Number(value);

    return Number.isFinite(numericValue)
        ? String(numericValue)
        : value.trim();
}

function normalizeNumber(value: number | null): string {
    return value === null ? "" : String(value);
}

function normalizeDate(value: string | null): string {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.trim();
    }

    return date.toISOString().slice(0, 10);
}

function areImagesEqual(
    currentImage: string | null,
    proposedImage: string | null
): boolean {
    return getImageUrl(currentImage) === getImageUrl(proposedImage);
}

function NoChangeBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE7D9] bg-[#F1F7ED] px-2.5 py-1 text-[11px] font-semibold text-[#647568]">
            <MinusCircle size={12} />
            No Change
        </span>
    );
}

function ComparisonField({
    label,
    currentValue,
    proposedValue,
    hasChanged,
}: {
    label: string;
    currentValue: React.ReactNode;
    proposedValue: React.ReactNode;
    hasChanged: boolean;
}) {
    return (
        <div className="grid grid-cols-1 gap-3 border-b border-[#EDF2E9] py-4 last:border-b-0 sm:grid-cols-2">
            <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#829184]">
                    {label} · Existing
                </p>

                <div className="break-words text-sm leading-6 text-[#35543B]">
                    {currentValue}
                </div>
            </div>

            <div className="min-w-0 rounded-xl p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#27824B]">
                        Proposed
                    </p>

                    {!hasChanged && <NoChangeBadge />}

                    {hasChanged && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F2E1] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                            Changed
                        </span>
                    )}
                </div>

                <div
                    className={`break-words text-sm leading-6 ${hasChanged
                        ? "font-medium text-[#183B2A]"
                        : "text-[#829184]"
                        }`}
                >
                    {proposedValue}
                </div>
            </div>
        </div>
    );
}

function ComparisonImage({
    label,
    image,
    alt,
}: {
    label: string;
    image: string | null;
    alt: string;
}) {
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [image]);

    return (
        <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#829184]">
                {label}
            </p>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E5EDE3] bg-[#F1F7ED]">
                {image && !imageFailed ? (
                    <img
                        src={image}
                        alt={alt}
                        className="h-full w-full object-cover"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#829184]">
                        <ImageIcon size={28} />
                        <span className="text-xs">No image available</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function ComparisonImageSection({
    currentImage,
    proposedImage,
    campaignTitle,
}: {
    currentImage: string | null;
    proposedImage: string | null;
    campaignTitle: string;
}) {
    const hasChanged = !areImagesEqual(currentImage, proposedImage);

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[#35543B]">
                    Campaign Image
                </h4>

                {!hasChanged && <NoChangeBadge />}

                {hasChanged && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F2E1] px-2.5 py-1 text-[11px] font-semibold text-[#166534]">
                        Changed
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ComparisonImage
                    label="Existing Image"
                    image={getImageUrl(currentImage)}
                    alt={campaignTitle}
                />

                <ComparisonImage
                    label="Proposed Image"
                    image={getImageUrl(proposedImage)}
                    alt={`Proposed ${campaignTitle}`}
                />
            </div>
        </div>
    );
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

    return "Unable to load campaign edit details. Please try again.";
}

export default function PendingCampaignChangeDetailsModal({
    isOpen,
    changeId,
    onClose,
}: PendingCampaignChangeDetailsModalProps) {
    const [change, setChange] = useState<PendingCampaignChange | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!isOpen || changeId === null) {
            setChange(null);
            setError(null);
            return;
        }

        let isActive = true;

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            setChange(null);

            try {
                const response = await getPendingCampaignChangeById(changeId);

                if (isActive) {
                    setChange(response);
                }
            } catch (err: unknown) {
                console.error(
                    "Failed to fetch pending campaign change details:",
                    err
                );

                if (isActive) {
                    setError(getErrorMessage(err));
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void fetchDetails();

        return () => {
            isActive = false;
        };
    }, [isOpen, changeId, retryCount]);

    if (!isOpen || changeId === null) {
        return null;
    }

    if (isLoading) {
        return <PendingCampaignChangeDetailsModalSkeleton />;
    }

    const campaign = change?.campaign;
    const currency = campaign?.currency || "NPR";

    const formatAmount = (amount: string | null) => {
        if (amount === null || amount === "") return "Not specified";

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount)) {
            return `${currency} ${amount}`;
        }

        return `${currency} ${numericAmount.toLocaleString("en-NP")}`;
    };

    const formatQuantity = (quantity: number | null) => {
        if (quantity === null) return "Not specified";

        return `${quantity.toLocaleString("en-NP")} ${campaign?.goal_item_name || "items"
            }`;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="campaign-change-details-title"
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                <Clock3 size={13} />
                                Pending Edit
                            </span>

                            {change && (
                                <span className="rounded-full bg-[#F1F7ED] px-3 py-1.5 text-xs font-semibold text-[#526B56]">
                                    Request #{change.id}
                                </span>
                            )}
                        </div>

                        <h2
                            id="campaign-change-details-title"
                            className="mt-3 text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            Campaign Change Details
                        </h2>

                        <p className="mt-1 text-sm text-[#647568]">
                            Compare the existing campaign with the NGO's
                            proposed modifications.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close campaign change details"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E5EDE3] bg-white text-[#647568] transition hover:bg-[#F1F7ED] hover:text-[#183B2A]"
                    >
                        <X size={19} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
                    {error ? (
                        <div className="flex min-h-72 flex-col items-center justify-center text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <AlertCircle size={27} />
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                Unable to load details
                            </h3>

                            <p className="mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setRetryCount((previous) => previous + 1)
                                }
                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                            >
                                Try again
                            </button>
                        </div>
                    ) : change && campaign ? (
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                                <h3 className="text-base font-bold text-[#183B2A]">
                                    Request Information
                                </h3>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl bg-[#FAFCF8] p-3">
                                        <p className="flex items-center gap-1.5 text-xs text-[#829184]">
                                            <CalendarDays size={14} />
                                            Submitted On
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-[#35543B]">
                                            {formatDate(change.submitted_at)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#FAFCF8] p-3">
                                        <p className="text-xs text-[#829184]">
                                            Submitted By
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#35543B]">
                                            {change.submitted_by?.first_name ||
                                                change.submitted_by?.username ||
                                                "Unknown user"}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#FAFCF8] p-3">
                                        <p className="text-xs text-[#829184]">
                                            NGO
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#35543B]">
                                            {campaign.ngo?.name ||
                                                "NGO not specified"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                                <div className="mb-5">
                                    <h3 className="text-base font-bold text-[#183B2A]">
                                        Campaign Comparison
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-[#829184]">
                                        Existing values are shown on the left.
                                        Proposed values are shown on the right.
                                        Unchanged fields are marked accordingly.
                                    </p>
                                </div>

                                <ComparisonImageSection
                                    currentImage={campaign.campaign_image}
                                    proposedImage={change.campaign_image}
                                    campaignTitle={campaign.title}
                                />

                                <div className="mt-5 border-t border-[#EDF2E9]">
                                    <ComparisonField
                                        label="Campaign Title"
                                        currentValue={
                                            campaign.title || "Not specified"
                                        }
                                        proposedValue={
                                            change.title || "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(campaign.title) !==
                                            normalizeText(change.title)
                                        }
                                    />

                                    <ComparisonField
                                        label="Description"
                                        currentValue={
                                            <p className="whitespace-pre-wrap">
                                                {campaign.description ||
                                                    "Not specified"}
                                            </p>
                                        }
                                        proposedValue={
                                            <p className="whitespace-pre-wrap">
                                                {change.description ||
                                                    "Not specified"}
                                            </p>
                                        }
                                        hasChanged={
                                            normalizeText(campaign.description) !==
                                            normalizeText(change.description)
                                        }
                                    />

                                    <ComparisonField
                                        label="Fund Goal"
                                        currentValue={formatAmount(
                                            campaign.goal_amount
                                        )}
                                        proposedValue={formatAmount(
                                            change.goal_amount
                                        )}
                                        hasChanged={
                                            normalizeAmount(campaign.goal_amount) !==
                                            normalizeAmount(change.goal_amount)
                                        }
                                    />

                                    <ComparisonField
                                        label="Item Goal"
                                        currentValue={formatQuantity(
                                            campaign.goal_quantity
                                        )}
                                        proposedValue={formatQuantity(
                                            change.goal_quantity
                                        )}
                                        hasChanged={
                                            normalizeNumber(campaign.goal_quantity) !==
                                            normalizeNumber(change.goal_quantity)
                                        }
                                    />

                                    <ComparisonField
                                        label="Campaign End Date"
                                        currentValue={formatDate(campaign.end_date)}
                                        proposedValue={formatDate(change.end_date)}
                                        hasChanged={
                                            normalizeDate(campaign.end_date) !==
                                            normalizeDate(change.end_date)
                                        }
                                    />
                                </div>
                            </section>

                            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                                <p className="text-sm leading-6 text-amber-800">
                                    Review the proposed values carefully before
                                    making an approval decision. The existing
                                    campaign remains unchanged until the edit
                                    request is processed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-72 items-center justify-center text-sm text-[#647568]">
                            Campaign change details are unavailable.
                        </div>
                    )}
                </div>

                <footer className="flex shrink-0 justify-end border-t border-[#E5EDE3] bg-white px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-[#DDE7D9] bg-white px-5 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED]"
                    >
                        Close
                    </button>
                </footer>
            </section>
        </div>
    );
}
