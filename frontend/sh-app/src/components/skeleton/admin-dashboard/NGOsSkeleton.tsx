function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[#E7EDE2] ${className}`}
        />
    );
}

function SkeletonSummaryCard() {
    return (
        <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-3">
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="h-9 w-16" />
                    <SkeletonBlock className="h-3 w-36 max-w-full" />
                </div>
                <SkeletonBlock className="h-11 w-11 rounded-xl" />
            </div>
        </div>
    );
}

function SkeletonNGOCard() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6]">
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />

                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            <SkeletonBlock className="h-6 w-36 max-w-full" />
                            <SkeletonBlock className="h-6 w-20 rounded-full" />
                        </div>
                        <SkeletonBlock className="h-4 w-48 max-w-full" />
                        <SkeletonBlock className="h-3 w-20" />
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <SkeletonBlock className="h-3.5 w-full" />
                    <SkeletonBlock className="h-3.5 w-4/5 max-w-full" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5">
                        <SkeletonBlock className="h-4 w-4 shrink-0" />
                        <SkeletonBlock className="h-4 w-40 max-w-full" />
                    </div>

                    <div className="flex items-center gap-2.5">
                        <SkeletonBlock className="h-4 w-4 shrink-0" />
                        <SkeletonBlock className="h-4 w-28 max-w-full" />
                    </div>

                    <div className="flex items-center gap-2.5 sm:col-span-2">
                        <SkeletonBlock className="h-4 w-4 shrink-0" />
                        <SkeletonBlock className="h-4 w-56 max-w-full" />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-4 border-t border-[#E8EDE4] pt-4">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-4 w-32" />
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-[#E8EDE4] pt-5 sm:flex-row">
                    <SkeletonBlock className="h-11 flex-1 rounded-xl" />
                    <SkeletonBlock className="h-11 sm:w-[120px] rounded-xl" />
                </div>
            </div>

            <div className="border-t border-[#E8EDE4] bg-[#F7F9F3] px-5 py-3 sm:px-6">
                <SkeletonBlock className="h-3.5 w-48 max-w-full" />
            </div>
        </article>
    );
}

export default function NGOSkeleton() {
    return (
        <div className="space-y-7" aria-label="Loading NGO records">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonSummaryCard key={index} />
                ))}
            </section>

            <section className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <SkeletonBlock className="h-6 w-56 max-w-full" />
                        <SkeletonBlock className="h-4 w-40" />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <SkeletonBlock className="h-11 w-full sm:w-[280px]" />
                        <SkeletonBlock className="h-11 w-full sm:w-[150px]" />
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonNGOCard key={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}