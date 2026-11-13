
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
    MessageSquareQuote,
    Search,
    RefreshCw,
    UserRound,
    CalendarDays,
    Mail,
    ShieldCheck,
    Eye,
    Trash2,
    MessageSquare,
    Users,
    XCircle,
} from "lucide-react";

import {
    getTestimonials,
} from "@/services/testimonialService";

import type {
    Testimonial,
    TestimonialListResponse,
} from "@/types/testimonial";

import { useToast } from "@/components/toast/ToastProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const MINIMUM_LOADING_TIME = 500;

function getProfileImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getUserFullName(testimonial: Testimonial): string {
    if (!testimonial.user) {
        return "Anonymous User";
    }

    const firstName = testimonial.user.first_name?.trim() ?? "";
    const lastName = testimonial.user.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || testimonial.user.username || "Unknown User";
}

function getUserInitials(testimonial: Testimonial): string {
    const name = getUserFullName(testimonial);

    if (name === "Anonymous User" || name === "Unknown User") {
        return "AN";
    }

    const words = name.split(" ").filter(Boolean);

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
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

        if (typeof errorObject.general === "string") {
            return errorObject.general;
        }
    }

    return "Unable to load testimonials. Please try again.";
}

function TestimonialsSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-3 py-5 sm:px-5 lg:px-6">
            <div className="mx-auto w-full max-w-[1600px] animate-pulse space-y-7">
                <div className="rounded-2xl border border-[#E5EDE3] bg-white p-6 shadow-sm">
                    <div className="h-8 w-64 rounded-lg bg-[#E5F2E1]" />
                    <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#EDF2E9]" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#E5F2E1]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-[#E5F2E1]" />
                                    <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-2/3 rounded bg-[#EDF2E9]" />
                            </div>
                            <div className="mt-7 flex gap-3">
                                <div className="h-10 flex-1 rounded-xl bg-[#E5F2E1]" />
                                <div className="h-10 flex-1 rounded-xl bg-[#EDF2E9]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
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
    icon: typeof MessageSquareQuote;
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

function TestimonialCard({
    testimonial,
}: {
    testimonial: Testimonial;
}) {
    const [imageFailed, setImageFailed] = useState(false);

    const profilePicture = getProfileImageUrl(
        testimonial.user?.profile_picture ?? null
    );

    useEffect(() => {
        setImageFailed(false);
    }, [profilePicture]);

    return (
        <article className="flex min-w-0 flex-col rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6">
            {/* User Information */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DDE8D7] bg-[#E5F2E1] text-sm font-bold text-[#166534]">
                    {profilePicture && !imageFailed ? (
                        <img
                            src={profilePicture}
                            alt={getUserFullName(testimonial)}
                            className="h-full w-full object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        getUserInitials(testimonial)
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-[#183B2A]">
                        {getUserFullName(testimonial)}
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-[#829184]">
                        {testimonial.user?.username
                            ? `@${testimonial.user.username}`
                            : "No username available"}
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#F1F7ED] px-3 py-1.5 text-[11px] font-semibold text-[#526B56]">
                    #{testimonial.id}
                </span>
            </div>

            {/* Testimonial Content */}
            <div className="mt-5 flex flex-1 flex-col rounded-xl border border-[#E8EDE4] bg-[#FAFCF8] p-4">
                <div className="flex items-center gap-2 text-[#27824B]">
                    <MessageSquareQuote size={17} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#647568]">
                        Testimonial
                    </span>
                </div>

                <p
                    title={testimonial.comment}
                    className="mt-3 truncate whitespace-pre-wrap break-words text-sm leading-7 text-[#526B56]"
                >
                    {testimonial.comment}
                </p>
            </div>

            {/* User Details */}
            <div className="mt-4 space-y-3">
                <div className="flex min-w-0 items-center gap-2 text-xs text-[#829184]">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">
                        {testimonial.user?.email || "Email unavailable"}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs text-[#829184]">
                        <ShieldCheck size={14} />
                        {testimonial.user
                            ? getRoleLabel(testimonial.user.role)
                            : "Unknown role"}
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-[#829184]">
                        <CalendarDays size={14} />
                        {formatDate(testimonial.created_at)}
                    </span>
                </div>
            </div>

            {/* Action Buttons - Disabled Until Services Are Provided */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EDF2E9] pt-5">
                <button
                    type="button"
                    disabled
                    title="View details functionality will be added later"
                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6] px-3 py-3 text-sm font-semibold text-[#829184] opacity-60"
                >
                    <Eye size={16} />
                    View Details
                </button>

                <button
                    type="button"
                    disabled
                    title="Delete functionality will be added later"
                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-3 py-3 text-sm font-semibold text-red-400 opacity-60"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </article>
    );
}

export default function AdminTestimonialsPage() {
    const { showToast } = useToast();

    const [testimonials, setTestimonials] =
        useState<TestimonialListResponse>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTestimonials = useCallback(async () => {
        const startedAt = Date.now();

        setIsLoading(true);
        setError(null);

        try {
            const response = await getTestimonials();

            if (!Array.isArray(response)) {
                throw new Error(
                    "The testimonial API returned an unexpected response."
                );
            }

            setTestimonials(response);
        } catch (err: unknown) {
            console.error("Failed to fetch testimonials:", err);

            const message = getErrorMessage(err);

            setError(message);
            showToast(message, "error");
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(
                0,
                MINIMUM_LOADING_TIME - elapsed
            );

            if (remaining > 0) {
                await new Promise<void>((resolve) => {
                    window.setTimeout(resolve, remaining);
                });
            }

            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        void fetchTestimonials();
    }, [fetchTestimonials]);

    // Only show testimonials submitted by registered non-admin users.
    const visibleTestimonials = useMemo(() => {
        return testimonials.filter(
            (testimonial) =>
                testimonial.user !== null &&
                testimonial.user.role !== "ADMIN"
        );
    }, [testimonials]);

    const donorCount = visibleTestimonials.filter(
        (testimonial) => testimonial.user?.role === "DONOR"
    ).length;

    const ngoAdminCount = visibleTestimonials.filter(
        (testimonial) => testimonial.user?.role === "NGO_ADMIN"
    ).length;

    const ngoStaffCount = visibleTestimonials.filter(
        (testimonial) => testimonial.user?.role === "NGO_STAFF"
    ).length;

    const filteredTestimonials = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return visibleTestimonials;
        }

        return visibleTestimonials.filter((testimonial) => {
            const searchableText = [
                testimonial.comment,
                testimonial.user?.username,
                testimonial.user?.first_name,
                testimonial.user?.last_name,
                testimonial.user?.email,
                testimonial.user?.role,
                String(testimonial.id),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [visibleTestimonials, searchQuery]);

    if (isLoading) {
        return <TestimonialsSkeleton />;
    }

    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                {/* Page Header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                            Testimonials
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                            View and manage testimonials submitted by
                            members of the ShareHope platform.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <MessageSquare size={19} />
                        </div>

                        <div>
                            <p className="text-xl font-bold leading-6 text-[#183B2A]">
                                {visibleTestimonials.length.toLocaleString("en-NP")}
                            </p>
                            <p className="mt-0.5 whitespace-nowrap text-xs text-[#647568]">
                                Total testimonials
                            </p>
                        </div>
                    </div>
                </header>

                {/* Error State */}
                {error ? (
                    <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCEFEA] text-red-600">
                            <XCircle size={25} />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-[#183B2A]">
                            Unable to load testimonials
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#647568]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => void fetchTestimonials()}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                        >
                            <RefreshCw size={16} />
                            Retry loading testimonials
                        </button>
                    </section>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <section
                            aria-label="Testimonial statistics"
                            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                        >
                            <SummaryCard
                                title="Total Testimonials"
                                value={visibleTestimonials.length}
                                description="All testimonials submitted by platform members"
                                icon={MessageSquareQuote}
                            />

                            <SummaryCard
                                title="Donor Entries"
                                value={donorCount}
                                description="Testimonials submitted by donors"
                                icon={Users}
                            />

                            <SummaryCard
                                title="NGO Admin Entries"
                                value={ngoAdminCount}
                                description="Testimonials submitted by NGO administrators"
                                icon={ShieldCheck}
                            />

                            <SummaryCard
                                title="NGO Staff Entries"
                                value={ngoStaffCount}
                                description="Testimonials submitted by NGO staff members"
                                icon={UserRound}
                            />
                        </section>

                        {/* Search */}
                        <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                            <div className="relative">
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
                                    placeholder="Search by user, email, role or testimonial..."
                                    aria-label="Search testimonials"
                                    className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] transition hover:bg-[#E5F2E1]"
                                    >
                                        <span className="sr-only">
                                            Clear search
                                        </span>
                                        <XCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* List Heading */}
                        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <h2 className="text-xl font-bold text-[#183B2A]">
                                    Submitted Testimonials
                                </h2>

                                <p className="mt-1 text-sm text-[#647568]">
                                    Showing{" "}
                                    {filteredTestimonials.length.toLocaleString(
                                        "en-NP"
                                    )}{" "}
                                    of{" "}
                                    {visibleTestimonials.length.toLocaleString(
                                        "en-NP"
                                    )}{" "}
                                    testimonials
                                </p>
                            </div>

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDE7D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] sm:self-auto"
                                >
                                    <XCircle size={15} />
                                    Clear search
                                </button>
                            )}
                        </div>

                        {/* Empty State */}
                        {filteredTestimonials.length === 0 ? (
                            <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                    <MessageSquareQuote size={25} />
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                                    {visibleTestimonials.length === 0
                                        ? "No testimonials available"
                                        : "No matching testimonials"}
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                    {visibleTestimonials.length === 0
                                        ? "Testimonials submitted by donors and NGO members will appear here."
                                        : "Try another search term to find the testimonial you are looking for."}
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
                            /* Testimonial Cards */
                            <section
                                aria-label="Testimonials list"
                                className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:grid-cols-3"
                            >
                                {filteredTestimonials.map((testimonial) => (
                                    <TestimonialCard
                                        key={testimonial.id}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
