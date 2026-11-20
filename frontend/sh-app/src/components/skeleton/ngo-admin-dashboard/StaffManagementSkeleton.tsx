function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-lg bg-[#E5F2E1] ${className}`} />
    );
}

function StaffCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <SkeletonBlock className="h-14 w-14 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-3/4" />
                    <SkeletonBlock className="h-3 w-1/2" />
                    <SkeletonBlock className="h-3 w-4/5" />
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1EB] pt-4">
                <SkeletonBlock className="h-9 w-28 rounded-lg" />

                <div className="flex gap-2">
                    <SkeletonBlock className="h-9 w-24 rounded-lg" />
                    <SkeletonBlock className="h-9 w-20 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export default function StaffManagementSkeleton() {
    return (
        <div className="min-h-screen bg-[#FFFCF6]">
            <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-3">
                            <SkeletonBlock className="h-7 w-64 sm:w-80" />
                            <SkeletonBlock className="h-4 w-full max-w-lg" />
                            <SkeletonBlock className="h-4 w-3/4 max-w-md" />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <SkeletonBlock className="h-11 w-36 rounded-xl" />
                            <SkeletonBlock className="h-11 w-36 rounded-xl" />
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <SkeletonBlock className="h-4 w-24" />
                                <SkeletonBlock className="h-10 w-10 rounded-xl" />
                            </div>

                            <SkeletonBlock className="mt-5 h-8 w-16" />
                            <SkeletonBlock className="mt-3 h-3 w-32" />
                        </div>
                    ))}
                </section>

                <section className="rounded-2xl border border-[#E8EDE5] bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <SkeletonBlock className="h-11 flex-1 rounded-xl" />
                        <SkeletonBlock className="h-11 w-full rounded-xl sm:w-44" />
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <StaffCardSkeleton key={index} />
                    ))}
                </section>
            </div>
        </div>
    );
}