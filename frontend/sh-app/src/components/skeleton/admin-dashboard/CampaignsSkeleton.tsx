
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

function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="mt-4 h-10 w-20" />
                </div>

                <SkeletonBlock className="h-12 w-12 rounded-2xl" />
            </div>

            <SkeletonBlock className="mt-5 h-3 w-4/5" />
        </div>
    );
}

function CampaignCardSkeleton() {
    return (
        <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm">
            <div className="flex min-w-0 items-start gap-4 p-5 pb-0 sm:gap-5 sm:p-6 sm:pb-0">
                <SkeletonBlock className="aspect-video w-32 shrink-0 rounded-xl sm:w-40" />

                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                        <SkeletonBlock className="h-7 w-28 rounded-full" />
                        <SkeletonBlock className="h-7 w-24 rounded-full" />
                    </div>

                    <SkeletonBlock className="mt-4 h-6 w-4/5" />
                    <SkeletonBlock className="mt-2 h-3 w-28" />
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-4">
                <div className="flex flex-wrap gap-2">
                    <SkeletonBlock className="h-9 w-28 rounded-lg" />
                    <SkeletonBlock className="h-9 w-36 rounded-lg" />
                </div>

                <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                    <SkeletonBlock className="h-3 w-28" />
                    <SkeletonBlock className="mt-3 h-5 w-3/4" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                        <SkeletonBlock className="h-3 w-16" />
                        <SkeletonBlock className="mt-3 h-4 w-24" />
                    </div>

                    <div className="rounded-xl border border-[#E8EDE4] bg-white p-3">
                        <SkeletonBlock className="h-3 w-16" />
                        <SkeletonBlock className="mt-3 h-4 w-24" />
                    </div>
                </div>

                <div className="mt-auto pt-5">
                    <div className="mb-4 flex items-center justify-between gap-3 border-t border-[#EDF2E9] pt-4">
                        <SkeletonBlock className="h-3 w-36" />
                        <SkeletonBlock className="h-3 w-20" />
                    </div>

                    <div className="space-y-3">
                        <SkeletonBlock className="h-12 w-full rounded-xl" />

                        <div className="grid grid-cols-2 gap-3">
                            <SkeletonBlock className="h-11 rounded-xl" />
                            <SkeletonBlock className="h-11 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function CampaignsSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                {/* Page Header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <SkeletonBlock className="h-9 w-64 max-w-full sm:h-11 sm:w-80" />
                        <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />
                        <SkeletonBlock className="mt-2 h-4 w-4/5 max-w-lg" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                        <div>
                            <SkeletonBlock className="h-6 w-14" />
                            <SkeletonBlock className="mt-2 h-3 w-28" />
                        </div>
                    </div>
                </header>

                {/* Statistics */}
                <section
                    aria-label="Loading campaign statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SummaryCardSkeleton key={index} />
                    ))}
                </section>

                {/* Search and Filters */}
                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <SkeletonBlock className="h-12 w-full flex-1 rounded-xl" />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[420px]">
                            <SkeletonBlock className="h-12 rounded-xl" />
                            <SkeletonBlock className="h-12 rounded-xl" />
                        </div>
                    </div>
                </section>

                {/* Section Heading */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <SkeletonBlock className="h-6 w-52" />
                        <SkeletonBlock className="mt-2 h-4 w-64 max-w-full" />
                    </div>
                </div>

                {/* Campaign Cards */}
                <section
                    aria-label="Loading campaigns"
                    className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <CampaignCardSkeleton key={index} />
                    ))}
                </section>

                {/* Footer Information */}
                <div className="mt-8 flex justify-center">
                    <SkeletonBlock className="h-3 w-80 max-w-full" />
                </div>
            </div>
        </main>
    );
}
