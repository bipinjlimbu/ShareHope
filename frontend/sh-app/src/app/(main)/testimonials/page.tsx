"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Heart,
    MessageSquareQuote,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Users,
    X,
} from "lucide-react";

import { getProfile } from "@/services/profileService";
import { getAuthStatus } from "@/lib/authStatus";
import type { AuthUser } from "@/types/auth";
import TestimonialDataFetchSkeleton from "@/components/skeleton/main/TestimonialDataFetchSkeleton";

type TestimonialCategory =
    | "ALL"
    | "DONOR"
    | "NGO"
    | "VOLUNTEER";

type Testimonial = {
    id: number;
    name: string;
    role: string;
    organization?: string;
    category: Exclude<TestimonialCategory, "ALL">;
    location: string;
    date: string;
    initials: string;
    quote: string;
    featured?: boolean;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Aarav Sharma",
        role: "Regular Donor",
        category: "DONOR",
        location: "Kathmandu, Nepal",
        date: "October 2026",
        initials: "AS",
        featured: true,
        quote:
            "ShareHope represents the kind of transparency I look for when supporting a cause. Being able to explore campaigns and understand how donations are recorded makes giving feel more meaningful.",
    },
    {
        id: 2,
        name: "Sita Karki",
        role: "NGO Administrator",
        organization: "Helping Hands Foundation",
        category: "NGO",
        location: "Pokhara, Nepal",
        date: "September 2026",
        initials: "SK",
        quote:
            "Managing campaigns and keeping donation records organized is an important part of our work. A platform that brings these activities together can make our operations easier to manage.",
    },
    {
        id: 3,
        name: "Rohan Thapa",
        role: "Community Volunteer",
        category: "VOLUNTEER",
        location: "Biratnagar, Nepal",
        date: "September 2026",
        initials: "RT",
        quote:
            "I believe small contributions can create meaningful change. Platforms that help people discover causes and understand the donation process can encourage more people to participate.",
    },
    {
        id: 4,
        name: "Nisha Rai",
        role: "First-time Donor",
        category: "DONOR",
        location: "Itahari, Nepal",
        date: "August 2026",
        initials: "NR",
        quote:
            "Finding a cause that matters to me should be simple. I like the idea of having campaigns and their donation information available in one place.",
    },
    {
        id: 5,
        name: "Prakash Adhikari",
        role: "NGO Coordinator",
        organization: "Community Care Nepal",
        category: "NGO",
        location: "Chitwan, Nepal",
        date: "August 2026",
        initials: "PA",
        quote:
            "Good record keeping helps organizations stay accountable. Having a structured way to manage campaigns, donations, and verification is valuable for community-focused work.",
    },
    {
        id: 6,
        name: "Anusha Gurung",
        role: "Community Volunteer",
        category: "VOLUNTEER",
        location: "Dharan, Nepal",
        date: "July 2026",
        initials: "AG",
        quote:
            "Helping others starts with being willing to participate. I appreciate the idea of making it easier for people to connect with causes and contribute in different ways.",
    },
];

const categoryOptions: {
    label: string;
    value: TestimonialCategory;
}[] = [
        { label: "All stories", value: "ALL" },
        { label: "Donors", value: "DONOR" },
        { label: "NGOs", value: "NGO" },
        { label: "Volunteers", value: "VOLUNTEER" },
    ];

function formatCategory(category: TestimonialCategory): string {
    switch (category) {
        case "DONOR":
            return "Donor";
        case "NGO":
            return "NGO";
        case "VOLUNTEER":
            return "Volunteer";
        default:
            return "All";
    }
}

