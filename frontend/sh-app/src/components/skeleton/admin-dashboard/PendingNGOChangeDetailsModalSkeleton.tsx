"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
        />
    );
}

function ComparisonFieldSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-3 border-b border-[#EDF2E9] py-4 last:border-b-0 sm:grid-cols-2">
            <div className="min-w-0 space-y-3">
                <SkeletonBlock className="h-3 w-36" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-4/5" />
            </div>

            <div className="min-w-0 rounded-xl p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <SkeletonBlock className="h-3 w-20" />
                    <SkeletonBlock className="h-6 w-20 rounded-full" />
                </div>

                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="mt-2 h-4 w-3/4" />
            </div>
        </div>
    );
}

function ImageComparisonSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
                <SkeletonBlock className="mb-2 h-3 w-28" />
                <SkeletonBlock className="aspect-video w-full rounded-xl" />
            </div>

            <div className="min-w-0">
                <SkeletonBlock className="mb-2 h-3 w-28" />
                <SkeletonBlock className="aspect-video w-full rounded-xl" />
            </div>
        </div>
    );
}

export default function PendingNGOChangeDetailsModalSkeleton() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
            <section
                role="dialog"
                aria-modal="true"
                aria-label="Loading NGO profile change details"
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                {/* Header */}
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <SkeletonBlock className="h-7 w-28 rounded-full" />
                            <SkeletonBlock className="h-7 w-24 rounded-full" />
                        </div>

                        <SkeletonBlock className="mt-4 h-7 w-64 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-full max-w-md" />
                    </div>

                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
                </header>

                {/* Body */}
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-7">
                    {/* Request information */}
                    <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <SkeletonBlock className="h-5 w-44" />

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl bg-[#FAFCF8] p-3"
                                >
                                    <SkeletonBlock className="h-3 w-24" />
                                    <SkeletonBlock className="mt-3 h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comparison */}
                    <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <SkeletonBlock className="h-5 w-52" />
                        <SkeletonBlock className="mt-2 h-3 w-full max-w-lg" />

                        <div className="mt-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <SkeletonBlock className="h-4 w-28" />
                                <SkeletonBlock className="h-6 w-20 rounded-full" />
                            </div>

                            <ImageComparisonSkeleton />
                        </div>

                        <div className="mt-5 border-t border-[#EDF2E9]">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <ComparisonFieldSkeleton key={index} />
                            ))}
                        </div>
                    </section>

                    {/* Review notice */}
                    <div className="rounded-xl border border-gray-200 bg-gray-100 p-4">
                        <SkeletonBlock className="h-4 w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-4/5" />
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex shrink-0 justify-end border-t border-[#E5EDE3] bg-white px-5 py-4 sm:px-7">
                    <SkeletonBlock className="h-10 w-24 rounded-xl" />
                </footer>
            </section>
        </div>
    );
}