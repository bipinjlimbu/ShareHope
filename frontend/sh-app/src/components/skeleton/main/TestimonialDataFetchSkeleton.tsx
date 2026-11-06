type TestimonialDataFetchSkeletonProps = {
    count?: number;
};

export default function TestimonialDataFetchSkeleton({
    count = 6,
}: TestimonialDataFetchSkeletonProps) {
    return (
        <div
            className="grid animate-pulse gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Loading testimonials"
            role="status"
        >
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex h-full min-h-[350px] flex-col rounded-3xl border border-[#E5EDE3] bg-white p-6 shadow-sm sm:p-7"
                >
                    {/* Avatar and rating */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="h-11 w-11 rounded-2xl bg-[#E5F2E1]" />

                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                                <div
                                    key={starIndex}
                                    className="h-3 w-3 rounded-sm bg-[#F1E8D5]"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quote mark */}
                    <div className="mb-4 h-8 w-8 rounded-lg bg-[#EAF4E6]" />

                    {/* Quote lines */}
                    <div className="flex-1 space-y-3">
                        <div className="h-3 w-full rounded bg-[#E9EEE6]" />
                        <div className="h-3 w-full rounded bg-[#E9EEE6]" />
                        <div className="h-3 w-[92%] rounded bg-[#E9EEE6]" />
                        <div className="h-3 w-[78%] rounded bg-[#E9EEE6]" />
                    </div>

                    {/* Divider */}
                    <div className="my-6 h-px bg-[#EAF0E7]" />

                    {/* User details */}
                    <div className="flex items-end justify-between gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 rounded bg-[#E5EDE3]" />
                            <div className="h-3 w-24 rounded bg-[#E5F2E1]" />
                            <div className="h-3 w-28 rounded bg-[#EDF1EA]" />
                        </div>

                        <div className="h-7 w-20 rounded-lg bg-[#EDF5EA]" />
                    </div>
                </div>
            ))}

            <span className="sr-only">Loading testimonials...</span>
        </div>
    );
}
