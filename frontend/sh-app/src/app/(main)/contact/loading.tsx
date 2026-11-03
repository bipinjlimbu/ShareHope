export default function ContactLoading() {
    return (
        <main className="animate-pulse overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            <section className="border-b border-[#E5EBDD]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                        <div className="mb-7 h-3 w-40 rounded bg-[#E5F2E1]" />

                        <div className="space-y-4">
                            <div className="h-12 w-full max-w-md rounded-lg bg-[#E5F2E1] sm:h-16" />
                            <div className="h-12 w-4/5 max-w-sm rounded-lg bg-[#E5F2E1] sm:h-16" />
                        </div>

                        <div className="mt-8 space-y-3">
                            <div className="h-4 w-full max-w-md rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-5/6 max-w-md rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-3/4 max-w-sm rounded bg-[#E5F2E1]" />
                        </div>

                        <div className="mt-12 flex items-center gap-4">
                            <div className="h-12 w-12 shrink-0 rounded-full bg-[#E5F2E1]" />
                            <div className="space-y-2">
                                <div className="h-4 w-40 rounded bg-[#E5F2E1]" />
                                <div className="h-3 w-48 rounded bg-[#EDF6E9]" />
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[420px] bg-[#DCEBDD] lg:min-h-[620px]">
                        <div className="absolute inset-0 bg-[#14532D]/20" />
                        <div className="absolute bottom-10 left-8 right-8 space-y-5 sm:bottom-16 sm:left-12 sm:right-12 lg:left-16">
                            <div className="h-3 w-64 rounded bg-white/30" />
                            <div className="h-8 w-full max-w-md rounded bg-white/30 sm:h-10" />
                            <div className="h-8 w-4/5 max-w-sm rounded bg-white/30 sm:h-10" />
                            <div className="h-px w-16 bg-white/30" />
                            <div className="h-3 w-32 rounded bg-white/30" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
                    <aside>
                        <div className="h-3 w-28 rounded bg-[#E5F2E1]" />

                        <div className="mt-5 space-y-3">
                            <div className="h-8 w-full max-w-sm rounded bg-[#E5F2E1]" />
                            <div className="h-8 w-4/5 max-w-xs rounded bg-[#E5F2E1]" />
                        </div>

                        <div className="mt-5 space-y-3">
                            <div className="h-4 w-full max-w-sm rounded bg-[#EDF6E9]" />
                            <div className="h-4 w-5/6 max-w-sm rounded bg-[#EDF6E9]" />
                            <div className="h-4 w-3/4 max-w-xs rounded bg-[#EDF6E9]" />
                        </div>

                        <div className="mt-12 space-y-8">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="h-11 w-11 shrink-0 rounded-full bg-[#E5F2E1]" />
                                    <div className="flex-1 space-y-3 pt-1">
                                        <div className="h-3 w-20 rounded bg-[#E5F2E1]" />
                                        <div className="h-4 w-full max-w-[220px] rounded bg-[#EDF6E9]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14 border-l-2 border-[#DCE9D7] pl-5">
                            <div className="h-4 w-36 rounded bg-[#E5F2E1]" />
                            <div className="mt-3 h-4 w-44 rounded bg-[#EDF6E9]" />
                        </div>
                    </aside>

                    <div className="min-h-[480px] border border-[#E4E9DF] bg-white p-6 shadow-[0_12px_50px_rgba(24,59,42,0.04)] sm:p-10 lg:p-12">
                        <div className="h-3 w-32 rounded bg-[#E5F2E1]" />

                        <div className="mt-4 h-8 w-56 rounded bg-[#E5F2E1]" />

                        <div className="mt-4 space-y-2">
                            <div className="h-3 w-full max-w-md rounded bg-[#EDF6E9]" />
                            <div className="h-3 w-4/5 max-w-sm rounded bg-[#EDF6E9]" />
                        </div>

                        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index}>
                                    <div className="mb-3 h-4 w-24 rounded bg-[#E5F2E1]" />
                                    <div className="h-12 w-full bg-[#EDF6E9]" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <div className="mb-3 h-4 w-28 rounded bg-[#E5F2E1]" />
                            <div className="h-36 w-full bg-[#EDF6E9]" />
                        </div>

                        <div className="mt-6 h-12 w-40 bg-[#E5F2E1]" />

                        <div className="mt-5 h-3 w-64 rounded bg-[#EDF6E9]" />
                    </div>
                </div>
            </section>

            <section className="border-t border-[#E5EBDD] bg-[#F3F6EE]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.65fr_1.35fr] lg:px-16 lg:py-24">
                    <div>
                        <div className="h-3 w-36 rounded bg-[#E5F2E1]" />
                        <div className="mt-5 h-9 w-full max-w-sm rounded bg-[#E5F2E1]" />
                        <div className="mt-5 h-4 w-full max-w-xs rounded bg-[#EDF6E9]" />
                    </div>

                    <div className="divide-y divide-[#DCE5D8] border-y border-[#DCE5D8]">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between gap-6 py-7">
                                <div className="flex flex-1 items-center gap-5">
                                    <div className="h-6 w-6 shrink-0 rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-full max-w-md rounded bg-[#E5F2E1]" />
                                </div>
                                <div className="h-8 w-8 shrink-0 rounded-full bg-[#E5F2E1]" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#164B2D] px-6 py-16 text-center sm:px-10">
                <div className="mx-auto max-w-2xl">
                    <div className="mx-auto h-3 w-36 rounded bg-white/20" />
                    <div className="mx-auto mt-5 h-9 w-full max-w-xl rounded bg-white/20 sm:h-11" />
                    <div className="mx-auto mt-3 h-9 w-4/5 max-w-md rounded bg-white/20 sm:h-11" />
                    <div className="mx-auto mt-8 h-12 w-48 bg-white/20" />
                </div>
            </section>
        </main>
    );
}
