export default function NGOsDataFetchSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="h-6 w-52 rounded-lg bg-[#E5EDE3] sm:w-64" />

                <div className="h-7 w-28 rounded-full border border-[#D8E8D4] bg-[#F0F7ED]" />
            </div>

            <section
                aria-label="Loading organizations"
                aria-busy="true"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
                {Array.from({ length: 6 }).map((_, index) => (
                    <article
                        key={index}
                        className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white shadow-sm"
                    >
                        <div className="relative h-52 w-full bg-[#E5F2E1] sm:h-56">
                            <div className="absolute left-4 top-4 h-7 w-28 rounded-full border border-[#D8E8D4] bg-white/80" />
                        </div>

                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <div className="space-y-2">
                                <div className="h-6 w-4/5 rounded-md bg-[#E5EDE3]" />
                                <div className="h-3.5 w-3/5 rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="mt-5 grid flex-1 grid-cols-2 gap-4 border-t border-[#EDF2E9] pt-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-4 w-4 shrink-0 rounded bg-[#DDE9D9]" />
                                        <div className="h-3.5 w-12 rounded bg-[#E5EDE3]" />
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="h-3.5 w-full rounded bg-[#EDF2E9]" />
                                        <div className="h-3.5 w-4/5 rounded bg-[#EDF2E9]" />
                                    </div>
                                </div>

                                <div className="min-w-0 border-l border-[#EDF2E9] pl-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-4 w-4 shrink-0 rounded bg-[#DDE9D9]" />
                                        <div className="h-3.5 w-14 rounded bg-[#E5EDE3]" />
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="h-3.5 w-full rounded bg-[#EDF2E9]" />
                                        <div className="h-3.5 w-4/5 rounded bg-[#EDF2E9]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    );
}