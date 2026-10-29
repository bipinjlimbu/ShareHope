"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Coins,
    ImageIcon,
    Layers3,
    Package,
    Target,
    UserRound,
    X,
    XCircle,
} from "lucide-react";
import { getCampaignById } from "@/services/campaignService";
import type { Campaign } from "@/types/campaign";
import CampaignDetailsModalSkeleton from "@/components/skeleton/ngo-admin-dashboard/CampaignDetailsModalSkeleton";

interface CampaignDetailsModalProps {
    isOpen: boolean;
    campaignId: number | null;
    onClose: () => void;
}

const statusStyles: Record<string, string> = {
    DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    APPROVED: "border-green-200 bg-green-50 text-green-800",
    ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
    COMPLETED: "border-blue-200 bg-blue-50 text-blue-800",
    CANCELLED: "border-slate-200 bg-slate-50 text-slate-600",
};

function formatDate(value?: string | null): string {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
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

function getMediaUrl(path: string | null | undefined): string {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) return path;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) return path;

    try {
        const apiOrigin = new URL(apiUrl).origin;
        return new URL(path, apiOrigin).toString();
    } catch {
        return path;
    }
}

function getPersonName(
    person: Campaign["created_by"] | Campaign["reviewed_by"]
): string {
    if (!person) return "Not assigned";

    const fullName = `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim();

    return fullName || person.username || "Unknown user";
}

function getDonationTypeLabel(type: Campaign["donation_type"]): string {
    const labels = {
        FUND: "Funds",
        ITEM: "Items",
        BOTH: "Funds and items",
    };

    return labels[type] ?? String(type);
}

function StatusBadge({ status }: { status: string }) {
    const normalized = (status || "UNKNOWN").toUpperCase();

    const className =
        statusStyles[normalized] ??
        "border-[#E1E9DC] bg-[#F4F7F0] text-[#536653]";

    const Icon =
        normalized === "ACTIVE" ||
            normalized === "APPROVED" ||
            normalized === "COMPLETED"
            ? CheckCircle2
            : normalized === "REJECTED" || normalized === "CANCELLED"
                ? XCircle
                : Clock3;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            <Icon size={13} />
            {normalized.charAt(0) + normalized.slice(1).toLowerCase()}
        </span>
    );
}

function DetailField({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number | null | undefined;
    icon?: typeof Layers3;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-[#718071]">
                {Icon && (
                    <Icon size={14} className="shrink-0 text-[#4C8154]" />
                )}
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#183B2A]">
                {value === null ||
                    value === undefined ||
                    String(value).trim() === ""
                    ? "Not provided"
                    : value}
            </p>
        </div>
    );
}

function SectionHeading({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description?: string;
    icon: typeof Layers3;
}) {
    return (
        <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                <Icon size={19} />
            </div>

            <div>
                <h3 className="font-bold text-[#183B2A]">{title}</h3>

                {description && (
                    <p className="mt-1 text-sm leading-5 text-[#718071]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

function CampaignHeroImage({ campaign }: { campaign: Campaign }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = getMediaUrl(campaign.campaign_image);

    useEffect(() => {
        setImageFailed(false);
    }, [campaign.campaign_image]);

    return (
        <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534] sm:h-60">
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={campaign.title}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="flex flex-col items-center gap-2 text-[#4C8154]">
                    <ImageIcon size={34} />
                    <span className="text-sm font-medium">
                        No campaign image
                    </span>
                </div>
            )}
        </div>
    );
}

export default function CampaignDetailsModal({
    isOpen,
    campaignId,
    onClose,
}: CampaignDetailsModalProps) {
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        if (!isOpen || campaignId === null) {
            setCampaign(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        const id = campaignId;
        let isCurrentRequest = true;

        async function fetchDetails() {
            setIsLoading(true);
            setError(null);
            setCampaign(null);

            try {
                const response = await getCampaignById(id);

                if (isCurrentRequest) {
                    setCampaign(response);
                }
            } catch (err: unknown) {
                console.error("Failed to fetch campaign details:", err);

                if (isCurrentRequest) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load this campaign's details."
                    );
                }
            } finally {
                if (isCurrentRequest) {
                    setIsLoading(false);
                }
            }
        }

        void fetchDetails();

        return () => {
            isCurrentRequest = false;
        };
    }, [isOpen, campaignId, retryKey]);

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const fundGoal =
        campaign?.donation_type === "FUND" ||
        campaign?.donation_type === "BOTH";

    const itemGoal =
        campaign?.donation_type === "ITEM" ||
        campaign?.donation_type === "BOTH";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102719]/55 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="campaign-details-title"
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] shadow-2xl sm:rounded-3xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-[#E1E9DC] px-5 py-5 sm:px-7">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <Layers3 size={24} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#27824B]">
                                Campaign record
                            </p>

                            <h2
                                id="campaign-details-title"
                                className="mt-1 break-words text-xl font-bold text-[#183B2A] sm:text-2xl"
                            >
                                {isLoading
                                    ? "Loading campaign details..."
                                    : campaign?.title || "Campaign Details"}
                            </h2>

                            <p className="mt-1 text-sm text-[#718071]">
                                {campaign
                                    ? `Campaign ID: #${campaign.id}`
                                    : "Full campaign information"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close campaign details"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#617263] transition hover:bg-[#EAF2E5] hover:text-[#183B2A]"
                    >
                        <X size={21} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                    {isLoading ? (
                        <CampaignDetailsModalSkeleton />
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-5"
                        >
                            <div className="flex items-start gap-3">
                                <XCircle
                                    size={22}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <h3 className="font-bold text-red-800">
                                        Unable to load campaign details
                                    </h3>

                                    <p className="mt-2 break-words text-sm leading-6 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setRetryKey((current) => current + 1)
                                }
                                className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                            >
                                Try again
                            </button>
                        </div>
                    ) : campaign ? (
                        <div className="space-y-7">
                            <section className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#718071]">
                                            Current status
                                        </p>

                                        <div className="mt-2">
                                            <StatusBadge
                                                status={campaign.status}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-sm text-[#617263]">
                                        <span className="font-medium">
                                            Created:
                                        </span>{" "}
                                        {formatDate(campaign.created_at)}
                                    </div>
                                </div>
                            </section>

                            <CampaignHeroImage campaign={campaign} />

                            <section>
                                <SectionHeading
                                    title="Campaign information"
                                    description="The main details and classification of this campaign."
                                    icon={Layers3}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailField
                                        label="Campaign title"
                                        value={campaign.title}
                                        icon={Layers3}
                                    />

                                    <DetailField
                                        label="Category"
                                        value={campaign.category}
                                        icon={Target}
                                    />

                                    <DetailField
                                        label="Donation type"
                                        value={getDonationTypeLabel(
                                            campaign.donation_type
                                        )}
                                        icon={Package}
                                    />

                                    <DetailField
                                        label="Campaign ID"
                                        value={`#${campaign.id}`}
                                        icon={Layers3}
                                    />

                                    <div className="sm:col-span-2">
                                        <DetailField
                                            label="Description"
                                            value={campaign.description}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Campaign goals and progress"
                                    description="Target amounts and the donations recorded so far."
                                    icon={Target}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {fundGoal && (
                                        <>
                                            <DetailField
                                                label="Target funds"
                                                value={`${campaign.currency || "NPR"} ${formatAmount(campaign.goal_amount)}`}
                                                icon={Coins}
                                            />

                                            <DetailField
                                                label="Funds collected"
                                                value={`${campaign.currency || "NPR"} ${formatAmount(campaign.collected_amount)}`}
                                                icon={Coins}
                                            />
                                        </>
                                    )}

                                    {itemGoal && (
                                        <>
                                            <DetailField
                                                label="Target items"
                                                value={
                                                    campaign.goal_quantity != null
                                                        ? `${formatAmount(campaign.goal_quantity)} ${campaign.goal_item_name?.trim() || "items"}`
                                                        : "Not specified"
                                                }
                                                icon={Package}
                                            />

                                            <DetailField
                                                label="Items collected"
                                                value={`${formatAmount(campaign.collected_quantity)} ${campaign.goal_item_name?.trim() || "items"}`}
                                                icon={Package}
                                            />
                                        </>
                                    )}
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Campaign timeline"
                                    description="The scheduled start and end dates."
                                    icon={CalendarDays}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailField
                                        label="Start date"
                                        value={formatDate(campaign.start_date)}
                                        icon={CalendarDays}
                                    />

                                    <DetailField
                                        label="End date"
                                        value={formatDate(campaign.end_date)}
                                        icon={CalendarDays}
                                    />

                                    <div className="sm:col-span-2">
                                        <DetailField
                                            label="Record created"
                                            value={formatDate(
                                                campaign.created_at
                                            )}
                                            icon={Clock3}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Associated NGO"
                                    description="The organization responsible for this campaign."
                                    icon={Layers3}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailField
                                        label="NGO name"
                                        value={campaign.ngo?.name}
                                        icon={Layers3}
                                    />

                                    <DetailField
                                        label="NGO registration number"
                                        value={
                                            campaign.ngo?.registration_number
                                        }
                                        icon={CheckCircle2}
                                    />

                                    <DetailField
                                        label="NGO email"
                                        value={campaign.ngo?.email}
                                    />

                                    <DetailField
                                        label="NGO phone"
                                        value={campaign.ngo?.phone}
                                    />

                                    <div className="sm:col-span-2">
                                        <DetailField
                                            label="NGO address"
                                            value={campaign.ngo?.address}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Record ownership and review"
                                    description="The users recorded as the campaign creator and reviewer."
                                    icon={UserRound}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                                        <p className="text-xs font-medium text-[#718071]">
                                            Created by
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                                            {getPersonName(
                                                campaign.created_by
                                            )}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-[#718071]">
                                            {campaign.created_by?.email ||
                                                "No email available"}
                                        </p>

                                        <p className="mt-1 text-xs text-[#718071]">
                                            Role:{" "}
                                            {campaign.created_by?.role ||
                                                "Unknown"}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                                        <p className="text-xs font-medium text-[#718071]">
                                            Reviewed by
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                                            {getPersonName(
                                                campaign.reviewed_by
                                            )}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-[#718071]">
                                            {campaign.reviewed_by?.email ||
                                                "No reviewer recorded"}
                                        </p>

                                        <p className="mt-1 text-xs text-[#718071]">
                                            Role:{" "}
                                            {campaign.reviewed_by?.role ||
                                                "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : null}
                </div>

                <footer className="flex justify-end border-t border-[#E1E9DC] bg-[#F7F9F3] px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                    >
                        Close
                    </button>
                </footer>
            </section>
        </div>
    );
}