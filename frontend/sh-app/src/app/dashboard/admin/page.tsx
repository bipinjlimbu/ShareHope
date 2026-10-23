"use client";

import Link from "next/link";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock3,
    HandHeart,
    HeartHandshake,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet,
    Activity,
    CalendarDays,
    CircleDollarSign,
} from "lucide-react";

const stats = [
    {
        title: "Total Users",
        value: "1,248",
        change: "+12.8%",
        description: "Compared to last month",
        icon: Users,
        color: "bg-blue-50 text-blue-700",
        trend: "up",
        href: "/dashboard/admin/users",
    },
    {
        title: "Registered NGOs",
        value: "86",
        change: "+8.4%",
        description: "Compared to last month",
        icon: Building2,
        color: "bg-violet-50 text-violet-700",
        trend: "up",
        href: "/dashboard/admin/ngos",
    },
    {
        title: "Active Campaigns",
        value: "124",
        change: "+15.2%",
        description: "Compared to last month",
        icon: HandHeart,
        color: "bg-orange-50 text-orange-700",
        trend: "up",
        href: "/dashboard/admin/campaigns",
    },
    {
        title: "Total Donations",
        value: "3,642",
        change: "+18.6%",
        description: "Compared to last month",
        icon: Wallet,
        color: "bg-emerald-50 text-emerald-700",
        trend: "up",
        href: "/dashboard/admin/donations",
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

const pendingApprovals = [
    {
        id: 1,
        title: "Hope for Children Nepal",
        description: "NGO registration request",
        time: "12 minutes ago",
        type: "NGO",
        icon: Building2,
        color: "bg-violet-50 text-violet-700",
        href: "/dashboard/admin/ngos",
    },
    {
        id: 2,
        title: "Winter Relief Program",
        description: "Campaign approval request",
        time: "35 minutes ago",
        type: "Campaign",
        icon: HandHeart,
        color: "bg-orange-50 text-orange-700",
        href: "/dashboard/admin/campaigns",
    },
    {
        id: 3,
        title: "Community Food Support",
        description: "Campaign approval request",
        time: "1 hour ago",
        type: "Campaign",
        icon: HandHeart,
        color: "bg-orange-50 text-orange-700",
        href: "/dashboard/admin/campaigns",
    },
    {
        id: 4,
        title: "Donation #SH-1048",
        description: "Donation verification pending",
        time: "2 hours ago",
        type: "Verification",
        icon: ShieldCheck,
        color: "bg-blue-50 text-blue-700",
        href: "/dashboard/admin/verifications",
    },
];

const recentDonations = [
    {
        id: "SH-1052",
        donor: "Aarav Sharma",
        campaign: "Education for Every Child",
        amount: "NPR 5,000",
        date: "Oct 23, 2026",
        status: "Completed",
        initials: "AS",
    },
    {
        id: "SH-1051",
        donor: "Sita Karki",
        campaign: "Community Food Support",
        amount: "NPR 2,500",
        date: "Oct 23, 2026",
        status: "Pending",
        initials: "SK",
    },
    {
        id: "SH-1050",
        donor: "Anonymous Donor",
        campaign: "Winter Relief Program",
        amount: "NPR 10,000",
        date: "Oct 22, 2026",
        status: "Completed",
        initials: "AD",
    },
    {
        id: "SH-1049",
        donor: "Rohan Thapa",
        campaign: "Medical Assistance Fund",
        amount: "NPR 3,000",
        date: "Oct 22, 2026",
        status: "Pending",
        initials: "RT",
    },
    {
        id: "SH-1048",
        donor: "Anisha Rai",
        campaign: "Community Food Support",
        amount: "NPR 1,500",
        date: "Oct 21, 2026",
        status: "Completed",
        initials: "AR",
    },
];

const quickActions = [
    {
        title: "Manage users",
        description: "View and manage platform accounts",
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
        description: "Manage campaign submissions",
        href: "/dashboard/admin/campaigns",
        icon: HandHeart,
    },
    {
        title: "View audit logs",
        description: "Review platform activities",
        href: "/dashboard/admin/audit-logs",
        icon: Activity,
    },
];

function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "NPR",
        maximumFractionDigits: 0,
    }).format(amount);
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
                <h3 className="text-base font-bold text-slate-900">
                    {title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            {href && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                    {linkLabel}
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
}

export default function AdminDashboardPage() {
    const maxAmount = Math.max(
        ...donationMonths.map((item) => item.amount),
    );

    const totalPending =
        pendingApprovals.length;

    return (
        <div className="mx-auto max-w-[1600px] space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <HeartHandshake size={18} />
                        Administration
                    </div>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Dashboard Overview
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Welcome back! Here&apos;s what&apos;s happening across
                        ShareHope today.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-center">
                    <CalendarDays
                        size={18}
                        className="text-emerald-600"
                    />
                    <span className="text-sm font-medium text-slate-700">
                        October 23, 2026
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
                            className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/[0.04] sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {stat.title}
                                    </p>

                                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                        {stat.value}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                                >
                                    <Icon size={23} strokeWidth={1.8} />
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                                    <TrendingUp size={13} />
                                    {stat.change}
                                </span>

                                <span className="text-xs text-slate-500">
                                    {stat.description}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:col-span-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <SectionHeading
                            title="Donation Overview"
                            description="Monthly donation amounts across the platform"
                        />

                        <div className="rounded-xl bg-emerald-50 px-4 py-3">
                            <p className="text-xs font-medium text-emerald-700">
                                Funds raised this period
                            </p>
                            <p className="mt-1 text-xl font-bold text-emerald-800">
                                NPR 76,000
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                        {donationMonths.map((item, index) => {
                            const height =
                                (item.amount / maxAmount) * 100;

                            return (
                                <div
                                    key={item.month}
                                    className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <span className="mb-2 text-[10px] font-medium text-slate-500 opacity-0 transition group-hover:opacity-100 sm:text-xs">
                                        {formatAmount(item.amount)}
                                    </span>

                                    <div className="flex w-full flex-1 items-end justify-center">
                                        <div
                                            title={`${item.month}: ${formatAmount(item.amount)}`}
                                            className={`w-full max-w-14 rounded-t-lg transition-all duration-300 ${index === donationMonths.length - 1
                                                ? "bg-emerald-600"
                                                : "bg-emerald-100 group-hover:bg-emerald-300"
                                                }`}
                                            style={{
                                                height: `${height}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="mt-3 text-xs font-medium text-slate-500">
                                        {item.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
                        Monthly donation amount
                        <span className="ml-auto inline-flex items-center gap-1 font-medium text-emerald-700">
                            <TrendingUp size={14} />
                            Positive trend
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <SectionHeading
                        title="Pending Approvals"
                        description="Items that need your attention"
                        href="/dashboard/admin/ngos"
                        linkLabel="Review"
                    />

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-amber-50 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700">
                                <Clock3 size={21} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-amber-900">
                                    Awaiting review
                                </p>
                                <p className="mt-1 text-xs text-amber-700">
                                    Across all categories
                                </p>
                            </div>
                        </div>

                        <span className="text-2xl font-bold text-amber-800">
                            {totalPending}
                        </span>
                    </div>

                    <div className="mt-4 space-y-1">
                        {pendingApprovals.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                                >
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                                    >
                                        <Icon size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            {item.description}
                                        </p>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            {item.time}
                                        </p>
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="shrink-0 text-slate-400"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white 2xl:col-span-2">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <SectionHeading
                            title="Recent Donations"
                            description="A snapshot of the latest donation activity"
                            href="/dashboard/admin/donations"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    {[
                                        "Donor",
                                        "Campaign",
                                        "Amount",
                                        "Status",
                                        "Date",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {recentDonations.map((donation) => (
                                    <tr
                                        key={donation.id}
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                                                    {donation.initials}
                                                </div>
                                                <div>
                                                    <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                                                        {donation.donor}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {donation.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="max-w-48 truncate text-sm text-slate-600">
                                                {donation.campaign}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-800">
                                            {donation.amount}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${donation.status === "Completed"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {donation.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                                            {donation.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
                        <Link
                            href="/dashboard/admin/donations"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                        >
                            Explore all donations
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    <SectionHeading
                        title="Quick Actions"
                        description="Navigate to key admin sections"
                    />

                    <div className="mt-5 space-y-2">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition hover:border-emerald-100 hover:bg-emerald-50/60"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-100 group-hover:text-emerald-800">
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {action.title}
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {action.description}
                                        </p>
                                    </div>

                                    <ArrowUpRight
                                        size={17}
                                        className="shrink-0 text-slate-400 transition group-hover:text-emerald-700"
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck
                                size={21}
                                className="mt-0.5 shrink-0 text-emerald-700"
                            />

                            <div>
                                <p className="text-sm font-semibold text-emerald-900">
                                    Trust & transparency
                                </p>
                                <p className="mt-1 text-xs leading-5 text-emerald-800">
                                    Keep donation records accountable by
                                    reviewing verification requests and
                                    platform audit logs.
                                </p>

                                <Link
                                    href="/dashboard/admin/audit-logs"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                                >
                                    Review activity
                                    <ArrowDownRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <CircleDollarSign size={22} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">
                                ShareHope platform summary
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Every contribution helps support a meaningful cause.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/admin/reports"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        View reports
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            <p className="text-center text-xs text-slate-400">
                ShareHope Administration · Dashboard figures are demonstration data.
            </p>
        </div>
    );
}
