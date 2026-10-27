"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-lg bg-[#E8EEE4] ${className}`}
        />
    );
}

function SkeletonPanel({
    className = "",
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`rounded-2xl border border-[#E5EDE3] bg-white shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

function SkeletonSectionHeading({
    hasLink = false,
}: {
    hasLink?: boolean;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-5 w-40 max-w-full" />
                <SkeletonBlock className="h-4 w-56 max-w-full" />
            </div>

            {hasLink && (
                <SkeletonBlock className="h-8 w-20 shrink-0" />
            )}
        </div>
    );
}

export default function OverviewSkeleton() {
    return (
        <main
            aria-label="Loading dashboard overview"
            aria-busy="true"
            className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5"
        >
            <div className="mx-auto w-full max-w-[1600px] space-y-7">
                <SkeletonPanel className="mb-8 flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1 space-y-3">
                        <SkeletonBlock className="h-9 w-72 max-w-full sm:h-10 sm:w-96" />
                        <SkeletonBlock className="h-4 w-full max-w-2xl" />
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:self-auto">
                        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-28" />
                            <SkeletonBlock className="h-3 w-12" />
                        </div>
                    </div>
                </SkeletonPanel>

                <section
                    aria-label="Loading platform statistics"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonPanel key={index} className="p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-3">
                                    <SkeletonBlock className="h-4 w-32 max-w-full" />
                                    <SkeletonBlock className="h-10 w-24" />
                                </div>

                                <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
                            </div>

                            <SkeletonBlock className="mt-4 h-3 w-48 max-w-full" />

                            <div className="mt-4 flex items-center justify-between border-t border-[#EDF2E9] pt-3">
                                <SkeletonBlock className="h-3 w-20" />
                                <SkeletonBlock className="h-4 w-4 rounded-full" />
                            </div>
                        </SkeletonPanel>
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <SkeletonPanel className="p-5 sm:p-6 xl:col-span-2">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <SkeletonSectionHeading />
                            </div>

                            <div className="w-full rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3 sm:w-48">
                                <SkeletonBlock className="h-3 w-28" />
                                <SkeletonBlock className="mt-2 h-6 w-32 max-w-full" />
                            </div>
                        </div>

                        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                            {[42, 60, 49, 76, 66, 94].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <SkeletonBlock className="mb-2 h-3 w-10 max-w-full opacity-60" />

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
                            <SkeletonBlock className="h-3 w-3 rounded-sm" />
                            <SkeletonBlock className="h-3 w-36" />
                            <SkeletonBlock className="ml-auto h-6 w-24 rounded-full" />
                        </div>
                    </SkeletonPanel>

                    <SkeletonPanel className="p-5 sm:p-6">
                        <SkeletonSectionHeading hasLink />

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E9DCC0] bg-[#FBF6EA] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonBlock className="h-4 w-28 max-w-full" />
                                    <SkeletonBlock className="h-3 w-36 max-w-full" />
                                </div>
                            </div>

                            <SkeletonBlock className="h-8 w-8 shrink-0" />
                        </div>

                        <div className="mt-4 space-y-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl border border-transparent p-3"
                                >
                                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <SkeletonBlock className="h-4 w-36 max-w-full" />
                                        <SkeletonBlock className="h-3 w-32 max-w-full" />
                                        <SkeletonBlock className="h-3 w-20" />
                                    </div>

                                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </SkeletonPanel>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                    <SkeletonPanel className="overflow-hidden 2xl:col-span-2">
                        <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                            <SkeletonSectionHeading hasLink />
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
                                                className="px-5 py-3.5"
                                            >
                                                <SkeletonBlock className="h-3 w-16" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#EDF2E9]">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <tr key={index}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />

                                                    <div className="space-y-2">
                                                        <SkeletonBlock className="h-4 w-28" />
                                                        <SkeletonBlock className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <SkeletonBlock className="h-4 w-36" />
                                            </td>

                                            <td className="px-5 py-4">
                                                <SkeletonBlock className="h-4 w-12" />
                                            </td>

                                            <td className="px-5 py-4">
                                                <SkeletonBlock className="h-4 w-20" />
                                            </td>

                                            <td className="px-5 py-4">
                                                <SkeletonBlock className="h-6 w-20 rounded-full" />
                                            </td>

                                            <td className="px-5 py-4">
                                                <SkeletonBlock className="h-4 w-20" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                            <SkeletonBlock className="h-8 w-40" />
                        </div>
                    </SkeletonPanel>

                    <SkeletonPanel className="p-5 sm:p-6">
                        <SkeletonSectionHeading />

                        <div className="mt-5 space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <SkeletonBlock className="h-4 w-32 max-w-full" />
                                        <SkeletonBlock className="h-3 w-40 max-w-full" />
                                    </div>

                                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] p-4">
                            <div className="flex items-start gap-3">
                                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonBlock className="h-4 w-36 max-w-full" />
                                    <SkeletonBlock className="h-3 w-full" />
                                    <SkeletonBlock className="h-3 w-4/5" />
                                    <SkeletonBlock className="mt-3 h-4 w-28" />
                                </div>
                            </div>
                        </div>
                    </SkeletonPanel>
                </section>

                <SkeletonPanel className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                            <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />

                            <div className="min-w-0 flex-1 space-y-2">
                                <SkeletonBlock className="h-4 w-52 max-w-full" />
                                <SkeletonBlock className="h-4 w-80 max-w-full" />
                            </div>
                        </div>

                        <SkeletonBlock className="h-12 w-full rounded-xl sm:w-36" />
                    </div>
                </SkeletonPanel>

                <div className="flex justify-center pb-2">
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
            </div>
        </main>
    );
}