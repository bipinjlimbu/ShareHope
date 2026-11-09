"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[#E8EEE5] ${className}`}
        />
    );
}

function SectionHeadingSkeleton({
    link = false,
}: {
    link?: boolean;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-5 w-40" />
                <SkeletonBlock className="h-3.5 w-56 max-w-full" />
            </div>

            {link && (
                <SkeletonBlock className="h-8 w-20 shrink-0" />
            )}
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-9 w-32 max-w-full" />
                </div>

                <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
            </div>

            <SkeletonBlock className="mt-4 h-3 w-48 max-w-full" />

            <div className="mt-4 flex items-center justify-between border-t border-[#EDF2E9] pt-3">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-4 w-4 rounded" />
            </div>
        </div>
    );
}

function AttentionItemSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-xl p-3">
            <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-3.5 w-32 max-w-full" />
                <SkeletonBlock className="h-3 w-44 max-w-full" />
                <SkeletonBlock className="h-2.5 w-20" />
            </div>

            <SkeletonBlock className="h-4 w-4 shrink-0 rounded" />
        </div>
    );
}

function CampaignItemSkeleton() {
    return (
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <SkeletonBlock className="h-4 w-44 max-w-full" />
                        <SkeletonBlock className="h-5 w-16 rounded-full" />
                    </div>

                    <SkeletonBlock className="h-3 w-64 max-w-full" />

                    <div className="flex flex-wrap gap-4">
                        <SkeletonBlock className="h-3 w-28" />
                        <SkeletonBlock className="h-3 w-24" />
                    </div>

                    <div className="max-w-md space-y-2">
                        <div className="flex justify-between">
                            <SkeletonBlock className="h-3 w-28" />
                            <SkeletonBlock className="h-3 w-10" />
                        </div>

                        <SkeletonBlock className="h-2 w-full rounded-full" />
                        <SkeletonBlock className="h-3 w-32" />
                    </div>
                </div>
            </div>

            <SkeletonBlock className="h-9 w-24 shrink-0 rounded-lg self-start sm:self-center" />
        </div>
    );
}

function QuickActionSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-xl p-3">
            <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-3.5 w-36 max-w-full" />
                <SkeletonBlock className="h-3 w-48 max-w-full" />
            </div>

            <SkeletonBlock className="h-4 w-4 shrink-0 rounded" />
        </div>
    );
}

function DonationRowSkeleton() {
    return (
        <tr>
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="space-y-2">
                        <SkeletonBlock className="h-3.5 w-28" />
                        <SkeletonBlock className="h-3 w-20" />
                    </div>
                </div>
            </td>

            <td className="px-5 py-4">
                <SkeletonBlock className="h-3.5 w-36" />
            </td>

            <td className="px-5 py-4">
                <SkeletonBlock className="h-3.5 w-12" />
            </td>

            <td className="px-5 py-4">
                <SkeletonBlock className="h-3.5 w-24" />
            </td>

            <td className="px-5 py-4">
                <SkeletonBlock className="h-6 w-20 rounded-full" />
            </td>

            <td className="px-5 py-4">
                <SkeletonBlock className="h-3.5 w-24" />
            </td>
        </tr>
    );
}

export default function OverviewSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px] space-y-7">
                <header className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1 space-y-3">
                        <SkeletonBlock className="h-9 w-64 max-w-full sm:h-10" />
                        <SkeletonBlock className="h-4 w-full max-w-2xl" />
                        <SkeletonBlock className="h-4 w-3/4 max-w-xl" />
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                        <div className="flex flex-wrap items-center gap-2">
                            <SkeletonBlock className="h-12 min-w-0 flex-1 rounded-xl sm:w-28 sm:flex-none" />
                            <SkeletonBlock className="h-12 min-w-0 flex-1 rounded-xl sm:w-32 sm:flex-none" />
                        </div>

                        <div className="flex w-full items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:w-auto">
                            <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-32" />
                                <SkeletonBlock className="h-3 w-12" />
                            </div>
                        </div>
                    </div>
                </header>

                <section
                    aria-label="Loading NGO statistics"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <SectionHeadingSkeleton />

                            <div className="rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3">
                                <SkeletonBlock className="h-3 w-24" />
                                <SkeletonBlock className="mt-2 h-6 w-32" />
                            </div>
                        </div>

                        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                            {[35, 55, 45, 70, 85, 100].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <div className="flex w-full flex-1 items-end justify-center">
                                        <SkeletonBlock
                                            className="w-full max-w-14 rounded-t-lg"
                                        />
                                    </div>

                                    <SkeletonBlock className="mt-3 h-3 w-8" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2 border-t border-[#EDF2E9] pt-4">
                            <SkeletonBlock className="h-2.5 w-2.5 rounded-sm" />
                            <SkeletonBlock className="h-3 w-36" />
                            <SkeletonBlock className="ml-auto h-7 w-28 rounded-full" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeadingSkeleton link />

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E9DCC0] bg-[#FBF6EA] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                                <div className="min-w-0 space-y-2">
                                    <SkeletonBlock className="h-3.5 w-28" />
                                    <SkeletonBlock className="h-3 w-36 max-w-full" />
                                </div>
                            </div>

                            <SkeletonBlock className="h-7 w-8" />
                        </div>

                        <div className="mt-4 space-y-1">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <AttentionItemSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm 2xl:col-span-2">
                        <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                            <SectionHeadingSkeleton link />
                        </div>

                        <div className="divide-y divide-[#EDF2E9]">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <CampaignItemSkeleton key={index} />
                            ))}
                        </div>

                        <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                            <SkeletonBlock className="h-8 w-40" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <SectionHeadingSkeleton />

                        <div className="mt-5 space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <QuickActionSkeleton key={index} />
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] p-4">
                            <div className="flex items-start gap-3">
                                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonBlock className="h-3.5 w-32" />
                                    <SkeletonBlock className="h-3 w-full" />
                                    <SkeletonBlock className="h-3 w-4/5" />
                                    <SkeletonBlock className="mt-3 h-3 w-28" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm">
                    <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                        <SectionHeadingSkeleton link />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F1F6ED]">
                                <tr>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <th
                                            key={index}
                                            className="px-5 py-3.5"
                                        >
                                            <SkeletonBlock className="h-3 w-16" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#EDF2E9]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <DonationRowSkeleton key={index} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                        <SkeletonBlock className="h-8 w-40" />
                    </div>
                </section>

                <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-40" />
                                <SkeletonBlock className="h-3.5 w-64 max-w-full" />
                            </div>
                        </div>

                        <SkeletonBlock className="h-11 w-32 rounded-xl" />
                    </div>
                </section>

                <div className="flex justify-center pb-2">
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
            </div>
        </main>
    );
}
