export default function TermsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6]">
            {/* Hero Skeleton */}
            <section className="border-b border-[#E5EDE3]">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <div className="mb-12 h-4 w-28 rounded bg-[#E5F2E1]" />

                    <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <div className="h-8 w-36 rounded-full bg-[#E5F2E1]" />

                            <div className="mt-7 space-y-3">
                                <div className="h-10 w-full max-w-xl rounded-lg bg-[#E5F2E1]" />
                                <div className="h-10 w-4/5 max-w-lg rounded-lg bg-[#E5F2E1]" />
                            </div>

                            <div className="mt-7 space-y-2">
                                <div className="h-4 w-full max-w-xl rounded bg-[#EDF6E9]" />
                                <div className="h-4 w-5/6 max-w-lg rounded bg-[#EDF6E9]" />
                                <div className="h-4 w-2/3 max-w-md rounded bg-[#EDF6E9]" />
                            </div>

                            <div className="mt-9 flex flex-wrap gap-4">
                                <div className="h-12 w-40 rounded-full bg-[#DCE9D8]" />
                                <div className="h-12 w-36 rounded-full bg-[#E5F2E1]" />
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] bg-[#E5F2E1] p-4">
                            <div className="min-h-[300px] rounded-[1.5rem] bg-[#DCE9D8] p-8 sm:p-10">
                                <div className="h-14 w-14 rounded-2xl bg-white/60" />
                                <div className="mt-10 h-3 w-36 rounded bg-white/60" />
                                <div className="mt-5 space-y-3">
                                    <div className="h-8 w-full rounded bg-white/60" />
                                    <div className="h-8 w-4/5 rounded bg-white/60" />
                                </div>
                                <div className="mt-6 h-4 w-full rounded bg-white/50" />
                                <div className="mt-3 h-4 w-3/4 rounded bg-white/50" />
                                <div className="mt-10 border-t border-white/30 pt-6">
                                    <div className="h-4 w-3/4 rounded bg-white/60" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights Skeleton */}
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
                <div className="grid gap-5 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-7"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-[#E5F2E1]" />
                            <div className="mt-5 h-5 w-40 rounded bg-[#E5F2E1]" />
                            <div className="mt-4 space-y-2">
                                <div className="h-3 w-full rounded bg-[#EDF6E9]" />
                                <div className="h-3 w-4/5 rounded bg-[#EDF6E9]" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Terms Content Skeleton */}
            <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
                <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
                    {/* Sidebar */}
                    <aside>
                        <div className="rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6">
                            <div className="h-3 w-28 rounded bg-[#E5F2E1]" />

                            <div className="mt-6 space-y-5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div className="h-3 w-5 rounded bg-[#E5F2E1]" />
                                        <div
                                            className={`h-3 rounded bg-[#EDF6E9] ${item % 3 === 0
                                                    ? "w-28"
                                                    : item % 2 === 0
                                                        ? "w-36"
                                                        : "w-32"
                                                }`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] bg-[#EAF2E5] p-6">
                            <div className="h-4 w-32 rounded bg-[#DCE9D8]" />
                            <div className="mt-4 h-3 w-full rounded bg-[#DCE9D8]" />
                            <div className="mt-2 h-3 w-4/5 rounded bg-[#DCE9D8]" />
                            <div className="mt-5 h-4 w-24 rounded bg-[#DCE9D8]" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="min-w-0">
                        <div className="mb-9 rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-8">
                            <div className="h-3 w-36 rounded bg-[#E5F2E1]" />
                            <div className="mt-5 h-8 w-64 max-w-full rounded bg-[#E5F2E1]" />
                            <div className="mt-5 space-y-2">
                                <div className="h-3 w-full rounded bg-[#EDF6E9]" />
                                <div className="h-3 w-5/6 rounded bg-[#EDF6E9]" />
                                <div className="h-3 w-3/4 rounded bg-[#EDF6E9]" />
                            </div>
                        </div>

                        <div className="space-y-5">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-8"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                        <div className="min-w-0 flex-1">
                                            <div className="h-5 w-56 max-w-full rounded bg-[#E5F2E1]" />

                                            <div className="mt-5 space-y-3">
                                                <div className="h-3 w-full rounded bg-[#EDF6E9]" />
                                                <div className="h-3 w-11/12 rounded bg-[#EDF6E9]" />
                                                <div className="h-3 w-4/5 rounded bg-[#EDF6E9]" />
                                            </div>

                                            {item % 2 === 0 && (
                                                <div className="mt-4 space-y-3">
                                                    <div className="h-3 w-full rounded bg-[#EDF6E9]" />
                                                    <div className="h-3 w-3/4 rounded bg-[#EDF6E9]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-[1.5rem] border border-[#E5EDE3] bg-[#F2F7EF] p-6 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="h-11 w-11 shrink-0 rounded-xl bg-[#DCE9D8]" />
                                <div className="flex-1">
                                    <div className="h-4 w-44 rounded bg-[#DCE9D8]" />
                                    <div className="mt-4 space-y-2">
                                        <div className="h-3 w-full rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-11/12 rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-4/5 rounded bg-[#E5EDE3]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA Skeleton */}
            <section className="px-5 pb-16 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl rounded-[1.75rem] bg-[#DCE9D8] px-7 py-12 sm:px-12 sm:py-16">
                    <div className="mx-auto h-3 w-36 rounded bg-white/60" />
                    <div className="mx-auto mt-6 h-8 w-full max-w-lg rounded bg-white/60" />
                    <div className="mx-auto mt-3 h-8 w-3/4 max-w-md rounded bg-white/60" />
                    <div className="mx-auto mt-6 h-3 w-full max-w-md rounded bg-white/50" />
                    <div className="mx-auto mt-3 h-3 w-3/4 max-w-sm rounded bg-white/50" />
                    <div className="mx-auto mt-8 h-12 w-44 rounded-full bg-white/70" />
                </div>
            </section>
        </main>
    );
}