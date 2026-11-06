import TestimonialDataFetchSkeleton from "@/components/skeleton/main/TestimonialDataFetchSkeleton";

export default function TestimonialsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-12 text-[#183B2A] sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                {/* Page Header Skeleton */}
                <header className="mb-12 text-center">
                    <div className="mx-auto h-9 w-40 rounded-full bg-[#E5F2E1]" />

                    <div className="mx-auto mt-6 h-10 max-w-lg rounded-xl bg-[#E5EDE3] sm:h-12" />
                    <div className="mx-auto mt-3 h-10 max-w-md rounded-xl bg-[#E5EDE3] sm:h-12" />

                    <div className="mx-auto mt-5 h-4 max-w-xl rounded bg-[#E9EEE6]" />
                    <div className="mx-auto mt-3 h-4 max-w-md rounded bg-[#E9EEE6]" />

                    <div className="mt-7 flex justify-center gap-3">
                        <div className="h-11 w-40 rounded-xl bg-[#DDEBDD]" />
                        <div className="h-11 w-32 rounded-xl bg-[#E5EDE3]" />
                    </div>
                </header>

                {/* Community Highlights Skeleton */}
                <section className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 text-center"
                        >
                            <div className="mx-auto h-11 w-11 rounded-xl bg-[#E5F2E1]" />
                            <div className="mx-auto mt-4 h-3 w-32 rounded bg-[#E5EDE3]" />
                            <div className="mx-auto mt-2 h-3 w-40 rounded bg-[#EDF1EA]" />
                        </div>
                    ))}
                </section>

                {/* Testimonials Heading Skeleton */}
                <section>
                    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="w-full">
                            <div className="h-3 w-48 rounded bg-[#E5F2E1]" />
                            <div className="mt-3 h-8 max-w-md rounded-lg bg-[#E5EDE3]" />
                            <div className="mt-3 h-4 max-w-xl rounded bg-[#E9EEE6]" />
                        </div>

                        <div className="h-9 w-28 shrink-0 rounded-full bg-[#E5F2E1]" />
                    </div>

                    {/* Demo Notice Skeleton */}
                    <div className="mb-7 h-16 rounded-2xl border border-[#E5EDE3] bg-[#F7F4E9]" />

                    {/* Search and Filters Skeleton */}
                    <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="h-12 w-full rounded-xl bg-[#E9EEE6] lg:max-w-sm" />

                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-10 w-20 rounded-xl bg-[#E5EDE3]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Testimonial Cards Skeleton */}
                    <TestimonialDataFetchSkeleton count={6} />
                </section>

                {/* Bottom CTA Skeleton */}
                <section className="mt-12 rounded-3xl bg-[#E5EDE3] px-6 py-12 text-center sm:px-10 sm:py-14">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-[#D5E7D2]" />
                    <div className="mx-auto mt-6 h-8 max-w-sm rounded-lg bg-[#D5E7D2]" />
                    <div className="mx-auto mt-3 h-4 max-w-md rounded bg-[#D5E7D2]" />
                    <div className="mx-auto mt-7 h-11 w-40 rounded-xl bg-[#D5E7D2]" />
                </section>
            </div>
        </main>
    );
}
