import TestimonialDataFetchSkeleton from "@/components/skeleton/main/TestimonialDataFetchSkeleton";

export default function TestimonialsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6]">
            {/* Hero skeleton */}
            <section className="border-b border-[#E5EDE3]">
                <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
                    <div className="h-4 w-28 rounded bg-[#E5EDE3]" />

                    <div className="mx-auto mt-16 max-w-3xl text-center">
                        <div className="mx-auto h-8 w-40 rounded-full bg-[#E5F2E1]" />

                        <div className="mx-auto mt-7 h-12 max-w-xl rounded-xl bg-[#E5EDE3] sm:h-16" />
                        <div className="mx-auto mt-3 h-12 max-w-md rounded-xl bg-[#E5EDE3] sm:h-16" />

                        <div className="mx-auto mt-7 h-4 max-w-xl rounded bg-[#E9EEE6]" />
                        <div className="mx-auto mt-3 h-4 max-w-md rounded bg-[#E9EEE6]" />

                        <div className="mt-9 flex justify-center gap-3">
                            <div className="h-12 w-36 rounded-xl bg-[#DDEBDD]" />
                            <div className="h-12 w-36 rounded-xl bg-[#E5EDE3]" />
                        </div>
                    </div>

                    <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-[#E5EDE3] bg-white p-5"
                            >
                                <div className="mx-auto h-10 w-10 rounded-xl bg-[#E5F2E1]" />
                                <div className="mx-auto mt-4 h-3 w-28 rounded bg-[#E5EDE3]" />
                                <div className="mx-auto mt-2 h-3 w-36 rounded bg-[#EDF1EA]" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials section skeleton */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div className="mb-10">
                    <div className="h-3 w-48 rounded bg-[#E5F2E1]" />
                    <div className="mt-4 h-9 max-w-md rounded-lg bg-[#E5EDE3]" />
                    <div className="mt-4 h-4 max-w-xl rounded bg-[#E9EEE6]" />
                </div>

                <div className="mb-8 h-16 rounded-2xl border border-[#E5EDE3] bg-white" />

                <TestimonialDataFetchSkeleton />
            </section>

            {/* CTA skeleton */}
            <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
                <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#E5EDE3] px-6 py-16 text-center">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-[#D5E7D2]" />
                    <div className="mx-auto mt-6 h-9 max-w-md rounded-lg bg-[#D5E7D2]" />
                    <div className="mx-auto mt-4 h-4 max-w-lg rounded bg-[#D5E7D2]" />
                    <div className="mx-auto mt-8 h-12 w-40 rounded-xl bg-[#D5E7D2]" />
                </div>
            </section>
        </main>
    );
}
