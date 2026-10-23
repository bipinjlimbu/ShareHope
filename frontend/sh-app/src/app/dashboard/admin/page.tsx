"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    Activity,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CircleDollarSign,
    HandHeart,
    HeartHandshake,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";
import AdminDashboardSkeleton from "@/components/skeleton/AdminDashboardSkeleton";

type NGOStatus = "PENDING" | "APPROVED" | "REJECTED";
type CampaignStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";
type DonationStatus =
    | "SUBMITTED"
    | "RECEIVED"
    | "VERIFIED"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";
type DonationType = "FUND" | "ITEM";
type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

interface DemoUser {
    id: number;
    username: string;
    role: "ADMIN" | "DONOR" | "NGO_ADMIN" | "NGO_STAFF";
    is_verified: boolean;
    date_joined: string;
}

interface DemoNGO {
    id: number;
    name: string;
    status: NGOStatus;
    created_at: string;
}

interface DemoCampaign {
    id: number;
    title: string;
    ngo_name: string;
    status: CampaignStatus;
    donation_type: "FUND" | "ITEM" | "BOTH";
    goal_amount: number | null;
    created_at: string;
}

interface DemoDonation {
    reference_number: string;
    donor_name: string;
    is_anonymous: boolean;
    campaign_title: string;
    donation_type: DonationType;
    status: DonationStatus;
    created_at: string;
    payment: {
        amount: number;
        currency: string;
        status: PaymentStatus;
    } | null;
}

const demoUsers: DemoUser[] = [
    {
        id: 1,
        username: "admin_suman",
        role: "ADMIN",
        is_verified: true,
        date_joined: "2026-05-12T09:00:00Z",
    },
    {
        id: 2,
        username: "aarav_sharma",
        role: "DONOR",
        is_verified: true,
        date_joined: "2026-06-18T10:30:00Z",
    },
    {
        id: 3,
        username: "sita_karki",
        role: "DONOR",
        is_verified: true,
        date_joined: "2026-07-05T08:15:00Z",
    },
    {
        id: 4,
        username: "hope_foundation",
        role: "NGO_ADMIN",
        is_verified: true,
        date_joined: "2026-08-10T11:00:00Z",
    },
    {
        id: 5,
        username: "rohan_thapa",
        role: "DONOR",
        is_verified: false,
        date_joined: "2026-10-22T12:00:00Z",
    },
];

const demoNGOs: DemoNGO[] = [
    {
        id: 1,
        name: "Hope for Children Nepal",
        status: "PENDING",
        created_at: "2026-10-23T08:10:00Z",
    },
    {
        id: 2,
        name: "Community Care Nepal",
        status: "APPROVED",
        created_at: "2026-08-15T09:00:00Z",
    },
    {
        id: 3,
        name: "Helping Hands Foundation",
        status: "APPROVED",
        created_at: "2026-07-12T10:00:00Z",
    },
];

const demoCampaigns: DemoCampaign[] = [
    {
        id: 1,
        title: "Winter Relief Program",
        ngo_name: "Community Care Nepal",
        status: "PENDING",
        donation_type: "BOTH",
        goal_amount: 150000,
        created_at: "2026-10-23T07:47:00Z",
    },
    {
        id: 2,
        title: "Education for Every Child",
        ngo_name: "Helping Hands Foundation",
        status: "ACTIVE",
        donation_type: "FUND",
        goal_amount: 250000,
        created_at: "2026-09-12T09:00:00Z",
    },
    {
        id: 3,
        title: "Community Food Support",
        ngo_name: "Community Care Nepal",
        status: "PENDING",
        donation_type: "ITEM",
        goal_amount: null,
        created_at: "2026-10-23T07:00:00Z",
    },
    {
        id: 4,
        title: "Medical Assistance Fund",
        ngo_name: "Helping Hands Foundation",
        status: "ACTIVE",
        donation_type: "FUND",
        goal_amount: 100000,
        created_at: "2026-09-20T08:00:00Z",
    },
];

