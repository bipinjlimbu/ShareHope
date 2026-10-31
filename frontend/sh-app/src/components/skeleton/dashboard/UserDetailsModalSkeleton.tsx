"use client";

function SkeletonBlock({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            aria-hidden="true"
            className={`animate-pulse rounded-lg bg-[#E5EDE3] ${className}`}
        />
    );
}

function SkeletonDetailCard() {
    return (
        <div className="min-w-0 rounded-xl border border-[#E5EDE3] bg-[#FFFCF6] p-3.5">
            <SkeletonBlock className="h-3 w-24 max-w-full" />
            <SkeletonBlock className="mt-2 h-4 w-36 max-w-full" />
        </div>
    );
}

function SkeletonSection({
    titleWidth = "w-40",
    itemCount = 4,
}: {
    titleWidth?: string;
    itemCount?: number;
}) {
    return (
        <section>
            <div className="mb-3 flex items-center gap-2">
                <SkeletonBlock className="h-[17px] w-[17px] rounded-md" />
                <SkeletonBlock className={`h-4 max-w-full ${titleWidth}`} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: itemCount }, (_, index) => (
                    <SkeletonDetailCard key={index} />
                ))}
            </div>
        </section>
    );
}

export default function UserDetailsModalSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading user details"
            aria-busy="true"
            className="space-y-5"
        >
            <div className="flex flex-col gap-4 rounded-2xl border border-[#D8E8D4] bg-white p-5 sm:flex-row sm:items-center">
                <SkeletonBlock className="h-20 w-20 shrink-0 rounded-2xl" />

                <div className="min-w-0 flex-1 space-y-3">
                    <SkeletonBlock className="h-6 w-52 max-w-full" />
                    <SkeletonBlock className="h-4 w-36 max-w-full" />

                    <div className="flex flex-wrap gap-2 pt-1">
                        <SkeletonBlock className="h-7 w-32 rounded-full" />
                        <SkeletonBlock className="h-7 w-20 rounded-full" />
                        <SkeletonBlock className="h-7 w-28 rounded-full" />
                    </div>
                </div>
            </div>

            <SkeletonSection titleWidth="w-44" itemCount={6} />

            <SkeletonSection titleWidth="w-40" itemCount={6} />

            <SkeletonSection titleWidth="w-36" itemCount={2} />

            <div className="flex items-start gap-3 rounded-xl border border-[#D8E8D4] bg-[#E5F2E1]/60 p-4">
                <SkeletonBlock className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-md" />

                <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-44 max-w-full" />
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-4/5 max-w-full" />
                </div>
            </div>

            <p className="text-center text-sm text-[#647568]">
                Loading user information...
            </p>
        </div>
    );
}