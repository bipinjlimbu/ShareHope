export default function NGODetailsPageSkeleton() {
    return (
        <main className="min-h-screen bg-[#FFFCF6] pb-20">
            <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                <div className="h-10 w-44 animate-pulse rounded-full bg-[#E5F2E1]" />

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
                    <section>
                        {/* NGO identity */}
                        <div className="rounded-3xl border border-[#E5EBDD] bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="h-28 w-28 shrink-0 animate-pulse rounded-3xl bg-[#E5F2E1] sm:h-36 sm:w-36" />

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="h-7 w-24 animate-pulse rounded-full bg-[#E5F2E1]" />
                                        <div className="h-7 w-36 animate-pulse rounded-full bg-[#E5F2E1]" />
                                    </div>

                                    <div className="mt-5 h-9 w-3/4 animate-pulse rounded-xl bg-[#E5F2E1]" />

                                    <div className="mt-4 flex flex-wrap gap-4">
                                        <div className="h-4 w-36 animate-pulse rounded bg-[#E5F2E1]" />
                                        <div className="h-4 w-24 animate-pulse rounded bg-[#E5F2E1]" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 border-t border-[#E5EBDD] pt-6">
                                <div className="h-4 w-52 animate-pulse rounded bg-[#E5F2E1]" />
                                <div className="mt-5 space-y-3">
                                    <div className="h-4 w-full animate-pulse rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-full animate-pulse rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-4/5 animate-pulse rounded bg-[#E5F2E1]" />
                                </div>
                            </div>

                            <div className="mt-7 grid gap-3 border-t border-[#E5EBDD] pt-6 sm:grid-cols-2">
                                <div className="h-14 animate-pulse rounded-2xl bg-[#E5F2E1]" />
                                <div className="h-14 animate-pulse rounded-2xl bg-[#E5F2E1]" />
                            </div>
                        </div>

                        {/* Organization information */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="h-7 w-64 animate-pulse rounded-lg bg-[#E5F2E1]" />

                            <div className="mt-7 grid gap-7 sm:grid-cols-2">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#E5F2E1]" />
                                        <div className="min-w-0 flex-1 space-y-3 pt-1">
                                            <div className="h-3 w-28 animate-pulse rounded bg-[#E5F2E1]" />
                                            <div className="h-4 w-40 max-w-full animate-pulse rounded bg-[#E5F2E1]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Organization administrator */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="h-7 w-72 animate-pulse rounded-lg bg-[#E5F2E1]" />

                            <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-[#FFFCF6] p-5 sm:flex-row sm:items-center">
                                <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-[#E5F2E1]" />

                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-44 animate-pulse rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-28 animate-pulse rounded bg-[#E5F2E1]" />
                                    <div className="h-6 w-36 animate-pulse rounded-full bg-[#E5F2E1]" />
                                </div>
                            </div>

                            <div className="mt-6 h-4 w-52 animate-pulse rounded bg-[#E5F2E1]" />
                        </div>
                    </section>

                    {/* Organization overview */}
                    <aside className="space-y-6 lg:sticky lg:top-8">
                        <div className="overflow-hidden rounded-3xl border border-[#E5EBDD] bg-white shadow-sm">
                            <div className="border-b border-[#E5EBDD] bg-[#EDF6E9] px-6 py-6">
                                <div className="h-4 w-40 animate-pulse rounded bg-[#DCE8D8]" />
                                <div className="mt-4 h-7 w-full animate-pulse rounded bg-[#DCE8D8]" />
                                <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-[#DCE8D8]" />
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {[0, 1].map((item) => (
                                        <div key={item} className="rounded-2xl bg-[#FFFCF6] p-4">
                                            <div className="h-10 w-10 animate-pulse rounded-xl bg-[#E5F2E1]" />
                                            <div className="mt-4 h-7 w-16 animate-pulse rounded bg-[#E5F2E1]" />
                                            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-[#E5F2E1]" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 space-y-6 border-t border-[#E5EBDD] pt-6">
                                    {[0, 1].map((item) => (
                                        <div key={item} className="flex items-start gap-3">
                                            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#E5F2E1]" />
                                            <div className="flex-1 space-y-3 pt-1">
                                                <div className="h-4 w-36 animate-pulse rounded bg-[#E5F2E1]" />
                                                <div className="h-3 w-full animate-pulse rounded bg-[#E5F2E1]" />
                                                <div className="h-3 w-4/5 animate-pulse rounded bg-[#E5F2E1]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-7 h-14 w-full animate-pulse rounded-2xl bg-[#DCE8D8]" />
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#DCE8D8] bg-[#E5F2E1]/60 p-6">
                            <div className="flex items-center gap-3">
                                <div className="h-11 w-11 animate-pulse rounded-xl bg-white" />
                                <div className="h-5 w-40 animate-pulse rounded bg-[#DCE8D8]" />
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="h-3 w-full animate-pulse rounded bg-[#DCE8D8]" />
                                <div className="h-3 w-full animate-pulse rounded bg-[#DCE8D8]" />
                                <div className="h-3 w-4/5 animate-pulse rounded bg-[#DCE8D8]" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}