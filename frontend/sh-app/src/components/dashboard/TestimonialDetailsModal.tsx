"use client";

import { useEffect, useState } from "react";

import {
    CalendarDays,
    Clock3,
    Mail,
    MessageSquareQuote,
    Phone,
    ShieldCheck,
    Star,
    UserRound,
    X,
    XCircle,
    BadgeCheck,
} from "lucide-react";

import { getTestimonialById } from "@/services/testimonialService";
import type { Testimonial } from "@/types/testimonial";

import TestimonialDetailsModalSkeleton from "@/components/skeleton/dashboard/TestimonialDetailsModalSkeleton";

interface TestimonialDetailsModalProps {
    isOpen: boolean;
    testimonialId: number | null;
    onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function formatDate(value?: string | null): string {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function getMediaUrl(path: string | null | undefined): string {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getFullName(user: NonNullable<Testimonial["user"]>): string {
    const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

    return fullName || user.username || "Unknown user";
}

function getRoleLabel(role: string): string {
    switch (role) {
        case "ADMIN":
            return "Administrator";
        case "DONOR":
            return "Donor";
        case "NGO_ADMIN":
            return "NGO Admin";
        case "NGO_STAFF":
            return "NGO Staff";
        default:
            return role.replaceAll("_", " ");
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object") {
        const errorObject = error as Record<string, unknown>;

        if (typeof errorObject.message === "string") {
            return errorObject.message;
        }

        if (typeof errorObject.detail === "string") {
            return errorObject.detail;
        }

        if (typeof errorObject.error === "string") {
            return errorObject.error;
        }
    }

    return "Unable to load this testimonial. Please try again.";
}

function DetailField({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number | null | undefined;
    icon?: typeof UserRound;
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
                {value === null || value === undefined || value === ""
                    ? "Not provided"
                    : value}
            </p>
        </div>
    );
}

function UserProfile({
    testimonial,
}: {
    testimonial: Testimonial;
}) {
    const [imageFailed, setImageFailed] = useState(false);

    const user = testimonial.user;
    const profilePicture = getMediaUrl(user?.profile_picture);
    const fullName = user ? getFullName(user) : "Unknown user";

    useEffect(() => {
        setImageFailed(false);
    }, [profilePicture]);

    return (
        <section className="flex min-w-0 items-center gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534]">
                {profilePicture && !imageFailed ? (
                    <img
                        src={profilePicture}
                        alt={`${fullName} profile`}
                        className="h-full w-full object-cover"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <UserRound size={28} />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <h3 className="break-words text-lg font-bold text-[#183B2A]">
                    {fullName}
                </h3>

                <p className="mt-1 truncate text-sm text-[#718071]">
                    {user?.username ? `@${user.username}` : "No username available"}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE8D7] bg-[#F0F7ED] px-3 py-1 text-xs font-semibold text-[#35543B]">
                        <ShieldCheck size={13} />
                        {user ? getRoleLabel(user.role) : "Unknown role"}
                    </span>

                    {user?.is_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E5F2E1] px-3 py-1 text-xs font-semibold text-[#166534]">
                            <BadgeCheck size={13} />
                            Verified
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function TestimonialDetailsModal({
    isOpen,
    testimonialId,
    onClose,
}: TestimonialDetailsModalProps) {
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        if (!isOpen || testimonialId === null) {
            setTestimonial(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        const id = testimonialId;
        let isCurrentRequest = true;

        async function fetchDetails() {
            setIsLoading(true);
            setError(null);
            setTestimonial(null);

            try {
                const response = await getTestimonialById(id);

                if (isCurrentRequest) {
                    setTestimonial(response);
                }
            } catch (err: unknown) {
                console.error("Failed to fetch testimonial details:", err);

                if (isCurrentRequest) {
                    setError(getErrorMessage(err));
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
    }, [isOpen, testimonialId, retryKey]);

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

    const user = testimonial?.user;

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
                aria-labelledby="testimonial-details-title"
                className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] shadow-2xl sm:rounded-3xl"
            >
                {/* Header */}
                <header className="flex items-start justify-between gap-4 border-b border-[#E1E9DC] px-5 py-5 sm:px-7">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <MessageSquareQuote size={24} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#27824B]">
                                Platform feedback
                            </p>

                            <h2
                                id="testimonial-details-title"
                                className="mt-1 break-words text-xl font-bold text-[#183B2A] sm:text-2xl"
                            >
                                {isLoading
                                    ? "Loading testimonial..."
                                    : testimonial
                                        ? `Testimonial #${testimonial.id}`
                                        : "Testimonial Details"}
                            </h2>

                            <p className="mt-1 text-sm text-[#718071]">
                                Complete testimonial and submitter information
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close testimonial details"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#617263] transition hover:bg-[#EAF2E5] hover:text-[#183B2A]"
                    >
                        <X size={21} />
                    </button>
                </header>

                {/* Body */}
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                    {isLoading ? (
                        <TestimonialDetailsModalSkeleton />
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
                                        Unable to load testimonial details
                                    </h3>

                                    <p className="mt-2 break-words text-sm leading-6 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setRetryKey((current) => current + 1);
                                }}
                                className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                            >
                                Try again
                            </button>
                        </div>
                    ) : testimonial ? (
                        <div className="space-y-7">
                            {/* Submitter */}
                            {user ? (
                                <UserProfile testimonial={testimonial} />
                            ) : (
                                <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5">
                                    <div className="flex items-center gap-3">
                                        <UserRound
                                            size={24}
                                            className="text-[#718071]"
                                        />
                                        <div>
                                            <h3 className="font-bold text-[#183B2A]">
                                                User information unavailable
                                            </h3>
                                            <p className="mt-1 text-sm text-[#718071]">
                                                No registered user is associated with this testimonial.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Full Testimonial */}
                            <section>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                            <MessageSquareQuote size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#183B2A]">
                                                Testimonial content
                                            </h3>
                                            <p className="mt-1 text-sm text-[#718071]">
                                                Full submitted feedback
                                            </p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                                        Rating: {testimonial.rating}/5
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-5 sm:p-6">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star
                                                key={index}
                                                size={19}
                                                className={
                                                    index < testimonial.rating
                                                        ? "fill-amber-400 text-amber-500"
                                                        : "text-[#D5DED0]"
                                                }
                                            />
                                        ))}

                                        <span className="ml-2 text-sm font-semibold text-[#526B56]">
                                            {testimonial.rating} out of 5
                                        </span>
                                    </div>

                                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-[#35543B]">
                                        {testimonial.comment || "No comment provided."}
                                    </p>
                                </div>
                            </section>

                            {/* Submission Information */}
                            <section>
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                        <CalendarDays size={19} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-[#183B2A]">
                                            Submission information
                                        </h3>
                                        <p className="mt-1 text-sm text-[#718071]">
                                            Testimonial record details
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailField
                                        label="Testimonial ID"
                                        value={`#${testimonial.id}`}
                                        icon={MessageSquareQuote}
                                    />

                                    <DetailField
                                        label="Submitted on"
                                        value={formatDate(testimonial.created_at)}
                                        icon={Clock3}
                                    />
                                </div>
                            </section>

                            {/* User Information */}
                            {user && (
                                <section>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                            <UserRound size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#183B2A]">
                                                Submitter information
                                            </h3>
                                            <p className="mt-1 text-sm text-[#718071]">
                                                Account details associated with this testimonial
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <DetailField
                                            label="Full name"
                                            value={getFullName(user)}
                                            icon={UserRound}
                                        />

                                        <DetailField
                                            label="Username"
                                            value={`@${user.username}`}
                                            icon={UserRound}
                                        />

                                        <DetailField
                                            label="Email address"
                                            value={user.email}
                                            icon={Mail}
                                        />

                                        <DetailField
                                            label="Phone number"
                                            value={user.phone}
                                            icon={Phone}
                                        />

                                        <DetailField
                                            label="Account role"
                                            value={getRoleLabel(user.role)}
                                            icon={ShieldCheck}
                                        />

                                        <DetailField
                                            label="Account status"
                                            value={user.is_active ? "Active" : "Inactive"}
                                            icon={ShieldCheck}
                                        />

                                        <DetailField
                                            label="Email verification"
                                            value={user.is_verified ? "Verified" : "Not verified"}
                                            icon={ShieldCheck}
                                        />

                                        <DetailField
                                            label="Date joined"
                                            value={formatDate(user.date_joined)}
                                            icon={CalendarDays}
                                        />

                                        <div className="sm:col-span-2">
                                            <DetailField
                                                label="Last login"
                                                value={formatDate(user.last_login)}
                                                icon={Clock3}
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <footer className="flex justify-end border-t border-[#E1E9DC] bg-[#F7F9F3] px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Close
                    </button>
                </footer>
            </section>
        </div>
    );
}
