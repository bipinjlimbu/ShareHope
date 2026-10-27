"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    AlertCircle,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Search,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";
import { authFetch } from "@/lib/api";
import { getNGOs, rejectNGO } from "@/services/ngoService";
import type { NGOListItem } from "@/types/ngo";
import PendingNGOsSkeleton from "@/components/skeleton/admin-dashboard/PendingNGOsSkeleton";
import NGODetailsModal from "@/components/admin-dashboard/NGODetailsModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

type ReviewStatus = "APPROVED" | "REJECTED";

function getNGOLogoUrl(path: string | null): string | null {
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

function getDisplayName(ngo: NGOListItem): string {
    const firstName = ngo.created_by?.first_name?.trim() ?? "";
    const lastName = ngo.created_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || ngo.created_by?.username || "Unknown user";
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

function NGOLogo({ ngo }: { ngo: NGOListItem }) {
    const [imageFailed, setImageFailed] = useState(false);
    const logoUrl = getNGOLogoUrl(ngo.ngo_logo);

    useEffect(() => {
        setImageFailed(false);
    }, [ngo.ngo_logo]);

    return (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#E5F2E1] text-[#166534]">
            {logoUrl && !imageFailed ? (
                <img
                    src={logoUrl}
                    alt={`${ngo.name} logo`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <Building2 size={26} />
            )}
        </div>
    );
}

function ReviewConfirmationModal({
    ngo,
    decision,
    isSubmitting,
    error,
    onConfirm,
    onCancel,
}: {
    ngo: NGOListItem | null;
    decision: ReviewStatus | null;
    isSubmitting: boolean;
    error: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!ngo || !decision) return null;

    const isApproval = decision === "APPROVED";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#10271A]/50 p-4 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) {
                    onCancel();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-confirmation-title"
                className="w-full max-w-md rounded-3xl border border-[#E1E9DC] bg-[#FFFCF6] p-6 shadow-2xl sm:p-7"
            >
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isApproval
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}
                >
                    {isApproval ? (
                        <CheckCircle2 size={25} />
                    ) : (
                        <AlertCircle size={25} />
                    )}
                </div>

                <h2
                    id="review-confirmation-title"
                    className="mt-5 text-xl font-bold text-[#183B2A]"
                >
                    {isApproval
                        ? "Approve NGO application?"
                        : "Reject NGO application?"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6A796B]">
                    {isApproval
                        ? "This will mark the application as approved. Confirm that the organization's submitted details have been reviewed."
                        : "This will mark the application as rejected. Make sure the submitted application has been reviewed before continuing."}
                </p>

                <div className="mt-4 rounded-xl border border-[#E1E9DC] bg-white p-4">
                    <p className="break-words font-semibold text-[#183B2A]">
                        {ngo.name}
                    </p>
                    <p className="mt-1 text-sm text-[#6A796B]">
                        Registration No.{" "}
                        {ngo.registration_number || "Not provided"}
                    </p>
                    <p className="mt-1 text-xs text-[#7B887B]">
                        NGO ID: #{ngo.id}
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
                    >
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                        <span className="break-words">{error}</span>
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-xl border border-[#DDE7D9] bg-white px-4 py-3 text-sm font-semibold text-[#35543B] transition hover:bg-[#F0F7ED] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60 ${isApproval
                            ? "bg-[#166534] hover:bg-[#14532D]"
                            : "bg-red-700 hover:bg-red-800"
                            }`}
                    >
                        {isSubmitting && (
                            <RefreshCw size={15} className="animate-spin" />
                        )}
                        {isSubmitting
                            ? "Submitting..."
                            : isApproval
                                ? "Confirm Approval"
                                : "Confirm Rejection"}
                    </button>
                </div>
            </section>
        </div>
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
    const [ngos, setNgos] = useState<NGOListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNGOId, setSelectedNGOId] = useState<number | null>(null);

    const [selectedReviewNGO, setSelectedReviewNGO] =
        useState<NGOListItem | null>(null);
    const [reviewDecision, setReviewDecision] = useState<ReviewStatus | null>(
        null
    );
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionSuccess, setActionSuccess] = useState("");

    const fetchPendingNGOs = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setLoadError("");

        try {
            const response = await getNGOs();
            const allNGOs = Array.isArray(response) ? response : [];

            setNgos(
                allNGOs.filter(
                    (ngo) => ngo.status?.toUpperCase() === "PENDING"
                )
            );
        } catch (error: unknown) {
            console.error(
                "Failed to fetch pending NGO applications:",
                error
            );

            setLoadError(
                getErrorMessage(
                    error,
                    "Unable to load pending NGO applications. Please try again."
                )
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
    }, []);

    useEffect(() => {
        void fetchPendingNGOs();
    }, [fetchPendingNGOs]);

    const filteredNGOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return ngos;

        return ngos.filter((ngo) => {
            const searchableText = [
                ngo.name,
                ngo.registration_number,
                ngo.email,
                ngo.phone,
                ngo.address,
                getDisplayName(ngo),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [ngos, searchQuery]);

    const openReviewConfirmation = (
        ngo: NGOListItem,
        decision: ReviewStatus
    ) => {
        setSelectedReviewNGO(ngo);
        setReviewDecision(decision);
        setReviewError("");
        setActionError("");
        setActionSuccess("");
    };

    const closeReviewConfirmation = () => {
        if (isSubmittingReview) return;

        setSelectedReviewNGO(null);
        setReviewDecision(null);
        setReviewError("");
    };

    const handleReviewDecision = async () => {
        if (!selectedReviewNGO || !reviewDecision || isSubmittingReview) {
            return;
        }

        const ngoToReview = selectedReviewNGO;
        const decision = reviewDecision;

        setIsSubmittingReview(true);
        setReviewError("");
        setActionError("");
        setActionSuccess("");

        try {
            if (decision === "APPROVED") {
                await authFetch(`/ngo/${ngoToReview.id}/`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: decision,
                    }),
                });
            } else {
                await rejectNGO(ngoToReview.id);
            }

            setNgos((currentNGOs) =>
                currentNGOs.filter((ngo) => ngo.id !== ngoToReview.id)
            );

            setSelectedReviewNGO(null);
            setReviewDecision(null);

            setActionSuccess(
                decision === "APPROVED"
                    ? `${ngoToReview.name} has been approved successfully.`
                    : `${ngoToReview.name} has been rejected.`
            );
        } catch (error: unknown) {
            console.error("Failed to review NGO application:", error);

            setReviewError(
                getErrorMessage(
                    error,
                    `Unable to ${decision === "APPROVED" ? "approve" : "reject"
                    } this NGO application. Please try again.`
                )
            );
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const clearSearch = () => setSearchQuery("");

    if (isLoading) {
        return <PendingNGOsSkeleton />;
    }

    return (
        <>
            <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
                <div className="mx-auto w-full max-w-[1600px]">
                    <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                                Pending NGO Applications
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                                Review submitted organization applications and
                                decide whether each NGO should be approved or
                                rejected.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 text-sm text-[#183B2A] sm:self-auto">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <Building2 size={19} />
                            </div>

                            <div>
                                <p className="text-xl font-bold leading-6">
                                    {ngos.length.toLocaleString("en-NP")}
                                </p>
                                <p className="mt-0.5 text-xs text-[#647568]">
                                    Pending NGOs
                                </p>
                            </div>
                        </div>
                    </header>

                    {loadError && (
                        <section
                            role="alert"
                            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <AlertCircle
                                        size={21}
                                        className="mt-0.5 shrink-0 text-red-600"
                                    />
                                    <div>
                                        <h2 className="font-semibold text-red-800">
                                            Could not load applications
                                        </h2>
                                        <p className="mt-1 break-words text-sm leading-6 text-red-700">
                                            {loadError}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => void fetchPendingNGOs()}
                                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                                >
                                    Try again
                                </button>
                            </div>
                        </section>
                    )}

                    {actionError && (
                        <div
                            role="alert"
                            className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                        >
                            <AlertCircle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />
                            <span className="break-words">{actionError}</span>
                            <button
                                type="button"
                                onClick={() => setActionError("")}
                                aria-label="Dismiss error"
                                className="ml-auto shrink-0 rounded-lg p-1 hover:bg-red-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {actionSuccess && (
                        <div
                            role="status"
                            className="mb-6 flex items-start gap-2 rounded-2xl border border-[#D8E8D4] bg-[#E5F2E1] p-4 text-sm text-[#166534]"
                        >
                            <CheckCircle2
                                size={19}
                                className="mt-0.5 shrink-0"
                            />
                            <span className="break-words">{actionSuccess}</span>
                            <button
                                type="button"
                                onClick={() => setActionSuccess("")}
                                aria-label="Dismiss success message"
                                className="ml-auto shrink-0 rounded-lg p-1 hover:bg-[#D8E8D4]"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {!loadError && (
                        <>
                            <section
                                aria-label="Pending NGO statistics"
                                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                            >
                                <SummaryCard
                                    title="Pending applications"
                                    value={ngos.length}
                                    description="Applications awaiting an admin decision"
                                    icon={Clock3}
                                />

                                <SummaryCard
                                    title="Applications shown"
                                    value={filteredNGOs.length}
                                    description="Applications matching your search"
                                    icon={Building2}
                                />

                                <SummaryCard
                                    title="Review status"
                                    value={ngos.length}
                                    description="Each application requires an approval or rejection decision"
                                    icon={ShieldCheck}
                                />
                            </section>

                            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                                <div className="relative min-w-0">
                                    <Search
                                        size={19}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />

                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(event.target.value)
                                        }
                                        placeholder="Search NGO name, registration number, email or phone..."
                                        aria-label="Search pending NGO applications"
                                        className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                    />

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            aria-label="Clear search"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] transition hover:bg-[#E5F2E1]"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </section>

                            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                <div>
                                    <h2 className="text-xl font-bold text-[#183B2A]">
                                        Applications awaiting review
                                    </h2>
                                    <p className="mt-1 text-sm text-[#647568]">
                                        Showing {filteredNGOs.length} of{" "}
                                        {ngos.length} applications
                                    </p>
                                </div>
                            </div>

                            {filteredNGOs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                        {ngos.length === 0 ? (
                                            <CheckCircle2 size={25} />
                                        ) : (
                                            <Search size={25} />
                                        )}
                                    </div>

                                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                        {ngos.length === 0
                                            ? "No pending applications"
                                            : "No matching applications"}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                        {ngos.length === 0
                                            ? "There are no NGO applications waiting for review right now."
                                            : "Try another search term to find the application you need."}
                                    </p>

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <section
                                    aria-label="Pending NGO applications"
                                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                                >
                                    {filteredNGOs.map((ngo) => (
                                        <article
                                            key={ngo.id}
                                            className="group rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6 lg:p-7"
                                        >
                                            <div className="flex items-start gap-4">
                                                <NGOLogo ngo={ngo} />

                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="break-words text-lg font-bold text-[#183B2A]">
                                                            {ngo.name}
                                                        </h3>

                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                                            <Clock3 size={13} />
                                                            Pending
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-sm text-[#647568]">
                                                        Registration No.{" "}
                                                        <span className="font-medium text-[#35543B]">
                                                            {ngo.registration_number ||
                                                                "Not provided"}
                                                        </span>
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#829184]">
                                                        NGO ID: #{ngo.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {ngo.description && (
                                                <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#647568]">
                                                    {ngo.description}
                                                </p>
                                            )}

                                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                    <Mail
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#35A45C]"
                                                    />
                                                    <span className="break-all">
                                                        {ngo.email ||
                                                            "No email provided"}
                                                    </span>
                                                </p>

                                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                                    <Phone
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#35A45C]"
                                                    />
                                                    <span className="break-words">
                                                        {ngo.phone ||
                                                            "No phone provided"}
                                                    </span>
                                                </p>

                                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568] sm:col-span-2">
                                                    <MapPin
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-[#35A45C]"
                                                    />
                                                    <span className="break-words">
                                                        {ngo.address ||
                                                            "No address provided"}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="my-5 border-t border-[#EDF2E9]" />

                                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                                <p className="flex items-center gap-2 text-sm text-[#647568]">
                                                    <FileText
                                                        size={15}
                                                        className="shrink-0 text-[#35A45C]"
                                                    />
                                                    <span>
                                                        {ngo.document_count ??
                                                            ngo.documents?.length ??
                                                            0}{" "}
                                                        documents
                                                    </span>
                                                </p>

                                                <p className="flex items-center gap-2 text-sm text-[#647568]">
                                                    <Users
                                                        size={15}
                                                        className="shrink-0 text-[#35A45C]"
                                                    />
                                                    <span>
                                                        {ngo.membership_count ??
                                                            ngo.members?.length ??
                                                            0}{" "}
                                                        members
                                                    </span>
                                                </p>

                                                <p className="flex items-center gap-2 text-sm text-[#647568] sm:col-span-2">
                                                    <CalendarDays
                                                        size={15}
                                                        className="shrink-0 text-[#35A45C]"
                                                    />
                                                    <span>
                                                        Submitted{" "}
                                                        {formatDate(
                                                            ngo.created_at
                                                        )}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="my-5 border-t border-[#EDF2E9]" />

                                            <p className="text-xs text-[#829184]">
                                                Submitted by{" "}
                                                <span className="font-semibold text-[#526B56]">
                                                    {getDisplayName(ngo)}
                                                </span>
                                            </p>

                                            <div className="mt-5 space-y-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedNGOId(ngo.id)
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                                >
                                                    <Building2 size={16} />
                                                    View Application
                                                </button>

                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openReviewConfirmation(
                                                                ngo,
                                                                "APPROVED"
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#E5F2E1]"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                        Approve
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openReviewConfirmation(
                                                                ngo,
                                                                "REJECTED"
                                                            )
                                                        }
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <X size={16} />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </section>
                            )}
                        </>
                    )}

                    <p className="mt-8 text-center text-xs leading-5 text-[#829184]">
                        Review NGO registration details carefully before
                        approving or rejecting an application.
                    </p>
                </div>
            </main>

            <NGODetailsModal
                isOpen={selectedNGOId !== null}
                ngoId={selectedNGOId}
                onClose={() => setSelectedNGOId(null)}
            />

            <ReviewConfirmationModal
                ngo={selectedReviewNGO}
                decision={reviewDecision}
                isSubmitting={isSubmittingReview}
                error={reviewError}
                onConfirm={() => void handleReviewDecision()}
                onCancel={closeReviewConfirmation}
            />
        </>
    );
}