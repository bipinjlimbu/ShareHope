"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Heart,
    MessageSquareQuote,
    Pencil,
    Search,
    ShieldCheck,
    Star,
    Trash2,
    Users,
    X,
} from "lucide-react";

import { getProfile } from "@/services/profileService";
import {
    getTestimonials,
    deleteTestimonial,
} from "@/services/testimonialService";
import { getAuthStatus } from "@/lib/authStatus";

import type { AuthUser } from "@/types/auth";
import type { Testimonial as TestimonialData } from "@/types/testimonial";

import TestimonialDataFetchSkeleton from "@/components/skeleton/main/TestimonialDataFetchSkeleton";
import CreateTestimonialForm from "@/components/form/CreateTestimonialForm";
import EditTestimonialForm from "@/components/form/EditTestimonialForm";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useToast } from "@/components/toast/ToastProvider";

type TestimonialCategory =
    | "ALL"
    | "ADMIN"
    | "DONOR"
    | "NGO_ADMIN"
    | "NGO_STAFF";

type TestimonialRole =
    | "ADMIN"
    | "DONOR"
    | "NGO_ADMIN"
    | "NGO_STAFF";

interface DisplayTestimonial {
    id: number;
    userId: number | null;
    name: string;
    role: string;
    category: TestimonialRole;
    date: string;
    initials: string;
    profilePicture: string | null;
    quote: string;
    rating: number;
}

const categoryOptions: {
    label: string;
    value: TestimonialCategory;
}[] = [
        { label: "All Stories", value: "ALL" },
        { label: "Admins", value: "ADMIN" },
        { label: "Donors", value: "DONOR" },
        { label: "NGO Admins", value: "NGO_ADMIN" },
        { label: "NGO Staff", value: "NGO_STAFF" },
    ];

function formatCategory(category: TestimonialRole): string {
    switch (category) {
        case "ADMIN":
            return "Admin";
        case "DONOR":
            return "Donor";
        case "NGO_ADMIN":
            return "NGO Admin";
        case "NGO_STAFF":
            return "NGO Staff";
    }
}

function formatDate(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Unknown date";
    }

    return parsedDate.toLocaleDateString("en-NP", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    });
}

function getInitials(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "U"
    );
}

function mapTestimonial(
    testimonial: TestimonialData
): DisplayTestimonial | null {
    const testimonialUser = testimonial.user;
    const role = testimonialUser?.role;

    if (
        role !== "ADMIN" &&
        role !== "DONOR" &&
        role !== "NGO_ADMIN" &&
        role !== "NGO_STAFF"
    ) {
        return null;
    }

    const name = testimonialUser
        ? `${testimonialUser.first_name || ""} ${testimonialUser.last_name || ""}`.trim() ||
        testimonialUser.username
        : "Anonymous User";

    const roleLabels: Record<TestimonialRole, string> = {
        ADMIN: "ShareHope Administrator",
        DONOR: "Donor",
        NGO_ADMIN: "NGO Administrator",
        NGO_STAFF: "NGO Staff",
    };

    return {
        id: testimonial.id,
        userId: testimonialUser?.id ?? null,
        name,
        role: roleLabels[role],
        category: role,
        date: formatDate(testimonial.created_at),
        initials: getInitials(name),
        profilePicture: testimonialUser?.profile_picture ?? null,
        quote: testimonial.comment,
        rating: testimonial.rating,
    };
}

