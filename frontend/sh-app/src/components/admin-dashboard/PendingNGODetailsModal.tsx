"use client";

import { useEffect, useState } from "react";
import {
    AlertCircle,
    Building2,
    CalendarDays,
    Clock3,
    ImageIcon,
    MinusCircle,
    X,
} from "lucide-react";

import {
    getNGOById,
    getPendingNGOChangeById,
} from "@/services/ngoService";

import type {
    NGOListItem,
    PendingNGOChange,
} from "@/types/ngo";

import PendingNGODetailsModalSkeleton from "@/components/skeleton/admin-dashboard/PendingNGODetailsModalSkeleton";

interface PendingNGODetailsModalProps {
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

function getRelatedNGOId(change: PendingNGOChange): number {
    return typeof change.ngo === "number" ? change.ngo : change.ngo.id;
}

function getRequesterName(change: PendingNGOChange): string {
    const firstName = change.submitted_by?.first_name?.trim() ?? "";
    const lastName = change.submitted_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || change.submitted_by?.username || "Unknown user";
}

function formatDate(value: string | null | undefined): string {
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
                        className="h-full w-full object-contain"
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
    ngoName,
}: {
    currentImage: string | null;
    proposedImage: string | null;
    ngoName: string;
}) {
    const hasChanged = !areImagesEqual(currentImage, proposedImage);

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[#35543B]">
                    NGO Logo
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
                    label="Existing Logo"
                    image={getImageUrl(currentImage)}
                    alt={`${ngoName} existing logo`}
                />

                <ComparisonImage
                    label="Proposed Logo"
                    image={getImageUrl(proposedImage)}
                    alt={`${ngoName} proposed logo`}
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

    return "Unable to load NGO profile change details. Please try again.";
}

export default function PendingNGODetailsModal({
    isOpen,
    changeId,
    onClose,
}: PendingNGODetailsModalProps) {
    const [change, setChange] = useState<PendingNGOChange | null>(null);
    const [ngo, setNgo] = useState<NGOListItem | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (!isOpen || changeId === null) {
            setChange(null);
            setNgo(null);
            setError(null);
            return;
        }

        let isActive = true;

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            setChange(null);
            setNgo(null);

            try {
                const changeResponse = await getPendingNGOChangeById(changeId);

                if (!isActive) return;

                setChange(changeResponse);

                const ngoId = getRelatedNGOId(changeResponse);
                const ngoResponse = await getNGOById(ngoId);

                if (isActive) {
                    setNgo(ngoResponse);
                }
            } catch (err: unknown) {
                console.error(
                    "Failed to fetch pending NGO change details:",
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
        return <PendingNGODetailsModalSkeleton />;
    }

    const ngoName = ngo?.name || change?.name || "NGO";

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
                aria-labelledby="ngo-change-details-title"
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
                            id="ngo-change-details-title"
                            className="mt-3 text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            NGO Profile Change Details
                        </h2>

                        <p className="mt-1 text-sm text-[#647568]">
                            Compare the existing NGO profile with the
                            organization&apos;s proposed modifications.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close NGO change details"
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
                    ) : change && ngo ? (
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
                                            {getRequesterName(change)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#FAFCF8] p-3">
                                        <p className="text-xs text-[#829184]">
                                            NGO
                                        </p>

                                        <p className="mt-2 flex items-center gap-1.5 break-words text-sm font-semibold text-[#35543B]">
                                            <Building2
                                                size={14}
                                                className="shrink-0"
                                            />
                                            {ngo.name || "NGO not specified"}
                                        </p>

                                        <p className="mt-1 text-xs text-[#829184]">
                                            NGO #{ngo.id}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                                <div className="mb-5">
                                    <h3 className="text-base font-bold text-[#183B2A]">
                                        NGO Profile Comparison
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-[#829184]">
                                        Existing values are shown on the left.
                                        Proposed values are shown on the right.
                                        Unchanged fields are marked accordingly.
                                    </p>
                                </div>

                                <ComparisonImageSection
                                    currentImage={ngo.ngo_logo}
                                    proposedImage={change.ngo_logo}
                                    ngoName={ngoName}
                                />

                                <div className="mt-5 border-t border-[#EDF2E9]">
                                    <ComparisonField
                                        label="NGO Name"
                                        currentValue={
                                            ngo.name || "Not specified"
                                        }
                                        proposedValue={
                                            change.name || "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(ngo.name) !==
                                            normalizeText(change.name)
                                        }
                                    />

                                    <ComparisonField
                                        label="Registration Number"
                                        currentValue={
                                            ngo.registration_number ||
                                            "Not specified"
                                        }
                                        proposedValue={
                                            change.registration_number ||
                                            "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(
                                                ngo.registration_number
                                            ) !==
                                            normalizeText(
                                                change.registration_number
                                            )
                                        }
                                    />

                                    <ComparisonField
                                        label="Description"
                                        currentValue={
                                            <p className="whitespace-pre-wrap">
                                                {ngo.description ||
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
                                            normalizeText(ngo.description) !==
                                            normalizeText(change.description)
                                        }
                                    />

                                    <ComparisonField
                                        label="Email Address"
                                        currentValue={
                                            ngo.email || "Not specified"
                                        }
                                        proposedValue={
                                            change.email || "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(ngo.email) !==
                                            normalizeText(change.email)
                                        }
                                    />

                                    <ComparisonField
                                        label="Phone Number"
                                        currentValue={
                                            ngo.phone || "Not specified"
                                        }
                                        proposedValue={
                                            change.phone || "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(ngo.phone) !==
                                            normalizeText(change.phone)
                                        }
                                    />

                                    <ComparisonField
                                        label="Address"
                                        currentValue={
                                            ngo.address || "Not specified"
                                        }
                                        proposedValue={
                                            change.address || "Not specified"
                                        }
                                        hasChanged={
                                            normalizeText(ngo.address) !==
                                            normalizeText(change.address)
                                        }
                                    />
                                </div>
                            </section>

                            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                                <p className="text-sm leading-6 text-amber-800">
                                    Review the proposed values carefully before
                                    making an approval decision. The existing
                                    NGO profile remains unchanged until this
                                    edit request is processed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-72 items-center justify-center text-sm text-[#647568]">
                            NGO profile change details are unavailable.
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