const demoDonations: DemoDonation[] = [
    {
        reference_number: "a12f9c21-7b34-4d20-9f18-000000001052",
        donor_name: "Aarav Sharma",
        is_anonymous: false,
        campaign_title: "Education for Every Child",
        donation_type: "FUND",
        status: "APPROVED",
        created_at: "2026-10-23T09:00:00Z",
        payment: {
            amount: 5000,
            currency: "NPR",
            status: "SUCCESS",
        },
    },
    {
        reference_number: "a12f9c21-7b34-4d20-9f18-000000001051",
        donor_name: "Sita Karki",
        is_anonymous: false,
        campaign_title: "Community Food Support",
        donation_type: "ITEM",
        status: "SUBMITTED",
        created_at: "2026-10-23T08:20:00Z",
        payment: null,
    },
    {
        reference_number: "a12f9c21-7b34-4d20-9f18-000000001050",
        donor_name: "",
        is_anonymous: true,
        campaign_title: "Winter Relief Program",
        donation_type: "FUND",
        status: "APPROVED",
        created_at: "2026-10-22T10:30:00Z",
        payment: {
            amount: 10000,
            currency: "NPR",
            status: "SUCCESS",
        },
    },
    {
        reference_number: "a12f9c21-7b34-4d20-9f18-000000001049",
        donor_name: "Rohan Thapa",
        is_anonymous: false,
        campaign_title: "Medical Assistance Fund",
        donation_type: "FUND",
        status: "RECEIVED",
        created_at: "2026-10-22T08:45:00Z",
        payment: {
            amount: 3000,
            currency: "NPR",
            status: "PENDING",
        },
    },
    {
        reference_number: "a12f9c21-7b34-4d20-9f18-000000001048",
        donor_name: "Anisha Rai",
        is_anonymous: false,
        campaign_title: "Community Food Support",
        donation_type: "ITEM",
        status: "VERIFIED",
        created_at: "2026-10-21T11:00:00Z",
        payment: null,
    },
];

