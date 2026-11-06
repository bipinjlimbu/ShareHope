"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Heart,
    MessageSquareQuote,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

import TestimonialDataFetchSkeleton from "@/components/skeleton/main/TestimonialDataFetchSkeleton";

type TestimonialCategory =
    | "All"
    | "Donors"
    | "NGOs"
    | "Volunteers";

type Testimonial = {
    id: number;
    name: string;
    role: string;
    organization?: string;
    category: Exclude<TestimonialCategory, "All">;
    location: string;
    date: string;
    quote: string;
    initials: string;
    featured?: boolean;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Aarav Sharma",
        role: "Regular Donor",
        category: "Donors",
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
        category: "NGOs",
        location: "Pokhara, Nepal",
        date: "September 2026",
        initials: "SK",
        quote:
            "Managing campaigns and keeping donation records organized is an important part of our work. A platform that brings these activities together can make our operations easier to manage.",
    },
    {
        id: 3,
        name: "Rohan Thapa",
        role: "Volunteer",
        category: "Volunteers",
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
        category: "Donors",
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
        category: "NGOs",
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
        category: "Volunteers",
        location: "Dharan, Nepal",
        date: "July 2026",
        initials: "AG",
        quote:
            "Helping others starts with being willing to participate. I appreciate the idea of making it easier for people to connect with causes and contribute in different ways.",
    },
];

const categories: TestimonialCategory[] = [
    "All",
    "Donors",
    "NGOs",
    "Volunteers",
];