export default function TestimonialsPage() {
    const { showToast } = useToast();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const [testimonials, setTestimonials] = useState<DisplayTestimonial[]>(
        []
    );

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState<TestimonialCategory>("ALL");

    const [isFormOpen, setIsFormOpen] = useState(false);

    // Edit testimonial state
    const [editingTestimonial, setEditingTestimonial] =
        useState<DisplayTestimonial | null>(null);

    // Delete confirmation state
    const [selectedTestimonial, setSelectedTestimonial] =
        useState<DisplayTestimonial | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/api\/?$/,
        ""
    );

    // Fetch testimonials
    const fetchTestimonials = useCallback(async () => {
        setIsLoading(true);
        setFetchError("");

        try {
            const response = await getTestimonials();

            const mappedTestimonials = response
                .map(mapTestimonial)
                .filter(
                    (testimonial): testimonial is DisplayTestimonial =>
                        testimonial !== null
                );

            setTestimonials(mappedTestimonials);
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);

            setTestimonials([]);

            setFetchError(
                "Unable to load testimonials. Please try again later."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check authentication
    const checkAuthentication = useCallback(async () => {
        if (!getAuthStatus()) {
            setUser(null);
            setIsCheckingAuth(false);
            return;
        }

        try {
            const response = await getProfile();
            setUser(response.user);
        } catch (error) {
            console.error(
                "Failed to check testimonial page auth:",
                error
            );

            setUser(null);
        } finally {
            setIsCheckingAuth(false);
        }
    }, []);

    useEffect(() => {
        void fetchTestimonials();
        void checkAuthentication();

        const handleAuthChange = () => {
            void checkAuthentication();
        };

        window.addEventListener("auth-change", handleAuthChange);
        window.addEventListener("storage", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleAuthChange);
        };
    }, [fetchTestimonials, checkAuthentication]);

    // Check whether the authenticated user can submit testimonials
    const canSubmitTestimonial =
        user?.role === "ADMIN" ||
        user?.role === "DONOR" ||
        user?.role === "NGO_ADMIN" ||
        user?.role === "NGO_STAFF";

    // Check whether the current user has already submitted a testimonial
    const hasAlreadySubmitted = useMemo(() => {
        if (!user) {
            return false;
        }

        return testimonials.some(
            (testimonial) => testimonial.userId === user.id
        );
    }, [testimonials, user]);

    // Search and category filtering
    const query = search.trim().toLowerCase();

    const filteredTestimonials = useMemo(() => {
        const filtered = testimonials.filter((testimonial) => {
            const matchesCategory =
                category === "ALL" ||
                testimonial.category === category;

            const searchableText = [
                testimonial.name,
                testimonial.role,
                testimonial.quote,
                formatCategory(testimonial.category),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesCategory && searchableText.includes(query);
        });

        // Keep ADMIN testimonials first while preserving
        // the original relative order within each group.
        return [
            ...filtered.filter(
                (testimonial) => testimonial.category === "ADMIN"
            ),
            ...filtered.filter(
                (testimonial) => testimonial.category !== "ADMIN"
            ),
        ];
    }, [testimonials, category, query]);

    const clearFilters = () => {
        setSearch("");
        setCategory("ALL");
    };

    const hasFilters = Boolean(search) || category !== "ALL";

    // Called after successful testimonial submission
    const handleTestimonialSuccess = () => {
        setIsFormOpen(false);
        void fetchTestimonials();
    };

    // Called after successful testimonial update
    const handleTestimonialUpdateSuccess = () => {
        setEditingTestimonial(null);
        void fetchTestimonials();
    };

    // Close delete confirmation modal
    const handleDeleteCancel = () => {
        if (isDeleting) {
            return;
        }

        setSelectedTestimonial(null);
    };

    // Delete testimonial after confirmation
    const handleDeleteConfirm = async () => {
        if (!selectedTestimonial || isDeleting) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteTestimonial(selectedTestimonial.id);

            setTestimonials((previousTestimonials) =>
                previousTestimonials.filter(
                    (testimonial) =>
                        testimonial.id !== selectedTestimonial.id
                )
            );

            setSelectedTestimonial(null);

            showToast(
                "Testimonial deleted successfully.",
                "success"
            );
        } catch (error) {
            console.error("Failed to delete testimonial:", error);

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === "object" &&
                        error !== null &&
                        "error" in error &&
                        typeof error.error === "string"
                        ? error.error
                        : "Unable to delete testimonial. Please try again.";

            showToast(errorMessage, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 text-[#183B2A] sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <header className="mb-12 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-sm font-semibold text-[#166534]">
                        <MessageSquareQuote size={16} />
                        Community Voices
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                        Stories That Inspire
                        <span className="block text-[#29904C]">
                            Hope and Change
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647568] sm:text-base">
                        Every act of kindness has a story behind it.
                        Explore the experiences and perspectives of people
                        who believe in making a difference together.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/campaigns"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D]"
                        >
                            Explore Campaigns
                            <ArrowRight size={16} />
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED]"
                        >
                            Back to Home
                        </Link>
                    </div>
                </header>

                {/* Community Highlights */}
                <section
                    aria-label="ShareHope community values"
                    className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <Heart size={21} />
                        </div>

                        <h2 className="mt-3 text-sm font-bold text-[#183B2A]">
                            Shared Kindness
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-[#829184]">
                            Every contribution matters.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <ShieldCheck size={21} />
                        </div>

                        <h2 className="mt-3 text-sm font-bold text-[#183B2A]">
                            Transparency
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-[#829184]">
                            Trust through accountability.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 text-center shadow-sm">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <Users size={21} />
                        </div>

                        <h2 className="mt-3 text-sm font-bold text-[#183B2A]">
                            Stronger Together
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-[#829184]">
                            Communities creating change.
                        </p>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section aria-labelledby="testimonials-heading">
                    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#29904C]">
                                Experiences and perspectives
                            </span>

                            <h2
                                id="testimonials-heading"
                                className="mt-2 text-2xl font-extrabold tracking-tight text-[#183B2A] sm:text-3xl"
                            >
                                What Our Community Says
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#647568]">
                                Different journeys, one shared purpose:
                                supporting people and causes that matter.
                            </p>
                        </div>

                        {!isLoading && !fetchError && (
                            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-3.5 py-2 text-xs font-semibold text-[#166534]">
                                <MessageSquareQuote size={14} />

                                {filteredTestimonials.length}{" "}
                                {filteredTestimonials.length === 1
                                    ? "Story"
                                    : "Stories"}
                            </span>
                        )}
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="relative w-full lg:max-w-sm">
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829184]"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search testimonials..."
                                    aria-label="Search testimonials"
                                    className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-11 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#647568] transition hover:bg-[#E5F2E1]"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        onClick={() =>
                                            setCategory(item.value)
                                        }
                                        aria-pressed={category === item.value}
                                        className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${category === item.value
                                            ? "bg-[#166534] text-white shadow-sm"
                                            : "border border-[#DDE7D9] bg-white text-[#526B56] hover:bg-[#F1F7ED]"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loading Skeleton */}
                    {isLoading ? (
                        <TestimonialDataFetchSkeleton />
                    ) : fetchError ? (
                        /* Fetch Error */
                        <div className="rounded-3xl border border-red-200 bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                                <MessageSquareQuote size={27} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-[#183B2A]">
                                Unable to Load Testimonials
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {fetchError}
                            </p>

                            <button
                                type="button"
                                onClick={fetchTestimonials}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredTestimonials.length > 0 ? (
                        /* Testimonial Cards */
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredTestimonials.map((testimonial) => {
                                const isOwnTestimonial =
                                    user !== null &&
                                    testimonial.userId === user.id;

                                return (
                                    <article
                                        key={testimonial.id}
                                        className="group flex min-w-0 flex-col rounded-3xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9DFC4] hover:shadow-xl sm:p-7"
                                    >
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                {testimonial.profilePicture ? (
                                                    <img
                                                        src={
                                                            testimonial.profilePicture.startsWith(
                                                                "http"
                                                            )
                                                                ? testimonial.profilePicture
                                                                : `${API_URL}${testimonial.profilePicture}`
                                                        }
                                                        alt={`${testimonial.name}'s profile`}
                                                        className="h-12 w-12 shrink-0 rounded-full border border-[#DDE7DC] object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5F2E1] text-sm font-extrabold text-[#166534]">
                                                        {testimonial.initials}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-bold text-[#183B2A]">
                                                        {testimonial.name}
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs font-medium text-[#29904C]">
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Own Testimonial Actions */}
                                            {isOwnTestimonial && (
                                                <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        title="Edit testimonial"
                                                        aria-label="Edit your testimonial"
                                                        onClick={() =>
                                                            setEditingTestimonial(
                                                                testimonial
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DDE7D9] bg-white text-[#526B56] shadow-sm transition hover:border-[#B8D7B5] hover:bg-[#E5F2E1] hover:text-[#166534]"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        title="Delete testimonial"
                                                        aria-label="Delete your testimonial"
                                                        onClick={() =>
                                                            setSelectedTestimonial(
                                                                testimonial
                                                            )
                                                        }
                                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0D6D2] bg-white text-[#B45349] shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Admin Voice / User Rating */}
                                        {testimonial.category === "ADMIN" ? (
                                            <div className="mt-6">
                                                <div className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-gradient-to-r from-[#F0F7ED] to-[#E5F2E1] px-3.5 py-2">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#166534] text-white">
                                                        <ShieldCheck size={14} />
                                                    </span>

                                                    <span className="text-[11px] font-extrabold tracking-[0.14em] text-[#166534]">
                                                        ADMIN VOICE
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="mt-6 flex items-center gap-1 text-[#D5A64C]"
                                                aria-label={`${testimonial.rating} out of 5 stars`}
                                            >
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        fill={
                                                            star <= testimonial.rating
                                                                ? "currentColor"
                                                                : "none"
                                                        }
                                                        strokeWidth={1.5}
                                                        className={
                                                            star <= testimonial.rating
                                                                ? ""
                                                                : "text-[#DDE7D9]"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Quote */}
                                        <div className="mt-4 flex-1">
                                            <span
                                                aria-hidden="true"
                                                className="block h-8 font-serif text-5xl leading-none text-[#B8D7B5]"
                                            >
                                                “
                                            </span>

                                            <blockquote className="mt-2 break-words text-sm leading-7 text-[#647568]">
                                                {testimonial.quote}
                                            </blockquote>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="mt-6 border-t border-[#EDF2E9] pt-4">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#829184]">
                                                    <CalendarDays
                                                        size={13}
                                                        className="shrink-0 text-[#29904C]"
                                                    />

                                                    <span>
                                                        {testimonial.date}
                                                    </span>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-[#F0F7ED] px-3 py-1.5 text-[10px] font-bold text-[#166534]">
                                                    {formatCategory(
                                                        testimonial.category
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Search size={27} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-[#183B2A]">
                                {testimonials.length === 0
                                    ? "No Testimonials Yet"
                                    : "No Matching Testimonials"}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {testimonials.length === 0
                                    ? "Be among the first to share your experience with the ShareHope community."
                                    : "Try another search term or select a different category to explore more community stories."}
                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                                >
                                    <X size={15} />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Add Testimonial CTA */}
                {!isCheckingAuth &&
                    !isLoading &&
                    !fetchError &&
                    canSubmitTestimonial &&
                    !hasAlreadySubmitted && (
                        <section className="mt-12 overflow-hidden rounded-3xl border border-[#CFE2C9] bg-[#F0F7ED] p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div className="max-w-2xl">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-white px-3 py-1.5 text-xs font-bold text-[#166534]">
                                        <CheckCircle2 size={14} />
                                        Community Contribution
                                    </span>

                                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#183B2A] sm:text-3xl">
                                        Have a story to share?
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-[#647568]">
                                        Your experience can encourage others
                                        to support meaningful causes. Share
                                        what being part of a giving community
                                        means to you.
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(true)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                    >
                                        <MessageSquareQuote size={17} />
                                        Add Testimonial
                                    </button>

                                    <p className="mt-2 text-center text-[11px] text-[#829184]">
                                        Share your experience with ShareHope
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                {/* Already Submitted Message */}
                {!isCheckingAuth &&
                    !isLoading &&
                    !fetchError &&
                    canSubmitTestimonial &&
                    hasAlreadySubmitted && (
                        <section className="mt-12 rounded-2xl border border-[#D8E8D4] bg-[#F0F7ED] p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#166534]">
                                    <CheckCircle2 size={21} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-[#183B2A]">
                                        Thank you for sharing your story!
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-[#647568]">
                                        You have already submitted a
                                        testimonial. Your experience is part
                                        of the ShareHope community stories.
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                {/* Bottom CTA */}
                <section className="mt-12 rounded-3xl bg-[#183B2A] px-6 py-12 text-center sm:px-10 sm:py-14">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B8DDB5]">
                        <Heart size={23} />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        Be Part of Something
                        <span className="block text-[#A9D7A5]">
                            Meaningful.
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">
                        Discover campaigns, support communities, and help
                        create stories of hope through your contributions.
                    </p>

                    <Link
                        href="/campaigns"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#183B2A] transition hover:bg-[#E5F2E1]"
                    >
                        Explore Campaigns
                        <ArrowRight size={17} />
                    </Link>
                </section>
            </div>

            {/* Create Testimonial Modal */}
            {isFormOpen && (
                <CreateTestimonialForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={handleTestimonialSuccess}
                />
            )}

            {/* Edit Testimonial Modal */}
            {editingTestimonial && (
                <EditTestimonialForm
                    key={editingTestimonial.id}
                    testimonial={{
                        id: editingTestimonial.id,
                        rating: editingTestimonial.rating,
                        comment: editingTestimonial.quote,
                    }}
                    onClose={() => setEditingTestimonial(null)}
                    onSuccess={handleTestimonialUpdateSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={selectedTestimonial !== null}
                title="Delete Testimonial?"
                description="Are you sure you want to permanently delete this testimonial? This action cannot be undone."
                itemName={selectedTestimonial?.name}
                confirmText="Delete Testimonial"
                isDeleting={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </main>
    );
}
