"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Heart,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Users,
} from "lucide-react";

import { getCampaignById } from "@/services/campaignService";
import { getProfile } from "@/services/profileService";
import { getAuthStatus } from "@/lib/authStatus";

import CampaignDetailsPageSkeleton from "@/components/skeleton/main/CampaignDetailsPageSkeleton";

import type { Campaign } from "@/types/campaign";

type Viewer = {
    id: number;
    role: string;
};

type ViewerStatus = "loading" | "ready";

function getImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    if (!apiUrl) return path;

    return `${apiUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(date: string): string {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(parsedDate);
}

function formatMoney(amount: string | null, currency: string): string {
    const value = Number(amount ?? 0);

    if (!Number.isFinite(value)) {
        return `${currency || "NPR"} 0`;
    }

    try {
        return new Intl.NumberFormat("en-NP", {
            style: "currency",
            currency: currency || "NPR",
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency || "NPR"} ${value.toLocaleString("en-NP")}`;
    }
}

function getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);

    if (Number.isNaN(end.getTime())) return 0;

    const today = new Date();

    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.max(
        0,
        Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );
}

export default function CampaignDetailsPage() {
    const params = useParams<{ id: string }>();
    const campaignId = Number(params.id);

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [isCampaignLoading, setIsCampaignLoading] = useState(true);
    const [campaignError, setCampaignError] = useState("");

    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [viewerStatus, setViewerStatus] = useState<ViewerStatus>("loading");

    const [donateMessage, setDonateMessage] = useState("");

    const loadViewer = useCallback(async () => {
        if (!getAuthStatus()) {
            setViewer(null);
            setViewerStatus("ready");
            return;
        }

        setViewerStatus("loading");

        try {
            const profile = await getProfile();

            setViewer({
                id: Number(profile.user.id),
                role: profile.user.role,
            });
        } catch {
            setViewer({
                id: -1,
                role: "UNKNOWN",
            });
        } finally {
            setViewerStatus("ready");
        }
    }, []);

    useEffect(() => {
        let active = true;

        async function loadCampaign() {
            if (!Number.isInteger(campaignId) || campaignId <= 0) {
                setCampaignError("The campaign link is invalid.");
                setIsCampaignLoading(false);
                return;
            }

            setIsCampaignLoading(true);
            setCampaignError("");

            try {
                const response = await getCampaignById(campaignId);

                if (active) {
                    setCampaign(response);
                }
            } catch {
                if (active) {
                    setCampaignError(
                        "We couldn't load this campaign. It may have been removed or is temporarily unavailable."
                    );
                }
            } finally {
                if (active) {
                    setIsCampaignLoading(false);
                }
            }
        }

        void loadCampaign();
        void loadViewer();

        const handleAuthChange = () => {
            void loadViewer();
        };

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            active = false;
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [campaignId, loadViewer]);

    const campaignImage = useMemo(
        () => getImageUrl(campaign?.campaign_image ?? null),
        [campaign?.campaign_image]
    );

    if (isCampaignLoading) {
        return <CampaignDetailsPageSkeleton />;
    }

    if (campaignError || !campaign) {
        return (
            <main className="min-h-screen bg-[#FFFCF6] px-4 py-16">
                <div className="mx-auto w-full max-w-lg rounded-3xl border border-[#E5EBDD] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF6E9] text-[#166534]">
                        <Heart size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#183B2A]">
                        Campaign unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        {campaignError || "This campaign could not be found."}
                    </p>

                    <Link
                        href="/campaigns"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        <ArrowLeft size={18} />
                        Explore campaigns
                    </Link>
                </div>
            </main>
        );
    }

    const isFundCampaign =
        campaign.donation_type === "FUND" ||
        campaign.donation_type === "BOTH";

    const isItemCampaign =
        campaign.donation_type === "ITEM" ||
        campaign.donation_type === "BOTH";

    const collectedAmount = Number(campaign.collected_amount ?? 0);
    const goalAmount = Number(campaign.goal_amount ?? 0);

    const fundProgress =
        goalAmount > 0
            ? Math.min((collectedAmount / goalAmount) * 100, 100)
            : 0;

    const itemProgress =
        campaign.goal_quantity && campaign.goal_quantity > 0
            ? Math.min(
                (campaign.collected_quantity / campaign.goal_quantity) * 100,
                100
            )
            : 0;

    const daysRemaining = getDaysRemaining(campaign.end_date);
    const ngo = campaign.ngo;
    const ngoAdmin = ngo.created_by;

    const adminFullName = [
        ngoAdmin.first_name,
        ngoAdmin.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    const isCampaignCreator =
        viewer?.role === "NGO_ADMIN" &&
        viewer.id === campaign.created_by.id;

    const isCampaignActive = campaign.status === "ACTIVE";

    const canDonate =
        viewerStatus === "ready" &&
        isCampaignActive &&
        (!viewer || viewer.role === "DONOR");

    const showCreatorDashboard =
        viewerStatus === "ready" && isCampaignCreator;

    function handleDonateClick() {
        setDonateMessage(
            "The donation process is coming soon. Please check back later."
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] pb-20">
            {/* Back navigation */}
            <div className="bg-[#FFFCF6]">
                <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                    <Link
                        href="/campaigns"
                        className="inline-flex items-center gap-2 rounded-full border border-[#DCE8D8] bg-[#EDF6E9] px-4 py-2.5 text-sm font-semibold text-[#166534] transition hover:border-[#166534] hover:bg-[#E5F2E1]"
                    >
                        <ArrowLeft size={17} />
                        Back to campaigns
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
                    {/* Main campaign information */}
                    <section>
                        {/* Campaign image */}
                        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#E5F2E1] shadow-sm">
                            {campaignImage ? (
                                <img
                                    src={campaignImage}
                                    alt={campaign.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E5F2E1] to-[#CDE5C9]">
                                    <Heart
                                        size={64}
                                        className="text-[#166534]/40"
                                    />
                                </div>
                            )}

                            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#166534] shadow-sm">
                                    {campaign.category}
                                </span>

                                <span className="rounded-full bg-[#166534] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                                    {campaign.donation_type} donation
                                </span>
                            </div>
                        </div>

                        {/* Campaign title and description */}
                        <div className="mt-8">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-full bg-[#E5F2E1] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#166534]">
                                    {campaign.status}
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                    <CalendarDays size={15} />
                                    Created {formatDate(campaign.created_at)}
                                </span>
                            </div>

                            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                                {campaign.title}
                            </h1>

                            <div className="mt-6 whitespace-pre-line text-base leading-8 text-gray-600">
                                {campaign.description}
                            </div>
                        </div>

                        {/* Campaign timeline */}
                        <div className="mt-10 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-[#183B2A]">
                                Campaign timeline
                            </h2>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <CalendarDays size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Start date
                                        </p>
                                        <p className="mt-1 font-semibold text-[#183B2A]">
                                            {formatDate(campaign.start_date)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <Clock3 size={20} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            End date
                                        </p>
                                        <p className="mt-1 font-semibold text-[#183B2A]">
                                            {formatDate(campaign.end_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NGO information */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={21}
                                    className="text-[#166534]"
                                />
                                <h2 className="text-xl font-bold text-[#183B2A]">
                                    About the organization
                                </h2>
                            </div>

                            {/* NGO identity */}
                            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5EBDD] bg-[#EDF6E9]">
                                    {ngo.ngo_logo ? (
                                        <img
                                            src={getImageUrl(ngo.ngo_logo) ?? ""}
                                            alt={ngo.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Users
                                            size={32}
                                            className="text-[#166534]"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-bold text-[#183B2A]">
                                            {ngo.name}
                                        </h3>

                                        {ngo.status === "APPROVED" && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#EDF6E9] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                                                <CheckCircle2 size={13} />
                                                Verified NGO
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-sm leading-7 text-gray-600">
                                        {ngo.description ||
                                            "This organization is working to make a positive difference through this campaign."}
                                    </p>
                                </div>
                            </div>

                            {/* NGO contact and registration details */}
                            <div className="mt-7 grid gap-4 border-t border-[#E5EBDD] pt-6 sm:grid-cols-2">
                                {ngo.registration_number && (
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <ShieldCheck size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Registration number
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#183B2A]">
                                                {ngo.registration_number}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {ngo.address && (
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <MapPin size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Address
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#183B2A]">
                                                {ngo.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {ngo.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <Mail size={18} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${ngo.email}`}
                                                className="mt-1 block break-all text-sm font-semibold text-[#166534] hover:underline"
                                            >
                                                {ngo.email}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {ngo.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <Phone size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Phone
                                            </p>
                                            <a
                                                href={`tel:${ngo.phone}`}
                                                className="mt-1 block text-sm font-semibold text-[#166534] hover:underline"
                                            >
                                                {ngo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* NGO administrator */}
                            <div className="mt-7 border-t border-[#E5EBDD] pt-6">
                                <h3 className="font-bold text-[#183B2A]">
                                    NGO administrator
                                </h3>

                                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#FFFCF6] p-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5EBDD] bg-[#E5F2E1]">
                                        {ngoAdmin.profile_picture ? (
                                            <img
                                                src={
                                                    getImageUrl(
                                                        ngoAdmin.profile_picture
                                                    ) ?? ""
                                                }
                                                alt={
                                                    adminFullName ||
                                                    ngoAdmin.username
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-[#166534]">
                                                {(adminFullName ||
                                                    ngoAdmin.username ||
                                                    "A")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-bold text-[#183B2A]">
                                            {adminFullName ||
                                                ngoAdmin.username}
                                        </p>

                                        <p className="mt-1 truncate text-sm text-gray-500">
                                            @{ngoAdmin.username}
                                        </p>

                                        <span className="mt-2 inline-flex rounded-full bg-[#E5F2E1] px-2.5 py-1 text-xs font-semibold text-[#166534]">
                                            NGO Admin
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-xs text-gray-400">
                                Organization registered on{" "}
                                {formatDate(ngo.created_at)}
                            </div>
                        </div>
                    </section>

                    {/* Donation progress and action */}
                    <aside className="lg:sticky lg:top-8">
                        <div className="overflow-hidden rounded-3xl border border-[#E5EBDD] bg-white shadow-sm">
                            <div className="border-b border-[#E5EBDD] bg-[#EDF6E9] px-6 py-6">
                                <p className="text-sm font-semibold text-[#166534]">
                                    Campaign progress
                                </p>

                                {isFundCampaign && (
                                    <>
                                        <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#183B2A]">
                                            {formatMoney(
                                                campaign.collected_amount,
                                                campaign.currency
                                            )}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            raised of{" "}
                                            {formatMoney(
                                                campaign.goal_amount,
                                                campaign.currency
                                            )}
                                        </p>

                                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
                                            <div
                                                className="h-full rounded-full bg-[#29904C] transition-all"
                                                style={{
                                                    width: `${fundProgress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-2 flex justify-between gap-3 text-xs font-semibold text-gray-600">
                                            <span>
                                                {Math.round(fundProgress)}%
                                                achieved
                                            </span>

                                            <span className="text-right">
                                                {formatMoney(
                                                    String(
                                                        Math.max(
                                                            goalAmount -
                                                            collectedAmount,
                                                            0
                                                        )
                                                    ),
                                                    campaign.currency
                                                )}{" "}
                                                remaining
                                            </span>
                                        </div>
                                    </>
                                )}

                                {isItemCampaign && (
                                    <div
                                        className={
                                            isFundCampaign
                                                ? "mt-7 border-t border-[#D5E7D0] pt-6"
                                                : "mt-3"
                                        }
                                    >
                                        <p className="text-2xl font-extrabold text-[#183B2A]">
                                            {campaign.collected_quantity.toLocaleString(
                                                "en-NP"
                                            )}{" "}
                                            <span className="text-base font-semibold">
                                                {campaign.goal_item_name ||
                                                    "items"}
                                            </span>
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            collected of{" "}
                                            {campaign.goal_quantity?.toLocaleString(
                                                "en-NP"
                                            ) ?? "—"}{" "}
                                            {campaign.goal_item_name || "items"}
                                        </p>

                                        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
                                            <div
                                                className="h-full rounded-full bg-[#29904C] transition-all"
                                                style={{
                                                    width: `${itemProgress}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-2 text-xs font-semibold text-gray-600">
                                            {Math.round(itemProgress)}%
                                            achieved
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-[#FFFCF6] p-4">
                                        <p className="text-xs font-semibold text-gray-500">
                                            Time remaining
                                        </p>

                                        <p className="mt-2 text-2xl font-extrabold text-[#183B2A]">
                                            {daysRemaining}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            days
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[#FFFCF6] p-4">
                                        <p className="text-xs font-semibold text-gray-500">
                                            Campaign status
                                        </p>

                                        <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-[#166534]">
                                            <CheckCircle2 size={16} />
                                            {campaign.status}
                                        </p>
                                    </div>
                                </div>

                                {/* Role-based action */}
                                <div className="mt-7">
                                    {viewerStatus === "loading" ? (
                                        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#DCE8D8]" />
                                    ) : showCreatorDashboard ? (
                                        <Link
                                            href="/dashboard/ngo"
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-6 py-4 font-bold text-white transition hover:bg-[#14532D]"
                                        >
                                            Go to Dashboard
                                            <ArrowRight size={18} />
                                        </Link>
                                    ) : canDonate ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleDonateClick}
                                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-6 py-4 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#14532D] hover:shadow-md"
                                            >
                                                <Heart size={19} />
                                                Donate to this campaign
                                                <ArrowRight size={18} />
                                            </button>

                                            {donateMessage && (
                                                <p
                                                    role="status"
                                                    className="mt-3 rounded-xl bg-[#EDF6E9] px-4 py-3 text-center text-sm leading-6 text-[#166534]"
                                                >
                                                    {donateMessage}
                                                </p>
                                            )}

                                            <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                                                Every contribution can help
                                                make a difference.
                                            </p>
                                        </>
                                    ) : !isCampaignActive &&
                                        (!viewer || viewer.role === "DONOR") ? (
                                        <div className="rounded-2xl border border-[#E5EBDD] bg-[#FFFCF6] px-5 py-5 text-center">
                                            <Clock3
                                                size={25}
                                                className="mx-auto text-[#29904C]"
                                            />

                                            <p className="mt-3 font-bold text-[#183B2A]">
                                                Donations unavailable
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                                This campaign is not currently
                                                active. Donations will be
                                                available when the campaign is
                                                active.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border border-[#E5EBDD] bg-[#FFFCF6] px-5 py-5 text-center">
                                            <ShieldCheck
                                                size={25}
                                                className="mx-auto text-[#29904C]"
                                            />

                                            <p className="mt-3 font-bold text-[#183B2A]">
                                                {viewer?.role === "ADMIN"
                                                    ? "Administrator access"
                                                    : viewer?.role === "NGO_STAFF"
                                                        ? "NGO staff access"
                                                        : viewer?.role === "NGO_ADMIN"
                                                            ? "NGO administrator access"
                                                            : "Account access"}
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                                {viewer?.role === "ADMIN"
                                                    ? "You can manage platform activities from the administrator dashboard."
                                                    : viewer?.role === "NGO_STAFF"
                                                        ? "You can manage your assigned NGO activities from your dashboard."
                                                        : viewer?.role === "NGO_ADMIN"
                                                            ? "This campaign was created by another NGO administrator."
                                                            : "Campaign donations are available to donors and anonymous visitors."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
