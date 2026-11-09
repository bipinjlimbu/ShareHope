
"use client";

import {
    Building2,
    Clock3,
    ShieldCheck,
} from "lucide-react";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[#E8EFE5] ${className}`}
        />
    );
}

function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-36" />
                    <SkeletonBlock className="mt-4 h-9 w-20" />
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1]">
                    <SkeletonBlock className="h-5 w-5 rounded-md" />
                </div>
            </div>

            <SkeletonBlock className="mt-5 h-3 w-4/5" />
        </div>
    );
}

function NGOCardSkeleton() {
    return (
        <article className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            {/* NGO identity and status */}
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#E5EDE3] bg-[#E5F2E1]">
                    <Building2
                        size={25}
                        className="text-[#C2D9BB]"
                    />
                </div>

                <div className="min-w-0 flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <SkeletonBlock className="h-5 w-40 max-w-full" />
                        <SkeletonBlock className="h-6 w-20 rounded-full" />
                    </div>

                    <SkeletonBlock className="mt-3 h-3 w-48 max-w-full" />
                    <SkeletonBlock className="mt-2 h-3 w-20" />
                </div>
            </div>

            {/* Description */}
            <div className="mt-5 space-y-2">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-11/12" />
                <SkeletonBlock className="h-3 w-3/4" />
            </div>

            {/* Contact details */}
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-4/5" />
                </div>

                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-3/5" />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-2/3" />
                </div>
            </div>

            <div className="my-5 border-t border-[#EDF2E9]" />

            {/* Documents and members */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-28" />
                </div>

                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-24" />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-3 w-40" />
                </div>
            </div>

            <div className="my-5 border-t border-[#EDF2E9]" />

            {/* Submitted by */}
            <div className="flex items-center gap-2">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-3 w-32" />
            </div>

            {/* View application button */}
            <SkeletonBlock className="mt-5 h-11 w-full rounded-xl" />

            {/* Approve and reject buttons */}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SkeletonBlock className="h-11 rounded-xl" />
                <SkeletonBlock className="h-11 rounded-xl" />
            </div>
        </article>
    );
}

export default function PendingNGOsSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                {/* Page header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="flex-1">
                        <SkeletonBlock className="h-9 w-80 max-w-full sm:h-10" />

                        <SkeletonBlock className="mt-3 h-4 w-full max-w-xl" />
                        <SkeletonBlock className="mt-2 h-4 w-3/4 max-w-md" />
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:self-auto">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1]">
                            <Building2
                                size={19}
                                className="text-[#C2D9BB]"
                            />
                        </div>

                        <div>
                            <SkeletonBlock className="h-6 w-12" />
                            <SkeletonBlock className="mt-2 h-3 w-24" />
                        </div>
                    </div>
                </header>

                {/* Summary cards */}
                <section
                    aria-label="Loading NGO statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                >
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                </section>

                {/* Tabs */}
                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-2 shadow-sm sm:p-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center justify-center gap-2 rounded-xl bg-[#F0F1EF] px-3 py-4 sm:px-5">
                            <SkeletonBlock className="h-4 w-32 max-w-[45%]" />
                            <SkeletonBlock className="h-5 w-7 rounded-full" />
                        </div>

                        <div className="flex items-center justify-center gap-2 rounded-xl px-3 py-4 sm:px-5">
                            <SkeletonBlock className="h-4 w-36 max-w-[45%]" />
                            <SkeletonBlock className="h-5 w-7 rounded-full" />
                        </div>
                    </div>
                </section>

                {/* Search bar */}
                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded bg-[#E8EFE5]" />

                        <SkeletonBlock className="h-12 w-full rounded-xl" />
                    </div>
                </section>

                {/* Applications heading */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <SkeletonBlock className="h-6 w-64 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-48 max-w-full" />
                    </div>

                    <SkeletonBlock className="h-10 w-28 rounded-xl" />
                </div>

                {/* NGO application cards */}
                <section
                    aria-label="Loading pending NGO applications"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                >
                    <NGOCardSkeleton />
                    <NGOCardSkeleton />
                    <NGOCardSkeleton />
                    <NGOCardSkeleton />
                </section>

                {/* Footer text */}
                <div className="mt-8 flex justify-center">
                    <SkeletonBlock className="h-3 w-80 max-w-full" />
                </div>
            </div>
        </main>
    );
}
