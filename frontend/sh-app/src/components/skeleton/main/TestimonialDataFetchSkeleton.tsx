type TestimonialDataFetchSkeletonProps = {
    count?: number;
};

export default function TestimonialDataFetchSkeleton({
    count = 6,
}: TestimonialDataFetchSkeletonProps) {
    return (
        <div
            className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            role="status"
            aria-label="Loading testimonials"
        >
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex min-w-0 min-h-[350px] flex-col rounded-3xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-7"
                >
                    {/* User Details */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />

                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-3 w-32 max-w-full rounded bg-[#E5EDE3]" />
                                <div className="h-3 w-24 max-w-full rounded bg-[#EAF1E7]" />
                            </div>
                        </div>

                        {index === 0 && (
                            <div className="h-6 w-16 shrink-0 rounded-full bg-[#E5F2E1]" />
                        )}
                    </div>

                    {/* Decorative Stars */}
                    <div className="mt-6 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <div
                                key={star}
                                className="h-3.5 w-3.5 rounded-sm bg-[#F1E8D5]"
                            />
                        ))}
                    </div>

                    {/* Quote */}
                    <div className="mt-5">
                        <div className="mb-3 h-8 w-8 rounded-lg bg-[#E5F2E1]" />

                        <div className="space-y-3">
                            <div className="h-3 w-full rounded bg-[#E9EEE6]" />
                            <div className="h-3 w-full rounded bg-[#E9EEE6]" />
                            <div className="h-3 w-[92%] rounded bg-[#E9EEE6]" />
                            <div className="h-3 w-[78%] rounded bg-[#E9EEE6]" />
                            <div className="h-3 w-[55%] rounded bg-[#E9EEE6]" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto border-t border-[#EDF2E9] pt-4">
                        {index % 2 === 0 && (
                            <div className="mb-3 h-3 w-36 rounded bg-[#E5EDE3]" />
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-1 items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-[#E5F2E1]" />
                                <div className="h-3 w-28 rounded bg-[#EDF1EA]" />
                            </div>

                            <div className="h-7 w-20 rounded-full bg-[#E5F2E1]" />
                        </div>
                    </div>
                </div>
            ))}

            <span className="sr-only">Loading testimonials...</span>
        </div>
    );
}
