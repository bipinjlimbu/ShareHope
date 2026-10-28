"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OverviewSkeleton from "@/components/skeleton/ngo-admin-dashboard/OverviewSkeleton";
import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    HandHeart,
    HeartHandshake,
    Package,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";

const demoCampaigns = [
    {
        id: 1,
        title: "Education for Every Child",
        description: "Providing school supplies and learning resources.",
        status: "ACTIVE",
        donationType: "FUND",
        goalAmount: 250000,
        raisedAmount: 178000,
        donationCount: 42,
        createdAt: "2026-09-12T09:00:00Z",
    },
    {
        id: 2,
        title: "Winter Relief Program",
        description: "Warm clothes and essential supplies for families.",
        status: "PENDING",
        donationType: "BOTH",
        goalAmount: 150000,
        raisedAmount: 32500,
        donationCount: 18,
        createdAt: "2026-10-23T07:47:00Z",
    },
    {
        id: 3,
        title: "Community Food Support",
        description: "Collecting food essentials for vulnerable households.",
        status: "ACTIVE",
        donationType: "ITEM",
        goalAmount: 0,
        raisedAmount: 0,
        donationCount: 27,
        createdAt: "2026-08-20T10:00:00Z",
    },
    {
        id: 4,
        title: "Medical Assistance Fund",
        description: "Helping families access essential medical care.",
        status: "COMPLETED",
        donationType: "FUND",
        goalAmount: 100000,
        raisedAmount: 100000,
        donationCount: 31,
        createdAt: "2026-06-18T08:00:00Z",
    },
];

const demoDonations = [
    {
        id: 1,
        reference: "a12f9c21-7b34-4d20-9f18-000000001052",
        donor: "Aarav Sharma",
        anonymous: false,
        campaign: "Education for Every Child",
        type: "FUND",
        amount: 5000,
        status: "APPROVED",
        date: "2026-10-26T09:00:00Z",
    },
    {
        id: 2,
        reference: "a12f9c21-7b34-4d20-9f18-000000001051",
        donor: "Sita Karki",
        anonymous: false,
        campaign: "Community Food Support",
        type: "ITEM",
        amount: 0,
        status: "SUBMITTED",
        date: "2026-10-25T08:20:00Z",
    },
    {
        id: 3,
        reference: "a12f9c21-7b34-4d20-9f18-000000001050",
        donor: "",
        anonymous: true,
        campaign: "Winter Relief Program",
        type: "FUND",
        amount: 10000,
        status: "APPROVED",
        date: "2026-10-24T10:30:00Z",
    },
    {
        id: 4,
        reference: "a12f9c21-7b34-4d20-9f18-000000001049",
        donor: "Rohan Thapa",
        anonymous: false,
        campaign: "Education for Every Child",
        type: "FUND",
        amount: 3000,
        status: "RECEIVED",
        date: "2026-10-23T08:45:00Z",
    },
    {
        id: 5,
        reference: "a12f9c21-7b34-4d20-9f18-000000001048",
        donor: "Anisha Rai",
        anonymous: false,
        campaign: "Community Food Support",
        type: "ITEM",
        amount: 0,
        status: "VERIFIED",
        date: "2026-10-22T11:00:00Z",
    },
];

const donationMonths = [
    { month: "May", amount: 18000 },
    { month: "Jun", amount: 32000 },
    { month: "Jul", amount: 27000 },
    { month: "Aug", amount: 45000 },
    { month: "Sep", amount: 58000 },
    { month: "Oct", amount: 76500 },
];

function formatAmount(amount: number, currency = "NPR") {
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(new Date(date));
}

function shortReference(reference: string) {
    return `SH-${reference.slice(-4).toUpperCase()}`;
}

