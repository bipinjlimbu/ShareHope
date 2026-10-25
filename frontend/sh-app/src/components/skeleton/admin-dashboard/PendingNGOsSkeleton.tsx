import {
    Building2,
    CalendarDays,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    Users,
} from "lucide-react";

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

function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="h-4 w-36" />
                    <SkeletonBlock className="mt-3 h-9 w-16" />
                    <SkeletonBlock className="mt-2 h-3 w-44 max-w-full" />
                </div>

                <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl" />
            </div>
        </div>
    );
}

function ApplicationCardSkeleton() {
    return (
        <article className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6]">
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <SkeletonBlock className="h-16 w-16 shrink-0 rounded-2xl" />

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <SkeletonBlock className="h-6 w-40 max-w-full" />
                            <SkeletonBlock className="h-7 w-20 rounded-full" />
                        </div>

                        <SkeletonBlock className="mt-3 h-4 w-52 max-w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-20" />
                    </div>
                </div>

                <div className="mt-5 space-y-2">
                    <SkeletonBlock className="h-3.5 w-full" />
                    <SkeletonBlock className="h-3.5 w-4/5 max-w-full" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5">
                        <Mail
                            size={16}
                            className="shrink-0 text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-4 w-36 max-w-full" />
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Phone
                            size={16}
                            className="shrink-0 text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-4 w-28 max-w-full" />
                    </div>

                    <div className="flex items-center gap-2.5 sm:col-span-2">
                        <MapPin
                            size={16}
                            className="shrink-0 text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-4 w-3/4 max-w-full" />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-[#E8EDE4] pt-4">
                    <div className="flex items-center gap-2">
                        <FileText
                            size={15}
                            className="text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-3.5 w-20" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Users
                            size={15}
                            className="text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-3.5 w-16" />
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays
                            size={15}
                            className="text-[#B6C8B1]"
                        />
                        <SkeletonBlock className="h-3.5 w-28" />
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#E8EDE4] pt-5 sm:grid-cols-3">
                    <SkeletonBlock className="h-11 rounded-xl" />
                    <SkeletonBlock className="h-11 rounded-xl" />
                    <SkeletonBlock className="h-11 rounded-xl" />
                </div>
            </div>

            <div className="border-t border-[#E8EDE4] bg-[#F7F9F3] px-5 py-3 sm:px-6">
                <SkeletonBlock className="h-3.5 w-48 max-w-full" />
            </div>
        </article>
    );
}

export default function PendingNGOsSkeleton() {
    return (
        <div
            aria-label="Loading pending NGO applications"
            aria-busy="true"
            className="mx-auto max-w-[1600px] space-y-7 pb-8"
        >
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <SkeletonBlock className="mb-5 h-4 w-36" />
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="mt-3 h-9 w-80 max-w-full" />
                    <SkeletonBlock className="mt-3 h-4 w-full max-w-2xl" />
                    <SkeletonBlock className="mt-2 h-4 w-3/4 max-w-xl" />
                </div>

                <SkeletonBlock className="h-12 w-full rounded-xl sm:w-32" />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
                <SummaryCardSkeleton />
            </section>

            <section className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <SkeletonBlock className="h-6 w-64 max-w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-36" />
                    </div>

                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            size={17}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A2B49D]"
                        />
                        <SkeletonBlock className="h-12 w-full rounded-xl" />
                    </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                    {Array.from({ length: 4 }, (_, index) => (
                        <ApplicationCardSkeleton key={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}