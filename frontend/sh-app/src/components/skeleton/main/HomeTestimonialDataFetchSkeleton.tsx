export default function HomeTestimonialDataFetchSkeleton() {
    return (
        <div
            aria-label="Loading testimonials"
            aria-busy="true"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <article
                    key={index}
                    className="flex min-w-0 flex-col rounded-3xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-7"
                >
                    {/* Card Header */}
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#E5F2E1]" />

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-3.5 w-32 animate-pulse rounded-md bg-[#E5EDE3]" />
                            <div className="h-3 w-24 animate-pulse rounded-md bg-[#EDF2E9]" />
                        </div>
                    </div>

                    {/* Rating / Admin Voice */}
                    <div className="mt-6 flex items-center gap-1.5">
                        {index === 0 ? (
                            <div className="flex animate-pulse items-center gap-2 rounded-full border border-[#E5EDE3] bg-[#F0F7ED] px-3.5 py-2">
                                <div className="h-6 w-6 rounded-full bg-[#D8E8D4]" />
                                <div className="h-3 w-24 rounded-md bg-[#D8E8D4]" />
                            </div>
                        ) : (
                            Array.from({ length: 5 }).map((_, starIndex) => (
                                <div
                                    key={starIndex}
                                    className="h-3.5 w-3.5 animate-pulse rounded-sm bg-[#F0E6CC]"
                                />
                            ))
                        )}
                    </div>

                    {/* Quote */}
                    <div className="mt-4 flex-1">
                        <div className="h-8 w-7 animate-pulse rounded-md bg-[#E5F2E1]" />

                        <div className="mt-3 space-y-2.5">
                            <div className="h-3 w-full animate-pulse rounded-md bg-[#EDF2E9]" />
                            <div className="h-3 w-full animate-pulse rounded-md bg-[#EDF2E9]" />
                            <div className="h-3 w-5/6 animate-pulse rounded-md bg-[#EDF2E9]" />
                            <div className="h-3 w-2/3 animate-pulse rounded-md bg-[#EDF2E9]" />
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 border-t border-[#EDF2E9] pt-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3.5 w-3.5 animate-pulse rounded-sm bg-[#DDE7D9]" />
                                <div className="h-3 w-20 animate-pulse rounded-md bg-[#EDF2E9]" />
                            </div>

                            <div className="h-6 w-16 animate-pulse rounded-full bg-[#F0F7ED]" />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}