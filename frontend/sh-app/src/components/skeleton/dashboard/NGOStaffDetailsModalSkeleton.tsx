function SkeletonBlock({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-lg bg-[#E5F2E1] ${className}`} />
    );
}

function DetailRowSkeleton() {
    return (
        <div className="rounded-xl border border-[#E5EDE3] bg-[#FFFCF6] p-3.5">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-2 h-4 w-3/4" />
        </div>
    );
}

export default function NGOStaffDetailsModalSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#D8E8D4] bg-white p-5 sm:flex-row sm:items-center">
                <SkeletonBlock className="h-20 w-20 shrink-0 rounded-2xl" />

                <div className="min-w-0 flex-1 space-y-3">
                    <SkeletonBlock className="h-6 w-48 max-w-full" />
                    <SkeletonBlock className="h-4 w-36" />

                    <div className="flex flex-wrap gap-2">
                        <SkeletonBlock className="h-7 w-24 rounded-full" />
                        <SkeletonBlock className="h-7 w-32 rounded-full" />
                        <SkeletonBlock className="h-7 w-28 rounded-full" />
                    </div>
                </div>
            </div>

            <div>
                <SkeletonBlock className="mb-3 h-5 w-48" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <DetailRowSkeleton key={index} />
                    ))}
                </div>
            </div>

            <div>
                <SkeletonBlock className="mb-3 h-5 w-52" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <DetailRowSkeleton key={index} />
                    ))}
                </div>
            </div>

            <div>
                <SkeletonBlock className="mb-3 h-5 w-48" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <DetailRowSkeleton key={index} />
                    ))}
                </div>
            </div>

            <div>
                <SkeletonBlock className="mb-3 h-5 w-56" />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <DetailRowSkeleton key={index} />
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#D8E8D4] bg-[#E5F2E1]/60 p-4">
                <SkeletonBlock className="h-5 w-5 shrink-0 rounded-full" />

                <div className="flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-48 max-w-full" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-4/5" />
                </div>
            </div>
        </div>
    );
}