export default function TestimonialsPage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState<TestimonialCategory>("ALL");

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
            console.error("Failed to check testimonial page auth:", error);
            setUser(null);
        } finally {
            setIsCheckingAuth(false);
        }
    }, []);

    useEffect(() => {
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
    }, [checkAuthentication]);

    const query = search.trim().toLowerCase();

    const filteredTestimonials = useMemo(() => {
        return testimonials.filter((testimonial) => {
            const matchesCategory =
                category === "ALL" || testimonial.category === category;

            const searchableText = [
                testimonial.name,
                testimonial.role,
                testimonial.organization,
                testimonial.location,
                testimonial.quote,
                formatCategory(testimonial.category),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return matchesCategory && searchableText.includes(query);
        });
    }, [category, query]);

    const clearFilters = () => {
        setSearch("");
        setCategory("ALL");
    };

    const hasFilters = Boolean(search) || category !== "ALL";

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

                {/* Testimonials Heading */}
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

                        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-3.5 py-2 text-xs font-semibold text-[#166534]">
                            <MessageSquareQuote size={14} />
                            {filteredTestimonials.length}{" "}
                            {filteredTestimonials.length === 1
                                ? "Story"
                                : "Stories"}
                        </span>
                    </div>

                    {/* Demo Notice */}
                    <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[#E8DFC5] bg-[#FFF9E9] p-4">
                        <Sparkles
                            size={18}
                            className="mt-0.5 shrink-0 text-[#A17B35]"
                        />
                        <p className="text-xs leading-6 text-[#78643C] sm:text-sm">
                            <strong>Demo content:</strong> These are fictional
                            sample testimonials created to preview the
                            ShareHope interface. They are not verified
                            statements from real users or organizations.
                        </p>
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

                    {/* Testimonial Cards */}
                    {filteredTestimonials.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {filteredTestimonials.map((testimonial) => (
                                <article
                                    key={testimonial.id}
                                    className={`group flex min-w-0 flex-col rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${testimonial.featured
                                        ? "border-[#C9DFC4] hover:border-[#A9CDA5]"
                                        : "border-[#E5EDE3] hover:border-[#C9DFC4]"
                                        }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-sm font-extrabold text-[#166534]">
                                                {testimonial.initials}
                                            </div>

                                            <div className="min-w-0">
                                                <h3 className="truncate text-sm font-bold text-[#183B2A]">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="mt-1 truncate text-xs font-medium text-[#29904C]">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>

                                        {testimonial.featured && (
                                            <span className="shrink-0 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#166534]">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Decorative Rating */}
                                    <div
                                        className="mt-6 flex items-center gap-1 text-[#D5A64C]"
                                        aria-label="Decorative sample stars, not a verified rating"
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={14}
                                                fill="currentColor"
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <div className="mt-4 flex-1">
                                        <span
                                            aria-hidden="true"
                                            className="block h-8 font-serif text-5xl leading-none text-[#B8D7B5]"
                                        >
                                            “
                                        </span>

                                        <blockquote className="mt-2 text-sm leading-7 text-[#647568]">
                                            {testimonial.quote}
                                        </blockquote>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="mt-6 border-t border-[#EDF2E9] pt-4">
                                        {testimonial.organization && (
                                            <p className="mb-3 truncate text-xs font-semibold text-[#526B56]">
                                                {testimonial.organization}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#829184]">
                                                <CalendarDays
                                                    size={13}
                                                    className="shrink-0 text-[#29904C]"
                                                />
                                                <span>
                                                    {testimonial.date}
                                                </span>
                                                <span aria-hidden="true">
                                                    ·
                                                </span>
                                                <span className="truncate">
                                                    {testimonial.location}
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
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Search size={27} />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-[#183B2A]">
                                No matching testimonials
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                Try another search term or select a different
                                category to explore more community stories.
                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                                >
                                    <X size={15} />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Authenticated User: Add Testimonial UI */}
                {!isCheckingAuth && user && (
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
                                    Your experience can encourage others to
                                    support meaningful causes. Share what
                                    being part of a giving community means
                                    to you.
                                </p>
                            </div>

                            <div className="shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex cursor-default items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 py-3.5 text-sm font-bold text-white shadow-sm"
                                    aria-label="Add testimonial, interface preview only"
                                >
                                    <MessageSquareQuote size={17} />
                                    Add Testimonial
                                </button>
                                <p className="mt-2 text-center text-[11px] text-[#829184]">
                                    Submission feature coming soon
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
        </main>
    );
}