const donationMonths = [
    { month: "May", amount: 32000 },
    { month: "Jun", amount: 46000 },
    { month: "Jul", amount: 38000 },
    { month: "Aug", amount: 59000 },
    { month: "Sep", amount: 52000 },
    { month: "Oct", amount: 76000 },
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
            <div>
                <h3 className="text-base font-bold text-[#183B2A]">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-[#6A796B]">
                    {description}
                </p>
            </div>

            {href && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] transition hover:text-[#14532D]"
                >
                    {linkLabel}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

export default function AdminDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setIsLoading(false);
        }, 650);

        return () => window.clearTimeout(timeout);
    }, []);

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    const activeCampaigns = demoCampaigns.filter(
        (campaign) => campaign.status === "ACTIVE"
    ).length;

    const successfulPayments = demoDonations.filter(
        (donation) => donation.payment?.status === "SUCCESS"
    );

    const totalFunds = successfulPayments.reduce(
        (total, donation) => total + (donation.payment?.amount ?? 0),
        0
    );

    const pendingNGOs = demoNGOs.filter(
        (ngo) => ngo.status === "PENDING"
    );

    const pendingCampaigns = demoCampaigns.filter(
        (campaign) => campaign.status === "PENDING"
    );

    const pendingDonations = demoDonations.filter(
        (donation) =>
            donation.status === "SUBMITTED" ||
            donation.status === "RECEIVED"
    );

    const totalPending =
        pendingNGOs.length +
        pendingCampaigns.length +
        pendingDonations.length;

    const stats = [
        {
            title: "Total Users",
            value: demoUsers.length.toLocaleString("en-NP"),
            description: "Registered platform accounts",
            icon: Users,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/admin/users",
        },
        {
            title: "Registered NGOs",
            value: demoNGOs.length.toLocaleString("en-NP"),
            description: "Registered organizations",
            icon: Building2,
            iconStyle: "bg-[#F4EBD8] text-[#8A6425]",
            href: "/dashboard/admin/ngos",
        },
        {
            title: "Active Campaigns",
            value: activeCampaigns.toLocaleString("en-NP"),
            description: "Campaigns currently active",
            icon: HandHeart,
            iconStyle: "bg-[#E6F2E6] text-[#27824B]",
            href: "/dashboard/admin/campaigns",
        },
        {
            title: "Successful Donations",
            value: successfulPayments.length.toLocaleString("en-NP"),
            description: "Donations with successful payments",
            icon: Wallet,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/admin/donations",
        },
    ];

    const maxAmount = Math.max(
        ...donationMonths.map((item) => item.amount),
        1
    );

    const pendingApprovals = [
        ...pendingNGOs.map((ngo) => ({
            id: `ngo-${ngo.id}`,
            title: ngo.name,
            description: "NGO registration request",
            created_at: ngo.created_at,
            type: "NGO",
            icon: Building2,
            iconStyle: "bg-[#F4EBD8] text-[#8A6425]",
            href: "/dashboard/admin/ngos",
        })),
        ...pendingCampaigns.map((campaign) => ({
            id: `campaign-${campaign.id}`,
            title: campaign.title,
            description: "Campaign approval request",
            created_at: campaign.created_at,
            type: "Campaign",
            icon: HandHeart,
            iconStyle: "bg-[#E5F2E1] text-[#166534]",
            href: "/dashboard/admin/campaigns",
        })),
        ...pendingDonations.map((donation) => ({
            id: `donation-${donation.reference_number}`,
            title: shortReference(donation.reference_number),
            description:
                donation.status === "RECEIVED"
                    ? "Donation receipt verification"
                    : "Donation awaiting review",
            created_at: donation.created_at,
            type: "Donation",
            icon: ShieldCheck,
            iconStyle: "bg-[#E6F2E6] text-[#27824B]",
            href: "/dashboard/admin/verifications",
        })),
    ].sort(
        (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
    );

    return (
        <div className="mx-auto max-w-[1600px] space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-[#166534]">
                        <HeartHandshake size={18} />
                        Administration
                    </div>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                        Dashboard Overview
                    </h2>

                    <p className="mt-2 text-sm text-[#6A796B] sm:text-base">
                        Monitor users, organizations, campaigns, and donations across ShareHope.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-[#E1E9DC] bg-[#FFFCF6] px-4 py-3 shadow-sm sm:self-center">
                    <CalendarDays size={18} className="text-[#27824B]" />
                    <span className="text-sm font-medium text-[#31523C]">
                        {new Intl.DateTimeFormat("en-NP", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            timeZone: "Asia/Kathmandu",
                        }).format(new Date())}
                    </span>
                </div>
            </section>

            <section
                aria-label="Platform statistics"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <Link
                            key={stat.title}
                            href={stat.href}
                            className="group rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#BBD8B5] hover:shadow-lg hover:shadow-[#183B2A]/5 sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-[#6A796B]">
                                        {stat.title}
                                    </p>
                                    <p className="mt-3 text-3xl font-bold tracking-tight text-[#183B2A]">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconStyle}`}>
                                    <Icon size={23} strokeWidth={1.8} />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-2">
                                <span className="text-xs text-[#6A796B]">
                                    {stat.description}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6 xl:col-span-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <SectionHeading
                            title="Donation Overview"
                            description="Illustrative monthly payment totals"
                        />

                        <div className="rounded-xl bg-[#E5F2E1] px-4 py-3">
                            <p className="text-xs font-medium text-[#166534]">
                                Successful payments
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#14532D]">
                                {formatAmount(totalFunds)}
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

                                <span className="mt-3 text-xs font-medium text-[#6A796B]">
                                    {item.month}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center gap-2 border-t border-[#E6EDE4] pt-4 text-xs text-[#6A796B]">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#27824B]" />
                        Monthly payment totals
                        <span className="ml-auto inline-flex items-center gap-1 font-medium text-[#166534]">
                            <TrendingUp size={14} />
                            Demo trend
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                    <SectionHeading
                        title="Pending Approvals"
                        description="Records requiring attention"
                        href="/dashboard/admin/ngos"
                        linkLabel="Review"
                    />

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F4EBD8] p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFFCF6] text-[#8A6425]">
                                <Clock3 size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#6F501D]">
                                    Awaiting review
                                </p>
                                <p className="mt-1 text-xs text-[#8A6425]">
                                    NGOs, campaigns, and donations
                                </p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-[#6F501D]">
                            {totalPending}
                        </span>
                    </div>

                    <div className="mt-4 space-y-1">
                        {pendingApprovals.slice(0, 5).map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#EDF6E9]"
                                >
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}>
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-[#183B2A]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-[#6A796B]">
                                            {item.description}
                                        </p>
                                        <p className="mt-1 text-[11px] text-[#778477]">
                                            {formatDate(item.created_at)}
                                        </p>
                                    </div>

                                    <ArrowRight size={15} className="shrink-0 text-[#778477]" />
                                </Link>
                            );
                        })}

                        {pendingApprovals.length === 0 && (
                            <p className="py-8 text-center text-sm text-[#6A796B]">
                                No pending approvals.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] 2xl:col-span-2">
                    <div className="border-b border-[#E6EDE4] px-5 py-5 sm:px-6">
                        <SectionHeading
                            title="Recent Donations"
                            description="Latest donation records and their statuses"
                            href="/dashboard/admin/donations"
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
                                            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#6A796B]"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#E6EDE4]">
                                {demoDonations.map((donation) => {
                                    const donorName = donation.is_anonymous
                                        ? "Anonymous Donor"
                                        : donation.donor_name || "Guest Donor";

                                    const statusStyle =
                                        donation.status === "APPROVED"
                                            ? "bg-[#E5F2E1] text-[#166534]"
                                            : donation.status === "REJECTED" ||
                                                donation.status === "CANCELLED"
                                                ? "bg-red-50 text-red-700"
                                                : "bg-[#F4EBD8] text-[#8A6425]";

                                    return (
                                        <tr
                                            key={donation.reference_number}
                                            className="transition hover:bg-[#F8FAF5]"
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
                                                        <p className="mt-1 text-xs text-[#778477]">
                                                            {shortReference(donation.reference_number)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-48 truncate text-sm text-[#536458]">
                                                    {donation.campaign_title}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-[#536458]">
                                                {donation.donation_type === "FUND" ? "Money" : "Item"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#183B2A]">
                                                {donation.payment
                                                    ? formatAmount(
                                                        donation.payment.amount,
                                                        donation.payment.currency
                                                    )
                                                    : "—"}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}>
                                                    {statusLabel(donation.status)}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-sm text-[#6A796B]">
                                                {formatDate(donation.created_at)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-[#E6EDE4] px-5 py-4 sm:px-6">
                        <Link
                            href="/dashboard/admin/donations"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#166534] transition hover:text-[#14532D]"
                        >
                            Explore all donations
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                    <SectionHeading
                        title="Quick Actions"
                        description="Navigate to key admin sections"
                    />

                    <div className="mt-5 space-y-2">
                        {[
                            {
                                title: "Manage users",
                                description: "View platform accounts",
                                href: "/dashboard/admin/users",
                                icon: Users,
                            },
                            {
                                title: "Review NGOs",
                                description: "Review organization registrations",
                                href: "/dashboard/admin/ngos",
                                icon: Building2,
                            },
                            {
                                title: "Review campaigns",
                                description: "Review campaign submissions",
                                href: "/dashboard/admin/campaigns",
                                icon: HandHeart,
                            },
                            {
                                title: "View audit logs",
                                description: "Review recorded platform activity",
                                href: "/dashboard/admin/audit-logs",
                                icon: Activity,
                            },
                        ].map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-[#E5F2E1] hover:bg-[#EDF6E9]"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F6ED] text-[#536458] transition group-hover:bg-[#E5F2E1] group-hover:text-[#166534]">
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#183B2A]">
                                            {action.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-[#6A796B]">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight size={17} className="shrink-0 text-[#778477] transition group-hover:text-[#166534]" />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-5 rounded-xl border border-[#D7E9D2] bg-[#EDF6E9] p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#166534]" />
                            <div>
                                <p className="text-sm font-semibold text-[#14532D]">
                                    Trust and transparency
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#31523C]">
                                    Review donation verifications and audit records to support accountable giving.
                                </p>
                                <Link
                                    href="/dashboard/admin/audit-logs"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#166534] hover:text-[#14532D]"
                                >
                                    Review activity
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <CircleDollarSign size={22} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#183B2A]">
                                ShareHope platform summary
                            </h3>
                            <p className="mt-1 text-sm text-[#6A796B]">
                                Every contribution helps support a meaningful cause.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/admin/reports"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        View reports
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <p className="text-center text-xs text-[#778477]">
                ShareHope Administration · Demonstration data only
            </p>
        </div>
    );
}