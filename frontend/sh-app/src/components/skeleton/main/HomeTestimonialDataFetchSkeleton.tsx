"use client";

export default function HomeTestimonialDataFetchSkeleton() {
    return (
        <div
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            aria-label="Loading testimonials"
            aria-busy="true"
        >
            {[1, 2, 3].map((item) => (
                <article
                    key={item}
                    className="flex min-w-0 flex-col rounded-[1.75rem] border border-[#E5EDE3] bg-[#FFFCF6] p-6 sm:p-8"
                >
                    {/* Card header */}
                    <div className="flex items-center justify-between">
                        <div className="h-12 w-12 animate-pulse rounded-2xl bg-[#E5EDE3]" />

                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                    key={star}
                                    className="h-3.5 w-3.5 animate-pulse rounded-full bg-[#E9E2D2]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Testimonial content */}
                    <div className="mt-7 flex-1 space-y-3">
                        <div className="h-3 w-full animate-pulse rounded-full bg-[#E5EDE3]" />
                        <div className="h-3 w-[94%] animate-pulse rounded-full bg-[#E5EDE3]" />
                        <div className="h-3 w-[88%] animate-pulse rounded-full bg-[#E5EDE3]" />
                        <div className="h-3 w-[70%] animate-pulse rounded-full bg-[#E5EDE3]" />
                    </div>

                    {/* Author information */}
                    <div className="mt-8 flex items-center gap-3 border-t border-[#E5EDE3] pt-5">
                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#E1EBDD]" />

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-3.5 w-32 animate-pulse rounded-full bg-[#DDE8D7]" />
                            <div className="h-3 w-24 animate-pulse rounded-full bg-[#E8EEE4]" />
                        </div>

                        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[#E5EDE3]" />
                    </div>
                </article>
            ))}
        </div>
    );
}