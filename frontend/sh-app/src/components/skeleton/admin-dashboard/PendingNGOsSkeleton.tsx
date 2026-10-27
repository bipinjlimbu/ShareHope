"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-lg bg-[#E8EFE5] ${className}`}
        />
    );
}

function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-36 max-w-full" />
                    <SkeletonBlock className="mt-4 h-10 w-24" />
                </div>

                <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
            </div>

            <SkeletonBlock className="mt-4 h-3 w-56 max-w-full" />
        </div>
    );
}

function NGOApplicationCardSkeleton() {
    return (
        <article className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 lg:p-7">
            <div className="flex items-start gap-4">
                <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />

                <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <SkeletonBlock className="h-6 w-40 max-w-full" />
                        <SkeletonBlock className="h-6 w-20 rounded-full" />
                    </div>

                    <SkeletonBlock className="mt-3 h-4 w-52 max-w-full" />
                    <SkeletonBlock className="mt-2 h-3 w-24" />
                </div>
            </div>

            <div className="mt-5 space-y-2">
                <SkeletonBlock className="h-3.5 w-full" />
                <SkeletonBlock className="h-3.5 w-11/12 max-w-full" />
                <SkeletonBlock className="h-3.5 w-2/3 max-w-full" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                    <SkeletonBlock className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-4/5 max-w-full" />
                </div>

                <div className="flex items-start gap-2">
                    <SkeletonBlock className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-3/5 max-w-full" />
                </div>

                <div className="flex items-start gap-2 sm:col-span-2">
                    <SkeletonBlock className="mt-0.5 h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-full" />
                </div>
            </div>

            <div className="my-5 border-t border-[#EDF2E9]" />

            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-24" />
                </div>

                <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-20" />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                    <SkeletonBlock className="h-4 w-4 shrink-0 rounded-md" />
                    <SkeletonBlock className="h-4 w-44 max-w-full" />
                </div>
            </div>

            <div className="my-5 border-t border-[#EDF2E9]" />

            <div className="flex items-center gap-2">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-3 w-32 max-w-full" />
            </div>

            <div className="mt-5 space-y-3">
                <SkeletonBlock className="h-12 w-full rounded-xl" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <SkeletonBlock className="h-12 w-full rounded-xl" />
                    <SkeletonBlock className="h-12 w-full rounded-xl" />
                </div>
            </div>
        </article>
    );
}

export default function PendingNGOsSkeleton() {
    return (
        <main
            aria-label="Loading pending NGO applications"
            aria-busy="true"
            className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5"
        >
            <div className="mx-auto w-full max-w-[1600px]">
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <SkeletonBlock className="h-9 w-80 max-w-full sm:h-11" />

                        <div className="mt-3 space-y-2">
                            <SkeletonBlock className="h-4 w-full max-w-2xl" />
                            <SkeletonBlock className="h-4 w-4/5 max-w-xl" />
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5 sm:self-auto">
                        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                        <div>
                            <SkeletonBlock className="h-6 w-14" />
                            <SkeletonBlock className="mt-2 h-3 w-24" />
                        </div>
                    </div>
                </header>

                <section
                    aria-label="Loading NGO statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                >
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                    <SummaryCardSkeleton />
                </section>

                <section
                    aria-label="Loading search"
                    className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5"
                >
                    <SkeletonBlock className="h-12 w-full rounded-xl" />
                </section>

                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:max-w-md">
                        <SkeletonBlock className="h-7 w-72 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-52 max-w-full" />
                    </div>
                </div>

                <section
                    aria-label="Loading NGO applications"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                >
                    <NGOApplicationCardSkeleton />
                    <NGOApplicationCardSkeleton />
                    <NGOApplicationCardSkeleton />
                    <NGOApplicationCardSkeleton />
                </section>

                <div className="mt-8 flex flex-col items-center gap-2 pb-2">
                    <SkeletonBlock className="h-3 w-80 max-w-full" />
                    <SkeletonBlock className="h-3 w-56 max-w-full" />
                </div>
            </div>
        </main>
    );
}