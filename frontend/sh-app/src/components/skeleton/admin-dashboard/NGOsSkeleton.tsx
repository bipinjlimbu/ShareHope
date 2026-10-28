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

function StatCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-28 max-w-full" />
                    <SkeletonBlock className="mt-3 h-10 w-20 rounded-xl sm:h-11" />
                </div>

                <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
            </div>

            <SkeletonBlock className="mt-4 h-3 w-40 max-w-full" />
        </div>
    );
}

function NGOCardSkeleton() {
    return (
        <article className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                    <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />

                    <div className="min-w-0 flex-1 pt-0.5">
                        <SkeletonBlock className="h-5 w-40 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-36 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-20 max-w-full" />
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                    <SkeletonBlock className="h-7 w-20 rounded-full" />
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex min-w-0 items-start gap-2"
                    >
                        <SkeletonBlock className="mt-0.5 h-4 w-4 shrink-0 rounded" />

                        <SkeletonBlock
                            className={`h-4 max-w-full ${index % 2 === 0 ? "w-36" : "w-28"
                                }`}
                        />
                    </div>
                ))}
            </div>

            <div className="my-5 border-t border-[#EDF2E9]" />

            <div className="flex items-center gap-2">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-3 w-28 max-w-[50%]" />
            </div>

            <div className="mt-5 space-y-3">
                <SkeletonBlock className="h-11 w-full rounded-xl" />

                <div className="grid grid-cols-2 gap-3">
                    <SkeletonBlock className="h-10 w-full rounded-xl" />
                    <SkeletonBlock className="h-10 w-full rounded-xl border border-red-100 bg-red-50/50" />
                </div>
            </div>
        </article>
    );
}

export default function NGOsSkeleton() {
    return (
        <main
            aria-label="Loading NGO management"
            aria-busy="true"
            className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5"
        >
            <div className="mx-auto w-full max-w-[1600px] space-y-0">
                {/* Page header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <SkeletonBlock className="h-9 w-64 max-w-full sm:h-11 sm:w-80" />

                        {/* Single-line NGO Management description */}
                        <SkeletonBlock className="mt-2 h-4 w-80 max-w-full sm:w-[420px]" />
                    </div>

                    <div className="flex items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:self-auto">
                        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                        <div>
                            <SkeletonBlock className="h-6 w-14" />
                            <SkeletonBlock className="mt-2 h-3 w-24" />
                        </div>
                    </div>
                </header>

                {/* Statistics */}
                <section
                    aria-label="Loading NGO statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <StatCardSkeleton key={index} />
                    ))}
                </section>

                {/* Search and filters */}
                <section
                    aria-label="Loading NGO search and filters"
                    className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5"
                >
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <SkeletonBlock className="h-12 w-full flex-1 rounded-xl" />

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <SkeletonBlock className="h-12 w-full rounded-xl sm:w-40" />
                        </div>
                    </div>
                </section>

                {/* Registered organizations heading */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0">
                        <SkeletonBlock className="h-6 w-64 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-56 max-w-full" />
                    </div>
                </div>

                {/* NGO cards */}
                <section
                    aria-label="Loading registered NGOs"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <NGOCardSkeleton key={index} />
                    ))}
                </section>

                {/* Footer placeholder */}
                <div className="mt-8 flex justify-center">
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
            </div>
        </main>
    );
}
