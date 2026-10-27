"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ProfileUser } from "@/types/profile";
import { getProfile } from "@/services/profileService";
import { useToast } from "@/components/toast/ToastProvider";
import { getAuthStatus } from "@/lib/authStatus";

const campaigns = [
    {
        id: 1,
        title: "Help children return to school",
        category: "Education",
        ngo: "Bright Future Foundation",
        donation_type: "BOTH",
        goal_amount: 150000,
        raised_amount: 97500,
        goal_quantity: 200,
        donated_quantity: 126,
        goal_item_name: "School supply kits",
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85",
        donors: 84,
        featured: true,
    },
    {
        id: 2,
        title: "Nutritious meals for families",
        category: "Food & Essentials",
        ngo: "Community Care Nepal",
        donation_type: "ITEM",
        goal_amount: null,
        raised_amount: 0,
        goal_quantity: 500,
        donated_quantity: 315,
        goal_item_name: "Food packages",
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=85",
        donors: 62,
        featured: false,
    },
    {
        id: 3,
        title: "Clean water for rural communities",
        category: "Health & Water",
        ngo: "Himalayan Hope Initiative",
        donation_type: "FUND",
        goal_amount: 250000,
        raised_amount: 172500,
        goal_quantity: null,
        donated_quantity: 0,
        goal_item_name: "",
        status: "ACTIVE",
        image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=85",
        donors: 137,
        featured: false,
    },
];

const categories = [
    {
        name: "Education",
        description: "Learning and school supplies",
        icon: "book-open",
        color: "bg-[#E5F3E6]",
        iconColor: "text-[#287747]",
    },
    {
        name: "Food & Essentials",
        description: "Food and daily necessities",
        icon: "heart-handshake",
        color: "bg-[#FBEBDD]",
        iconColor: "text-[#B76A32]",
    },
    {
        name: "Health",
        description: "Care, medicine and wellness",
        icon: "heart-pulse",
        color: "bg-[#F9E5E7]",
        iconColor: "text-[#C45160]",
    },
    {
        name: "Environment",
        description: "A healthier, greener future",
        icon: "sprout",
        color: "bg-[#E3F0E9]",
        iconColor: "text-[#267653]",
    },
];

function Icon({
    name,
    className = "h-5 w-5",
}: {
    name: string;
    className?: string;
}) {
    const paths: Record<string, ReactNode> = {
        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
            </>
        ),
        book: (
            <>
                <path d="M12 7v14" />
                <path d="M3 18V5a2 2 0 0 1 2-2h4a3 3 0 0 1 3 3 3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-5a2 2 0 0 0-2 2 2 2 0 0 0-2-2H5a2 2 0 0 1-2-2Z" />
            </>
        ),
        hands: (
            <>
                <path d="M11 17 7 13l-4 4 5 5h8l5-5-4-4-4 4a2 2 0 0 1-2-2Z" />
                <path d="m7 13 3-3a2 2 0 0 1 3 0l1 1" />
                <path d="m3 10 3-3 4 3" />
                <path d="m21 10-3-3-4 3" />
            </>
        ),
        health: (
            <>
                <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                <path d="M3 12h5l2-3 3 6 2-3h6" />
            </>
        ),
        sprout: (
            <>
                <path d="M11 20A7 7 0 0 1 4 13c0-4 3-7 8-7 0 5-3 8-7 8" />
                <path d="M13 20a7 7 0 0 0 7-7c0-4-3-7-8-7" />
                <path d="M12 22V12" />
            </>
        ),
        shield: (
            <>
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),
        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),
        globe: (
            <>
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
            </>
        ),
        check: (
            <>
                <path d="m5 12 4 4L19 6" />
            </>
        ),
        heart: (
            <>
                <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {paths[name] ?? paths.heart}
        </svg>
    );
}

