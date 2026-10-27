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

function SkeletonDetailField({
    wide = false,
}: {
    wide?: boolean;
}) {
    return (
        <div
            className={`min-w-0 rounded-xl border border-[#E8EDE4] bg-white/70 p-4 ${wide ? "sm:col-span-2" : ""
                }`}
        >
            <SkeletonBlock className="h-3 w-28 max-w-full" />
            <SkeletonBlock className="mt-3 h-4 w-40 max-w-full" />
        </div>
    );
}

function SkeletonSection({
    description = true,
    fieldCount = 4,
}: {
    description?: boolean;
    fieldCount?: number;
}) {
    return (
        <section>
            <div className="mb-4 flex items-start gap-3">
                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-2 pt-1">
                    <SkeletonBlock className="h-5 w-48 max-w-full" />
                    {description && (
                        <SkeletonBlock className="h-4 w-64 max-w-full" />
                    )}
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: fieldCount }, (_, index) => (
                    <SkeletonDetailField
                        key={index}
                        wide={fieldCount === 4 && index === fieldCount - 1}
                    />
                ))}
            </div>
        </section>
    );
}

function SkeletonDocumentCard() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#E1E9DC] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-40 max-w-full" />
                    <SkeletonBlock className="h-3 w-52 max-w-full" />
                    <SkeletonBlock className="h-3 w-36 max-w-full" />
                </div>
            </div>

            <SkeletonBlock className="h-10 w-full rounded-xl sm:w-36" />
        </div>
    );
}

function SkeletonMemberCard() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-[#E1E9DC] bg-white/70 p-4 sm:flex-row sm:items-center">
            <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />

            <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-40 max-w-full" />
                <SkeletonBlock className="h-3 w-48 max-w-full" />
                <SkeletonBlock className="h-3 w-56 max-w-full" />
            </div>

            <SkeletonBlock className="h-7 w-24 shrink-0 rounded-full" />
        </div>
    );
}

export default function NGODetailsModalSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading NGO details"
            aria-busy="true"
            className="space-y-7"
        >
            <div className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-3">
                        <SkeletonBlock className="h-3 w-24" />
                        <SkeletonBlock className="h-7 w-28 rounded-full" />
                    </div>

                    <div className="space-y-2">
                        <SkeletonBlock className="h-3 w-20" />
                        <SkeletonBlock className="h-4 w-40 max-w-full" />
                    </div>
                </div>
            </div>

            <SkeletonSection fieldCount={4} />

            <section>
                <div className="mb-4 flex items-start gap-3">
                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                        <SkeletonBlock className="h-5 w-48 max-w-full" />
                        <SkeletonBlock className="h-4 w-64 max-w-full" />
                    </div>
                </div>

                <div className="space-y-3">
                    <SkeletonDocumentCard />
                    <SkeletonDocumentCard />
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-start gap-3">
                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                        <SkeletonBlock className="h-5 w-36 max-w-full" />
                        <SkeletonBlock className="h-4 w-60 max-w-full" />
                    </div>
                </div>

                <div className="space-y-3">
                    <SkeletonMemberCard />
                    <SkeletonMemberCard />
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-start gap-3">
                    <SkeletonBlock className="h-10 w-10 shrink-0 rounded-xl" />

                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                        <SkeletonBlock className="h-5 w-56 max-w-full" />
                        <SkeletonBlock className="h-4 w-72 max-w-full" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                        <SkeletonBlock className="h-3 w-24" />
                        <SkeletonBlock className="mt-3 h-4 w-40 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-36 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-28 max-w-full" />
                    </div>

                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                        <SkeletonBlock className="h-3 w-24" />
                        <SkeletonBlock className="mt-3 h-4 w-40 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-36 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-28 max-w-full" />
                    </div>
                </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
                <SkeletonDetailField />
                <SkeletonDetailField />
            </div>

            <p className="text-center text-sm text-[#718071]">
                Fetching the full NGO record...
            </p>
        </div>
    );
}