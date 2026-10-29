"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-lg bg-[#E7EDE2] ${className}`}
        />
    );
}

function SkeletonSection({
    fieldCount = 2,
    fullWidthLast = false,
}: {
    fieldCount?: number;
    fullWidthLast?: boolean;
}) {
    return (
        <section>
            <div className="mb-4 flex items-start gap-3">
                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="flex-1 space-y-2 pt-1">
                    <SkeletonBlock className="h-4 w-44 max-w-full" />
                    <SkeletonBlock className="h-3 w-64 max-w-full" />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: fieldCount }).map((_, index) => {
                    const isFullWidth =
                        fullWidthLast && index === fieldCount - 1;

                    return (
                        <div
                            key={index}
                            className={`rounded-xl border border-[#E8EDE4] bg-white/70 p-4 ${isFullWidth ? "sm:col-span-2" : ""
                                }`}
                        >
                            <SkeletonBlock className="h-3 w-24 max-w-full" />
                            <SkeletonBlock className="mt-3 h-4 w-40 max-w-full" />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default function CampaignDetailsModalSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading campaign details"
            className="space-y-7"
        >
            <span className="sr-only">Loading campaign details...</span>

            <section className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <SkeletonBlock className="h-3 w-28" />
                        <SkeletonBlock className="mt-3 h-7 w-24 rounded-full" />
                    </div>

                    <SkeletonBlock className="h-4 w-40 max-w-full" />
                </div>
            </section>

            <SkeletonBlock className="h-48 w-full rounded-2xl sm:h-60" />

            <SkeletonSection fieldCount={4} fullWidthLast />

            <SkeletonSection fieldCount={4} />

            <SkeletonSection fieldCount={3} fullWidthLast />

            <SkeletonSection fieldCount={5} fullWidthLast />

            <section>
                <div className="mb-4 flex items-start gap-3">
                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="flex-1 space-y-2 pt-1">
                        <SkeletonBlock className="h-4 w-48 max-w-full" />
                        <SkeletonBlock className="h-3 w-72 max-w-full" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <SkeletonBlock className="h-3 w-24" />
                            <SkeletonBlock className="mt-3 h-4 w-36 max-w-full" />
                            <SkeletonBlock className="mt-2 h-3 w-44 max-w-full" />
                            <SkeletonBlock className="mt-2 h-3 w-28 max-w-full" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}