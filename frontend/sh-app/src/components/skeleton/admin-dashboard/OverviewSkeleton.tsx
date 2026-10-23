function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[#E1E9DC] ${className}`}
        />
    );
}

function SkeletonHeading({
    showLink = false,
}: {
    showLink?: boolean;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="h-3 w-52 max-w-[65vw]" />
            </div>

            {showLink && <SkeletonBlock className="h-4 w-16" />}
        </div>
    );
}

export default function AdminDashboardSkeleton() {
    return (
        <div
            aria-label="Loading admin dashboard"
            aria-busy="true"
            className="mx-auto max-w-[1600px] space-y-7"
        >
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-8 w-64 max-w-[80vw] sm:h-9 sm:w-80" />
                    <SkeletonBlock className="h-4 w-80 max-w-[85vw]" />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#E1E9DC] bg-[#FFFCF6] px-4 py-3">
                    <SkeletonBlock className="h-5 w-5 rounded-md" />
                    <SkeletonBlock className="h-4 w-28" />
                </div>
            </section>

            <section
                aria-label="Loading platform statistics"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
                {Array.from({ length: 4 }, (_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-3">
                                <SkeletonBlock className="h-4 w-28" />
                                <SkeletonBlock className="h-9 w-24" />
                            </div>
                            <SkeletonBlock className="h-12 w-12 rounded-xl" />
                        </div>

                        <SkeletonBlock className="mt-6 h-3 w-40 max-w-full" />
                    </div>
                ))}
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6 xl:col-span-2">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <SkeletonHeading />
                        <div className="space-y-2 rounded-xl bg-[#EDF6E9] p-4">
                            <SkeletonBlock className="h-3 w-32" />
                            <SkeletonBlock className="h-6 w-28" />
                        </div>
                    </div>

                    <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                        {[42, 61, 50, 78, 68, 100].map((height, index) => (
                            <div
                                key={index}
                                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                            >
                                <SkeletonBlock className="mb-2 h-3 w-10 opacity-60" />

                                <div className="flex w-full flex-1 items-end justify-center">
                                    <SkeletonBlock
                                        className="w-full max-w-14 rounded-t-lg"
                                    />
                                    <style>{`
                                        .skeleton-bar-${index} {
                                            height: ${height}%;
                                        }
                                    `}</style>
                                </div>

                                <SkeletonBlock className="mt-3 h-3 w-8" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#E6EDE4] pt-4">
                        <SkeletonBlock className="h-3 w-40" />
                        <SkeletonBlock className="h-3 w-24" />
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                    <SkeletonHeading showLink />

                    <div className="mt-5 flex items-center justify-between rounded-xl bg-[#F4EBD8] p-4">
                        <div className="flex items-center gap-3">
                            <SkeletonBlock className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <SkeletonBlock className="h-4 w-28" />
                                <SkeletonBlock className="h-3 w-32" />
                            </div>
                        </div>
                        <SkeletonBlock className="h-7 w-6" />
                    </div>

                    <div className="mt-4 space-y-2">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-xl p-3"
                            >
                                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonBlock className="h-3.5 w-36 max-w-full" />
                                    <SkeletonBlock className="h-3 w-44 max-w-full" />
                                    <SkeletonBlock className="h-2.5 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] 2xl:col-span-2">
                    <div className="border-b border-[#E6EDE4] px-5 py-5 sm:px-6">
                        <SkeletonHeading showLink />
                    </div>

                    <div className="space-y-0 px-5">
                        {Array.from({ length: 5 }, (_, index) => (
                            <div
                                key={index}
                                className="flex min-w-[680px] items-center gap-5 border-b border-[#E6EDE4] py-4"
                            >
                                <div className="flex w-36 items-center gap-3">
                                    <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
                                    <div className="space-y-2">
                                        <SkeletonBlock className="h-3 w-20" />
                                        <SkeletonBlock className="h-2.5 w-14" />
                                    </div>
                                </div>

                                <SkeletonBlock className="h-3 w-32" />
                                <SkeletonBlock className="h-3 w-12" />
                                <SkeletonBlock className="h-3 w-16" />
                                <SkeletonBlock className="h-5 w-16 rounded-full" />
                                <SkeletonBlock className="h-3 w-20" />
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#E6EDE4] px-5 py-4 sm:px-6">
                        <SkeletonBlock className="h-4 w-40" />
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                    <SkeletonHeading />

                    <div className="mt-5 space-y-2">
                        {Array.from({ length: 4 }, (_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-xl p-3"
                            >
                                <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <SkeletonBlock className="h-3.5 w-28 max-w-full" />
                                    <SkeletonBlock className="h-3 w-36 max-w-full" />
                                </div>
                                <SkeletonBlock className="h-4 w-4" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 rounded-xl border border-[#D7E9D2] bg-[#EDF6E9] p-4">
                        <SkeletonBlock className="h-4 w-36" />
                        <SkeletonBlock className="mt-3 h-3 w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-4/5" />
                        <SkeletonBlock className="mt-4 h-3 w-28" />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
                        <div className="space-y-2">
                            <SkeletonBlock className="h-4 w-48 max-w-full" />
                            <SkeletonBlock className="h-3 w-64 max-w-full" />
                        </div>
                    </div>

                    <SkeletonBlock className="h-10 w-32 rounded-xl" />
                </div>
            </section>

            <div className="flex justify-center">
                <SkeletonBlock className="h-3 w-64 max-w-full" />
            </div>
        </div>
    );
}
