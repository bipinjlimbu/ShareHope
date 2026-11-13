export default function TestimonialsSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#FFFCF6] px-3 py-5 sm:px-5 lg:px-6">
            <div className="mx-auto w-full max-w-[1600px] animate-pulse space-y-7">
                {/* Page Header Skeleton */}
                <div className="rounded-2xl border border-[#E5EDE3] bg-white p-6 shadow-sm">
                    <div className="h-8 w-64 rounded-lg bg-[#E5F2E1]" />
                    <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#EDF2E9]" />
                </div>

                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-6"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 w-32 rounded bg-[#EDF2E9]" />
                                    <div className="h-9 w-20 rounded bg-[#E5F2E1]" />
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-[#E5F2E1]" />
                            </div>
                            <div className="mt-5 h-3 w-40 rounded bg-[#EDF2E9]" />
                        </div>
                    ))}
                </div>

                {/* Search Skeleton */}
                <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm">
                    <div className="h-12 w-full rounded-xl bg-[#EDF2E9]" />
                </div>

                {/* List Heading Skeleton */}
                <div className="space-y-2">
                    <div className="h-6 w-56 rounded bg-[#E5F2E1]" />
                    <div className="h-4 w-40 rounded bg-[#EDF2E9]" />
                </div>

                {/* Testimonial Cards Skeleton */}
                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 shrink-0 rounded-full bg-[#E5F2E1]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-[#E5F2E1]" />
                                    <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 rounded-xl border border-[#E8EDE4] bg-[#FAFCF8] p-4">
                                <div className="h-3 w-28 rounded bg-[#E5F2E1]" />
                                <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-2/3 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="mt-5 space-y-3">
                                <div className="h-3 w-40 rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-32 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="mt-7 flex gap-3 border-t border-[#EDF2E9] pt-5">
                                <div className="h-10 flex-1 rounded-xl bg-[#E5F2E1]" />
                                <div className="h-10 flex-1 rounded-xl bg-[#EDF2E9]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
