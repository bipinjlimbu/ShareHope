export default function NGOSkeleton() {
    return (
        <div className="animate-pulse">
            <section
                aria-label="Loading NGO statistics"
                className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="h-4 w-24 rounded bg-[#E5EDE3]" />
                                <div className="mt-4 h-10 w-20 rounded-lg bg-[#E5EDE3]" />
                            </div>

                            <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                        </div>

                        <div className="mt-4 h-3 w-4/5 rounded bg-[#EDF2E9]" />
                    </div>
                ))}
            </section>

            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="h-12 flex-1 rounded-xl border border-[#DDE7D9] bg-[#FFFCF6]" />

                    <div className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] sm:w-40" />
                </div>
            </section>

            <div className="mb-5">
                <div className="h-6 w-56 rounded bg-[#E5EDE3]" />
                <div className="mt-2 h-4 w-48 rounded bg-[#EDF2E9]" />
            </div>

            <section
                aria-label="Loading NGO cards"
                className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
            >
                {Array.from({ length: 4 }).map((_, index) => (
                    <article
                        key={index}
                        className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 lg:p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-4">
                                <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#E5F2E1]" />

                                <div className="min-w-0 flex-1 pt-1">
                                    <div className="h-5 w-36 max-w-full rounded bg-[#E5EDE3]" />
                                    <div className="mt-3 h-3 w-44 max-w-full rounded bg-[#EDF2E9]" />
                                    <div className="mt-2 h-3 w-20 rounded bg-[#EDF2E9]" />
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">
                                <div className="h-7 w-24 rounded-full bg-[#E5F2E1]" />
                                <div className="h-7 w-20 rounded-full bg-[#EDF2E9]" />
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-full max-w-44 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-28 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-full max-w-40 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-32 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-24 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                <div className="h-4 w-24 rounded bg-[#EDF2E9]" />
                            </div>
                        </div>

                        <div className="my-5 border-t border-[#EDF2E9]" />

                        <div className="h-3 w-44 rounded bg-[#EDF2E9]" />

                        <div className="mt-5 space-y-3">
                            <div className="h-12 w-full rounded-xl bg-[#D8EBD3]" />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-10 rounded-xl border border-[#DDE7D9] bg-[#F8FAF6]" />
                                <div className="h-10 rounded-xl border border-red-100 bg-red-50/50" />
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <div className="mt-8 flex justify-center">
                <div className="h-3 w-96 max-w-full rounded bg-[#EDF2E9]" />
            </div>
        </div>
    );
}