function statusLabel(status: string) {
    return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function SectionHeading({
    title,
    description,
    href,
    linkLabel = "View all",
}: {
    title: string;
    description: string;
    href?: string;
    linkLabel?: string;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
                <h3 className="text-base font-bold tracking-tight text-[#183B2A] sm:text-lg">
                    {title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-[#647568]">
                    {description}
                </p>
            </div>

            {href && (
                <Link
                    href={href}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#166534] transition hover:bg-[#EDF6E9] hover:text-[#14532D]"
                >
                    {linkLabel}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

export default function NGODashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setCurrentDate(
                new Intl.DateTimeFormat("en-NP", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Kathmandu",
                }).format(new Date())
            );

            setIsLoading(false);
        }, 650);

        return () => window.clearTimeout(timeout);
    }, []);

    if (isLoading) {
        return <OverviewSkeleton />;
    }

    const activeCampaigns = demoCampaigns.filter(
        (campaign) => campaign.status === "ACTIVE"
    );

    const pendingCampaigns = demoCampaigns.filter(
        (campaign) => campaign.status === "PENDING"
    );

    const completedCampaigns = demoCampaigns.filter(
        (campaign) => campaign.status === "COMPLETED"
    );

    const pendingVerifications = demoDonations.filter(
        (donation) =>
            donation.status === "SUBMITTED" ||
            donation.status === "RECEIVED"
    );

    const totalCollected = demoDonations
        .filter((donation) => donation.status === "APPROVED")
        .reduce((total, donation) => total + donation.amount, 0);

    const totalDonations = demoDonations.length;

    const totalDonors = new Set(
        demoDonations
            .filter((donation) => !donation.anonymous && donation.donor)
            .map((donation) => donation.donor)
    ).size;

    const stats = [
        {
            title: "Total Campaigns",
            value: demoCampaigns.length.toLocaleString("en-NP"),
            description: "All your campaign records",
            icon: HandHeart,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/ngo-admin/campaigns",
        },
        {
            title: "Active Campaigns",
            value: activeCampaigns.length.toLocaleString("en-NP"),
            description: "Currently accepting donations",
            icon: HeartHandshake,
            iconStyle: "bg-[#E6F2E6] text-[#27824B]",
            href: "/dashboard/ngo-admin/campaigns",
        },
        {
            title: "Funds Collected",
            value: formatAmount(totalCollected),
            description: "From approved fund donations",
            icon: Wallet,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/ngo-admin/donations",
        },
        {
            title: "Total Contributions",
            value: totalDonations.toLocaleString("en-NP"),
            description: "Fund and item donation records",
            icon: Users,
            iconStyle: "bg-[#F4EBD8] text-[#8A6425]",
            href: "/dashboard/ngo-admin/donations",
        },
    ];

    const maxAmount = Math.max(
        ...donationMonths.map((item) => item.amount),
        1
    );

    const attentionItems = [
        ...pendingCampaigns.map((campaign) => ({
            id: `campaign-${campaign.id}`,
            title: campaign.title,
            description: "Campaign awaiting admin approval",
            date: campaign.createdAt,
            icon: HandHeart,
            iconStyle: "bg-[#F4EBD8] text-[#8A6425]",
            href: "/dashboard/ngo-admin/campaigns",
        })),
        ...pendingVerifications.map((donation) => ({
            id: `donation-${donation.id}`,
            title: shortReference(donation.reference),
            description:
                donation.status === "RECEIVED"
                    ? "Donation receipt needs verification"
                    : "Donation awaiting review",
            date: donation.date,
            icon: ShieldCheck,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/ngo-admin/verifications",
        })),
    ].sort(
        (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px] space-y-7">
                <header className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F5F9F2] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                            <ShieldCheck size={14} />
                            NGO Workspace
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-[#183B2A] sm:text-4xl">
                            NGO Overview
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647568] sm:text-base">
                            Track your campaigns, monitor donations, and manage
                            contributions received by your organization.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 self-start sm:items-end sm:self-auto">
                        <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 text-sm text-[#183B2A]">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <CalendarDays size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold leading-6">
                                    {currentDate || "\u00A0"}
                                </p>
                                <p className="mt-0.5 text-xs text-[#647568]">
                                    Today
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <section
                    aria-label="NGO statistics"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <Link
                                key={stat.title}
                                href={stat.href}
                                className="group rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-[#647568]">
                                            {stat.title}
                                        </p>

                                        <p className="mt-3 break-words text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.iconStyle} transition-transform duration-200 group-hover:scale-105`}
                                    >
                                        <Icon size={22} strokeWidth={1.8} />
                                    </div>
                                </div>

                                <p className="mt-4 text-xs leading-5 text-[#647568]">
                                    {stat.description}
                                </p>

                                <div className="mt-4 flex items-center justify-between border-t border-[#EDF2E9] pt-3">
                                    <span className="text-xs font-medium text-[#647568]">
                                        View details
                                    </span>
                                    <ArrowUpRight
                                        size={16}
                                        className="text-[#829184] transition group-hover:text-[#166534]"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <SectionHeading
                                title="Donation Overview"
                                description="Illustrative monthly fund collection"
                            />

                            <div className="rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3">
                                <p className="text-xs font-medium text-[#166534]">
                                    Approved funds
                                </p>
                                <p className="mt-1 text-xl font-bold tracking-tight text-[#14532D]">
                                    {formatAmount(totalCollected)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                            {donationMonths.map((item, index) => (
                                <div
                                    key={item.month}
                                    className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <span className="mb-2 text-[10px] font-medium text-[#6A796B] opacity-0 transition group-hover:opacity-100 sm:text-xs">
                                        {formatAmount(item.amount)}
                                    </span>

                                    <div className="flex w-full flex-1 items-end justify-center">
                                        <div
                                            title={`${item.month}: ${formatAmount(item.amount)}`}
                                            className={`w-full max-w-14 rounded-t-lg transition-all duration-300 ${index === donationMonths.length - 1
                                                ? "bg-[#27824B]"
                                                : "bg-[#D6E7D1] group-hover:bg-[#A8CFA1]"
                                                }`}
                                            style={{
                                                height: `${(item.amount / maxAmount) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="mt-3 text-xs font-medium text-[#647568]">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2 border-t border-[#EDF2E9] pt-4 text-xs text-[#647568]">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#27824B]" />
                            Monthly fund collection

                            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#E5F2E1] px-2.5 py-1 font-semibold text-[#166534]">
                                <TrendingUp size={14} />
                                Demo trend
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeading
                            title="Needs Attention"
                            description="Items requiring your review"
                            href="/dashboard/ngo-admin/verifications"
                            linkLabel="Review"
                        />

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E9DCC0] bg-[#FBF6EA] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8A6425]">
                                    <Clock3 size={21} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#6F501D]">
                                        Pending actions
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#8A6425]">
                                        Campaigns and donations
                                    </p>
                                </div>
                            </div>

                            <span className="text-2xl font-bold tabular-nums text-[#6F501D]">
                                {attentionItems.length}
                            </span>
                        </div>

                        <div className="mt-4 space-y-1">
                            {attentionItems.slice(0, 5).map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-[#E5EDE3] hover:bg-[#F5F9F2]"
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                                        >
                                            <Icon size={19} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[#183B2A]">
                                                {item.title}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-[#647568]">
                                                {item.description}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#829184]">
                                                {formatDate(item.date)}
                                            </p>
                                        </div>

                                        <ArrowRight
                                            size={15}
                                            className="shrink-0 text-[#829184] transition group-hover:translate-x-0.5 group-hover:text-[#166534]"
                                        />
                                    </Link>
                                );
                            })}

                            {attentionItems.length === 0 && (
                                <p className="py-8 text-center text-sm text-[#647568]">
                                    Nothing needs your attention right now.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm 2xl:col-span-2">
                        <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                            <SectionHeading
                                title="Your Campaigns"
                                description="A quick look at your organization's campaigns"
                                href="/dashboard/ngo-admin/campaigns"
                            />
                        </div>

                        <div className="divide-y divide-[#EDF2E9]">
                            {demoCampaigns.slice(0, 4).map((campaign) => {
                                const statusStyle =
                                    campaign.status === "ACTIVE"
                                        ? "bg-[#E5F2E1] text-[#166534]"
                                        : campaign.status === "COMPLETED"
                                            ? "bg-[#E6F2E6] text-[#27824B]"
                                            : "bg-[#F4EBD8] text-[#8A6425]";

                                const progress =
                                    campaign.goalAmount > 0
                                        ? Math.min(
                                            100,
                                            (campaign.raisedAmount /
                                                campaign.goalAmount) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <div
                                        key={campaign.id}
                                        className="flex flex-col gap-4 p-5 transition-colors hover:bg-[#FCFDFB] sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                                <HandHeart size={21} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-sm font-semibold text-[#183B2A]">
                                                        {campaign.title}
                                                    </h4>

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyle}`}
                                                    >
                                                        {statusLabel(campaign.status)}
                                                    </span>
                                                </div>

                                                <p className="mt-1 max-w-xl text-xs leading-5 text-[#647568]">
                                                    {campaign.description}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#647568]">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Users size={14} />
                                                        {campaign.donationCount} contributions
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Package size={14} />
                                                        {campaign.donationType === "BOTH"
                                                            ? "Funds and items"
                                                            : campaign.donationType === "FUND"
                                                                ? "Fund donations"
                                                                : "Item donations"}
                                                    </span>
                                                </div>

                                                {campaign.goalAmount > 0 && (
                                                    <div className="mt-3 max-w-md">
                                                        <div className="mb-1.5 flex justify-between gap-3 text-xs">
                                                            <span className="font-medium text-[#536458]">
                                                                {formatAmount(campaign.raisedAmount)} raised
                                                            </span>
                                                            <span className="text-[#829184]">
                                                                {Math.round(progress)}%
                                                            </span>
                                                        </div>

                                                        <div className="h-2 overflow-hidden rounded-full bg-[#EDF2E9]">
                                                            <div
                                                                className="h-full rounded-full bg-[#27824B] transition-all"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                }}
                                                            />
                                                        </div>

                                                        <p className="mt-1.5 text-xs text-[#829184]">
                                                            Goal: {formatAmount(campaign.goalAmount)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/dashboard/ngo-admin/campaigns/${campaign.id}`}
                                            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-[#D8E8D4] px-3 py-2 text-xs font-semibold text-[#166534] transition hover:bg-[#E5F2E1] sm:self-center"
                                        >
                                            Details
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                            <Link
                                href="/dashboard/ngo-admin/campaigns"
                                className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#166534] transition hover:bg-[#E5F2E1] hover:text-[#14532D]"
                            >
                                Manage all campaigns
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeading
                            title="Quick Actions"
                            description="Manage your NGO workspace"
                        />

                        <div className="mt-5 space-y-2">
                            {[
                                {
                                    title: "Manage campaigns",
                                    description: "Review your campaign initiatives",
                                    href: "/dashboard/ngo-admin/campaigns",
                                    icon: HandHeart,
                                },
                                {
                                    title: "Manage donations",
                                    description: "Review incoming contributions",
                                    href: "/dashboard/ngo-admin/donations",
                                    icon: Wallet,
                                },
                                {
                                    title: "Verify donations",
                                    description: "Review received funds and items",
                                    href: "/dashboard/ngo-admin/verifications",
                                    icon: ShieldCheck,
                                },
                                {
                                    title: "View reports",
                                    description: "Review your donation activity",
                                    href: "/dashboard/ngo-admin/reports",
                                    icon: Activity,
                                },
                            ].map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-[#E5EDE3] hover:bg-[#F5F9F2]"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F6ED] text-[#536458] transition group-hover:bg-[#E5F2E1] group-hover:text-[#166534]">
                                            <Icon size={20} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#183B2A]">
                                                {action.title}
                                            </p>
                                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                                {action.description}
                                            </p>
                                        </div>

                                        <ArrowUpRight
                                            size={17}
                                            className="shrink-0 text-[#829184] transition group-hover:text-[#166534]"
                                        />
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                    <CheckCircle2 size={21} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#14532D]">
                                        Transparent giving
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-[#31523C]">
                                        Keep donation records and verification
                                        statuses up to date to build donor trust.
                                    </p>
                                    <Link
                                        href="/dashboard/ngo-admin/verifications"
                                        className="mt-3 inline-flex items-center gap-1 rounded-md py-1 text-xs font-bold text-[#166534] transition hover:text-[#14532D]"
                                    >
                                        Review donations
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm">
                    <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                        <SectionHeading
                            title="Recent Donations"
                            description="Latest contributions made to your campaigns"
                            href="/dashboard/ngo-admin/donations"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F1F6ED]">
                                <tr>
                                    {[
                                        "Donor",
                                        "Campaign",
                                        "Type",
                                        "Amount",
                                        "Status",
                                        "Date",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#647568]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#EDF2E9]">
                                {demoDonations.map((donation) => {
                                    const donorName = donation.anonymous
                                        ? "Anonymous Donor"
                                        : donation.donor || "Guest Donor";

                                    const statusStyle =
                                        donation.status === "APPROVED" ||
                                            donation.status === "VERIFIED"
                                            ? "bg-[#E5F2E1] text-[#166534]"
                                            : donation.status === "REJECTED" ||
                                                donation.status === "CANCELLED"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-[#F4EBD8] text-[#8A6425]";

                                    return (
                                        <tr
                                            key={donation.reference}
                                            className="transition-colors hover:bg-[#F8FAF6]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F2E1] text-xs font-bold text-[#166534]">
                                                        {donorName.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="whitespace-nowrap text-sm font-semibold text-[#183B2A]">
                                                            {donorName}
                                                        </p>
                                                        <p className="mt-1 text-xs text-[#829184]">
                                                            {shortReference(donation.reference)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-48 truncate text-sm text-[#536458]">
                                                    {donation.campaign}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#536458]">
                                                {donation.type === "FUND" ? "Money" : "Item"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#183B2A]">
                                                {donation.type === "FUND"
                                                    ? formatAmount(donation.amount)
                                                    : "Item donation"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}
                                                >
                                                    {statusLabel(donation.status)}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#647568]">
                                                {formatDate(donation.date)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                        <Link
                            href="/dashboard/ngo-admin/donations"
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#166534] transition hover:bg-[#E5F2E1] hover:text-[#14532D]"
                        >
                            Explore all donations
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <HeartHandshake size={22} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-[#183B2A]">
                                    Your impact at a glance
                                </h3>
                                <p className="mt-1 text-sm leading-5 text-[#647568]">
                                    {totalDonors} named donors have contributed.
                                    {" "}
                                    {completedCampaigns.length} campaign
                                    {completedCampaigns.length === 1 ? " has" : "s have"}{" "}
                                    been completed.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard/ngo-admin/reports"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                        >
                            View reports
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                <p className="pb-2 text-center text-xs leading-5 text-[#829184]">
                    ShareHope NGO Workspace · Demonstration data only
                </p>
            </div>
        </main>
    );
}