export default function TestimonialsPage() {
    const [activeCategory, setActiveCategory] =
        useState<TestimonialCategory>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const filteredTestimonials = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return testimonials.filter((testimonial) => {
            const matchesCategory =
                activeCategory === "All" ||
                testimonial.category === activeCategory;

            const matchesSearch =
                !query ||
                testimonial.name.toLowerCase().includes(query) ||
                testimonial.role.toLowerCase().includes(query) ||
                testimonial.quote.toLowerCase().includes(query) ||
                testimonial.location.toLowerCase().includes(query) ||
                testimonial.organization?.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const handleCategoryChange = (category: TestimonialCategory) => {
        setIsLoading(true);
        setActiveCategory(category);

        // Short demo delay to demonstrate the reusable data skeleton.
        window.setTimeout(() => setIsLoading(false), 350);
    };

    return (
        <main className="min-h-screen bg-[#FFFCF6] text-[#183B2A]">
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#E5EDE3]">
                <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#E5F2E1] opacity-70 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#EDF6E9] opacity-80 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
                    <Link
                        href="/"
                        className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#52705B] transition hover:text-[#166534]"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>

                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D7E8D5] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#267343] shadow-sm">
                            <MessageSquareQuote size={15} />
                            Community voices
                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#183B2A] sm:text-5xl lg:text-6xl">
                            Every act of kindness
                            <span className="block text-[#29904C]">
                                has a story.
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#647568] sm:text-lg">
                            Discover the thoughts and experiences of people who believe
                            in making a difference through generosity, collaboration,
                            and community support.
                        </p>

                        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="#stories"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#166534]/15 transition hover:-translate-y-0.5 hover:bg-[#14532D]"
                            >
                                Explore stories
                                <ArrowRight size={17} />
                            </a>

                            <Link
                                href="/campaigns"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE8DA] bg-white px-6 py-3.5 text-sm font-bold text-[#28583A] transition hover:border-[#A8CBAA] hover:bg-[#F3F8F0]"
                            >
                                Explore campaigns
                            </Link>
                        </div>
                    </div>

                    <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                        {[
                            {
                                icon: Heart,
                                title: "Shared kindness",
                                description: "Every contribution matters",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Accountability",
                                description: "Transparency in giving",
                            },
                            {
                                icon: Sparkles,
                                title: "Community",
                                description: "Working towards change",
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-[#E4EDE1] bg-white/80 p-5 text-center shadow-sm"
                                >
                                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4E6] text-[#267343]">
                                        <Icon size={19} />
                                    </div>
                                    <h2 className="text-sm font-bold text-[#244B32]">
                                        {item.title}
                                    </h2>
                                    <p className="mt-1 text-xs text-[#78877A]">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section
                id="stories"
                className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
            >
                <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                            Stories from the community
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                            Voices that inspire
                            <span className="text-[#29904C]"> hope.</span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-[#718073] sm:text-base">
                            Different people, different journeys, and one shared belief:
                            helping communities grow through collective action.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-xl border border-[#E2EBDD] bg-white px-4 py-3 text-xs font-semibold text-[#718073] lg:self-auto">
                        <MessageSquareQuote size={16} className="text-[#29904C]" />
                        {testimonials.length} sample stories
                    </div>
                </div>

                {/* Demo notice */}
                <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[#E8DFC5] bg-[#FFF9E9] p-4 text-sm leading-6 text-[#78643C]">
                    <Sparkles size={18} className="mt-0.5 shrink-0" />
                    <p>
                        <strong>Demo content:</strong> These testimonials are fictional
                        examples for the ShareHope interface preview, not verified
                        statements from real users or organizations.
                    </p>
                </div>

                {/* Search and filters */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-sm">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#91A092]"
                        />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search stories..."
                            className="w-full rounded-xl border border-[#E3EBE0] bg-[#FFFCF6] py-3 pl-11 pr-4 text-sm text-[#244B32] outline-none transition placeholder:text-[#A0ADA0] focus:border-[#73A77A] focus:ring-4 focus:ring-[#E5F2E1]"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategoryChange(category)}
                                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${activeCategory === category
                                    ? "bg-[#166534] text-white shadow-sm"
                                    : "border border-[#E3EBE0] bg-white text-[#647568] hover:border-[#A8CBAA] hover:bg-[#F4F8F1]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data */}
                {isLoading ? (
                    <TestimonialDataFetchSkeleton />
                ) : filteredTestimonials.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredTestimonials.map((testimonial) => (
                            <article
                                key={testimonial.id}
                                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#183B2A]/5 sm:p-7 ${testimonial.featured
                                    ? "border-[#B9D9B8]"
                                    : "border-[#E5EDE3]"
                                    }`}
                            >
                                {testimonial.featured && (
                                    <span className="absolute right-5 top-5 rounded-full bg-[#EAF4E6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#267343]">
                                        Featured
                                    </span>
                                )}

                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF4E6] text-sm font-extrabold text-[#267343]">
                                        {testimonial.initials}
                                    </div>

                                    <div className="flex items-center gap-1 text-[#D5A64C]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={13}
                                                fill="currentColor"
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4 text-4xl font-serif leading-none text-[#B8D7B5]">
                                    “
                                </div>

                                <blockquote className="flex-1 text-sm leading-7 text-[#617064]">
                                    {testimonial.quote}
                                </blockquote>

                                <div className="my-6 h-px bg-[#EAF0E7]" />

                                <div className="flex items-end justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-[#244B32]">
                                            {testimonial.name}
                                        </h3>
                                        <p className="mt-1 text-xs font-medium text-[#29904C]">
                                            {testimonial.role}
                                        </p>
                                        {testimonial.organization && (
                                            <p className="mt-1 text-xs text-[#849184]">
                                                {testimonial.organization}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs text-[#98A398]">
                                            {testimonial.location}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg bg-[#F3F7F0] px-2.5 py-1.5 text-[10px] font-semibold text-[#718073]">
                                        {testimonial.category}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-[#C9DCC7] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4E6] text-[#29904C]">
                            <Search size={23} />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-[#244B32]">
                            No stories found
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#829082]">
                            Try another search term or choose a different category to
                            explore more stories.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("All");
                            }}
                            className="mt-6 rounded-xl bg-[#166534] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#14532D]"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>

            {/* Closing CTA */}
            <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#183B2A] px-6 py-12 text-center sm:px-12 sm:py-16">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[35px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#29904C]/20 blur-2xl" />

                    <div className="relative mx-auto max-w-2xl">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B8DDB5]">
                            <Heart size={23} />
                        </div>

                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Be part of a story
                            <span className="block text-[#A9D7A5]">
                                that creates change.
                            </span>
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base">
                            Explore campaigns, discover meaningful causes, and take a
                            step towards supporting your community.
                        </p>

                        <Link
                            href="/campaigns"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#183B2A] transition hover:-translate-y-0.5 hover:bg-[#EAF4E6]"
                        >
                            Explore campaigns
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
