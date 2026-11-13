export default function TestimonialDetailsModalSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* User Header */}
            <section className="flex items-center gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5">
                <div className="h-16 w-16 shrink-0 rounded-full bg-[#E5F2E1]" />

                <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-5 w-48 max-w-full rounded bg-[#E5F2E1]" />
                    <div className="h-3 w-32 rounded bg-[#EDF2E9]" />
                    <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                </div>
            </section>

            {/* Testimonial Content */}
            <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="h-5 w-36 rounded bg-[#E5F2E1]" />
                    <div className="h-7 w-24 rounded-full bg-[#EDF2E9]" />
                </div>

                <div className="mt-6 space-y-3">
                    <div className="h-4 w-full rounded bg-[#EDF2E9]" />
                    <div className="h-4 w-full rounded bg-[#EDF2E9]" />
                    <div className="h-4 w-5/6 rounded bg-[#EDF2E9]" />
                    <div className="h-4 w-2/3 rounded bg-[#EDF2E9]" />
                </div>

                <div className="mt-6 h-3 w-40 rounded bg-[#EDF2E9]" />
            </section>

            {/* User Information */}
            <section>
                <div className="mb-4 h-5 w-44 rounded bg-[#E5F2E1]" />

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white p-4"
                        >
                            <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                            <div className="mt-3 h-4 w-36 max-w-full rounded bg-[#E5F2E1]" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