function CampaignCard({
    campaign,
}: {
    campaign: (typeof campaigns)[number];
}) {
    const isItem = campaign.donation_type === "ITEM";
    const isBoth = campaign.donation_type === "BOTH";

    const moneyProgress = campaign.goal_amount
        ? Math.min(
            100,
            Math.round(
                (campaign.raised_amount / campaign.goal_amount) * 100
            )
        )
        : 0;

    const itemProgress = campaign.goal_quantity
        ? Math.min(
            100,
            Math.round(
                (campaign.donated_quantity / campaign.goal_quantity) * 100
            )
        )
        : 0;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#E6EDE4] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#BCD8BE] hover:shadow-xl hover:shadow-[#1D5731]/8">
            <a
                href={`/campaigns/${campaign.id}`}
                className="relative block h-56 overflow-hidden bg-[#E8F0E5]"
            >
                <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#24623A] shadow-sm">
                    {campaign.category}
                </span>

                <span className="absolute right-4 top-4 rounded-full bg-[#14532D]/90 px-3 py-1.5 text-xs font-semibold text-white">
                    {isBoth
                        ? "Funds + Items"
                        : isItem
                            ? "Items needed"
                            : "Fundraising"}
                </span>
            </a>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#738074]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E6F2E6] text-[#277443]">
                        <Icon name="shield" className="h-3.5 w-3.5" />
                    </span>

                    <span className="line-clamp-1">{campaign.ngo}</span>

                    <Icon
                        name="check"
                        className="h-4 w-4 shrink-0 text-[#27824B]"
                    />
                </div>

                <h3 className="text-lg font-bold leading-7 tracking-tight text-[#183B2A] transition group-hover:text-[#247640]">
                    <a href={`/campaigns/${campaign.id}`}>
                        {campaign.title}
                    </a>
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#748074]">
                    {isItem
                        ? `Help provide ${campaign.goal_item_name.toLowerCase()} for people who need them.`
                        : isBoth
                            ? `Support this community with funds or ${campaign.goal_item_name.toLowerCase()}.`
                            : "Every contribution helps this community move closer to its goal."}
                </p>

                <div className="mt-auto pt-6">
                    {!isItem && campaign.goal_amount !== null && (
                        <div className="mb-4">
                            <div className="mb-2 flex items-end justify-between gap-2">
                                <div>
                                    <p className="text-xs text-[#849084]">
                                        Raised so far
                                    </p>
                                    <p className="mt-1 text-xl font-extrabold tracking-tight text-[#14532D]">
                                        Rs.{" "}
                                        {campaign.raised_amount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-[#27824B]">
                                    {moneyProgress}%
                                </p>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#E9F0E6]">
                                <div
                                    className="h-full rounded-full bg-[#35A45C] transition-all"
                                    style={{ width: `${moneyProgress}%` }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-[#849084]">
                                Goal: Rs.{" "}
                                {campaign.goal_amount.toLocaleString("en-IN")}
                            </p>
                        </div>
                    )}

                    {(isItem || isBoth) && (
                        <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-[#31523C]">
                                    {campaign.goal_item_name}
                                </span>

                                <span className="text-sm font-bold text-[#27824B]">
                                    {itemProgress}%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-[#E9F0E6]">
                                <div
                                    className="h-full rounded-full bg-[#35A45C]"
                                    style={{ width: `${itemProgress}%` }}
                                />
                            </div>

                            <p className="mt-2 text-xs text-[#849084]">
                                {campaign.donated_quantity} of{" "}
                                {campaign.goal_quantity} needed
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-3 border-t border-[#EEF1EB] pt-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#778477]">
                            <Icon name="users" className="h-4 w-4" />
                            {campaign.donors} supporters
                        </div>

                        <a
                            href={`/campaigns/${campaign.id}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                        >
                            Support <Icon name="arrow" className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function Home() {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        let active = true;
        let requestId = 0;

        async function loadUser() {
            if (!getAuthStatus()) {
                setUser(null);
                return;
            }

            const currentRequestId = ++requestId;

            try {
                const response = await getProfile();

                if (
                    active &&
                    currentRequestId === requestId
                ) {
                    setUser(response.user);
                }
            } catch (error: unknown) {
                if (
                    !active ||
                    currentRequestId !== requestId
                ) {
                    return;
                }

                setUser(null);

                const status =
                    typeof error === "object" &&
                        error !== null &&
                        "status" in error
                        ? error.status
                        : undefined;

                if (status === 401 || status === 403) {
                    return;
                }

                const message =
                    typeof error === "object" &&
                        error !== null &&
                        "message" in error &&
                        typeof error.message === "string"
                        ? error.message
                        : "Unable to load your account information.";

                showToast(message, "error");
            }
        }

        function handleAuthChange(event: Event) {
            const customEvent = event as CustomEvent<{
                authenticated?: boolean;
            }>;

            if (customEvent.detail?.authenticated === false) {
                requestId++;
                setUser(null);
                return;
            }

            if (
                customEvent.detail?.authenticated === true ||
                getAuthStatus()
            ) {
                void loadUser();
            } else {
                requestId++;
                setUser(null);
            }
        }

        if (getAuthStatus()) {
            void loadUser();
        }

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            active = false;
            requestId++;

            window.removeEventListener(
                "auth-change",
                handleAuthChange
            );
        };
    }, [showToast]);

    return (
        <main className="overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            <section className="relative">
                <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#E5F2E1] opacity-70 blur-3xl" />
                <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#F4EBD8] opacity-60 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#D9E8D5] bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#34734A] shadow-sm sm:text-sm">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DFF2DD]">
                                <Icon name="heart" className="h-3 w-3" />
                            </span>
                            {user
                                ? "Your kindness can make a difference"
                                : "Good things happen when we share"}
                        </div>

                        <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-[-0.045em] text-[#163D28] sm:text-5xl lg:text-7xl">
                            A little kindness can create{" "}
                            <span className="relative inline-block text-[#29904C]">
                                big change.
                                <svg
                                    viewBox="0 0 250 12"
                                    fill="none"
                                    className="absolute -bottom-2 left-0 w-full"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M3 8C65 2 177 2 246 7"
                                        stroke="#A5D6A7"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="mt-7 max-w-xl text-base leading-8 text-[#6A796B] sm:text-lg">
                            ShareHope connects generous people with trusted
                            NGOs and meaningful campaigns. Give funds, donate
                            essential items, and help turn compassion into
                            real-world impact.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="/campaigns"
                                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#166534] px-6 text-sm font-bold text-white shadow-lg shadow-[#166534]/15 transition hover:-translate-y-0.5 hover:bg-[#14532D]"
                            >
                                Explore campaigns <Icon name="arrow" />
                            </a>

                            <a
                                href={user ? "/donations" : "/register"}
                                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[#D8E4D5] bg-white/80 px-6 text-sm font-bold text-[#245335] transition hover:border-[#A9CCAA] hover:bg-[#F1F8EF]"
                            >
                                {user ? "View my donations" : "Join Us"}{" "}
                                <Icon name={user ? "heart" : "arrow"} />
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#E5EBDD] pt-6">
                            <div className="flex -space-x-2">
                                {[
                                    "#D4A78C",
                                    "#8AB8A1",
                                    "#D5BD75",
                                    "#C7A0A0",
                                ].map((color, index) => (
                                    <span
                                        key={color}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#FFFCF6] text-xs font-bold text-white"
                                        style={{ backgroundColor: color }}
                                    >
                                        {["S", "A", "R", "M"][index]}
                                    </span>
                                ))}
                            </div>

                            <div>
                                <p className="text-sm font-bold text-[#254731]">
                                    Every contribution matters
                                </p>
                                <p className="mt-0.5 text-xs text-[#829082]">
                                    Be part of a community that cares.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
                        <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full border border-[#D5E6CE] sm:-right-7 sm:-top-7 sm:h-32 sm:w-32" />
                        <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full bg-[#DCEED8] sm:-bottom-8 sm:-left-8 sm:h-32 sm:w-32" />

                        <div className="relative rounded-[2rem] bg-[#E4EEDD] p-2.5 shadow-2xl shadow-[#234A2B]/10 sm:p-3">
                            <div className="relative h-[350px] overflow-hidden rounded-[1.5rem] sm:h-[480px]">
                                <img
                                    src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=90"
                                    alt="Volunteers coming together to support their community"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#102F1C]/65 via-transparent to-[#102F1C]/5" />

                                <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-8 sm:left-8 sm:right-8">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                                        <span className="h-2 w-2 rounded-full bg-[#A5E5A9]" />
                                        Hope starts here
                                    </span>

                                    <p className="mt-4 max-w-sm text-2xl font-bold leading-snug sm:text-3xl">
                                        Together, we can make someone&apos;s
                                        tomorrow brighter.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -left-3 top-10 max-w-[190px] rounded-2xl border border-[#E7EDE2] bg-white p-3.5 shadow-xl shadow-[#183B2A]/10 sm:-left-12 sm:top-16 sm:p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F4E4] text-[#287747]">
                                    <Icon name="hands" className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-extrabold text-[#204A30]">
                                        Give with purpose
                                    </p>
                                    <p className="mt-1 text-xs text-[#7D897D]">
                                        Funds or essential items
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -right-2 bottom-10 rounded-2xl border border-[#E7EDE2] bg-white p-3.5 shadow-xl shadow-[#183B2A]/10 sm:-right-6 sm:bottom-16 sm:p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F4E4] text-[#287747]">
                                    <Icon name="shield" className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-extrabold text-[#204A30]">
                                        Trust matters
                                    </p>
                                    <p className="mt-1 text-xs text-[#7D897D]">
                                        NGO review process
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-[#E6EDE2] bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-7 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-4 lg:px-12">
                    {[
                        {
                            value: "For everyone",
                            label: "A place to give and receive",
                            icon: "users",
                        },
                        {
                            value: "Funds + items",
                            label: "Different ways to contribute",
                            icon: "heart",
                        },
                        {
                            value: "Reviewed NGOs",
                            label: "An approval process for NGOs",
                            icon: "shield",
                        },
                        {
                            value: "Clear records",
                            label: "Donation tracking and history",
                            icon: "check",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-3 border-[#E9EEE6] px-2 sm:px-5 lg:border-r lg:last:border-r-0"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EDF6E9] text-[#2B7743]">
                                <Icon name={stat.icon} className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-base font-extrabold tracking-tight text-[#234A30] sm:text-lg">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#849084] sm:text-sm">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div className="max-w-xl">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3C8B51]">
                            Find your cause
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl">
                            Where would you like to make a difference?
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[#778477] sm:text-base">
                            Choose a cause that speaks to you and find a way
                            to help.
                        </p>
                    </div>
                    <a
                        href="/campaigns"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#267341] transition hover:text-[#14532D]"
                    >
                        Explore all causes <Icon name="arrow" />
                    </a>
                </div>

                <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                    {categories.map((category) => (
                        <a
                            key={category.name}
                            href={`/campaigns?category=${encodeURIComponent(category.name)}`}
                            className="group rounded-3xl border border-[#E6EDE4] bg-white p-4 transition hover:-translate-y-1 hover:border-[#C4DCC0] hover:shadow-lg hover:shadow-[#183B2A]/5 sm:p-6"
                        >
                            <span
                                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.color} ${category.iconColor}`}
                            >
                                <Icon
                                    name={
                                        category.icon === "book-open"
                                            ? "book"
                                            : category.icon === "heart-handshake"
                                                ? "hands"
                                                : category.icon === "heart-pulse"
                                                    ? "health"
                                                    : "sprout"
                                    }
                                    className="h-6 w-6"
                                />
                            </span>
                            <h3 className="mt-5 text-sm font-bold text-[#244830] sm:text-base">
                                {category.name}
                            </h3>
                            <p className="mt-2 text-xs leading-5 text-[#849084] sm:text-sm">
                                {category.description}
                            </p>
                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#32804A] transition group-hover:gap-2">
                                Explore{" "}
                                <Icon name="arrow" className="h-3.5 w-3.5" />
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="bg-[#F1F6ED] py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div className="max-w-xl">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3C8B51]">
                                Make an impact
                            </span>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl">
                                Campaigns that need you
                            </h2>
                            <p className="mt-4 text-sm leading-7 text-[#718071] sm:text-base">
                                Discover opportunities to help through
                                financial contributions or essential items.
                            </p>
                        </div>
                        <a
                            href="/campaigns"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#267341] transition hover:text-[#14532D]"
                        >
                            View all campaigns <Icon name="arrow" />
                        </a>
                    </div>

                    <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns
                            .filter((campaign) => campaign.status === "ACTIVE")
                            .map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))}
                    </div>

                    <div className="mt-10 text-center">
                        <a
                            href="/campaigns"
                            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-[#CBDCC7] bg-white px-6 text-sm font-bold text-[#28573A] transition hover:border-[#93BD91] hover:bg-[#F8FCF5]"
                        >
                            Discover more campaigns <Icon name="arrow" />
                        </a>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                    <div className="relative">
                        <div className="absolute -left-4 -top-4 h-28 w-28 rounded-tl-[2.5rem] border-l-2 border-t-2 border-[#BBD8B5]" />
                        <img
                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
                            alt="Volunteers working together on a community initiative"
                            className="relative h-[330px] w-full rounded-[2rem] object-cover sm:h-[440px]"
                        />
                        <div className="absolute -bottom-5 right-4 max-w-[250px] rounded-2xl border border-[#E5EDE1] bg-white p-4 shadow-xl sm:right-7 sm:p-5">
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E6F4E4] text-[#2A7845]">
                                    <Icon name="heart" className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-extrabold text-[#244830]">
                                        Every act counts
                                    </p>
                                    <p className="mt-1 text-xs text-[#829082]">
                                        Start with what you can give.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 lg:pt-0">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3C8B51]">
                            How ShareHope works
                        </span>
                        <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-4xl">
                            Giving should feel simple. And meaningful.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[#778477] sm:text-base">
                            A straightforward way to connect people who want
                            to help with organizations working to make a
                            difference.
                        </p>

                        <div className="mt-8 space-y-6">
                            {[
                                {
                                    number: "01",
                                    title: "Find a cause you care about",
                                    description:
                                        "Explore active campaigns and see what each community needs.",
                                },
                                {
                                    number: "02",
                                    title: "Choose how to contribute",
                                    description:
                                        "Support a campaign with money, physical items, or both when accepted.",
                                },
                                {
                                    number: "03",
                                    title: "Follow the donation process",
                                    description:
                                        "Donations can be tracked through receipt, verification, and approval.",
                                },
                            ].map((step) => (
                                <div key={step.number} className="flex gap-4">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D6E6D1] bg-[#EFF7EC] text-sm font-extrabold text-[#32804A]">
                                        {step.number}
                                    </span>
                                    <div>
                                        <h3 className="text-base font-bold text-[#244830]">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-[#7A887A]">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/about"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#267341] transition hover:gap-3"
                        >
                            Learn more about ShareHope <Icon name="arrow" />
                        </a>
                    </div>
                </div>
            </section>

            <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#14532D] px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
                    <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
                    <div className="absolute -right-5 -top-12 h-56 w-56 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#2E7D46]/40 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#D7F1D5]">
                                <Icon name="heart" className="h-3.5 w-3.5" />
                                Be part of the change
                            </span>
                            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                Your kindness could be someone&apos;s turning
                                point.
                            </h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/75 sm:text-base">
                                Join a community that believes every person
                                can make a difference. Start by finding a
                                campaign or bringing your organization to
                                ShareHope.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                            <a
                                href="/campaigns"
                                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-[#14532D] transition hover:bg-[#EAF6E7]"
                            >
                                Find a campaign <Icon name="arrow" />
                            </a>
                            <a
                                href={user ? "/donations" : "/register"}
                                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-2xl border border-white/25 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                            >
                                {user ? "View my donations" : "Register Now"}{" "}
                                <Icon name="arrow" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}