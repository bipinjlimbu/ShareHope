export default function CampaignDetailsPageSkeleton() {
    return (
        <main className="min-h-screen bg-[#FFFCF6] pb-20">
            <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6 sm:px-6 lg:px-8">
                {/* Back navigation */}
                <div className="h-10 w-40 rounded-full bg-[#E5F2E1]" />

                <div className="grid items-start gap-10 pt-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
                    {/* Main content */}
                    <section>
                        <div className="aspect-[16/9] rounded-3xl bg-[#E5F2E1]" />

                        <div className="mt-8 flex gap-3">
                            <div className="h-7 w-24 rounded-full bg-[#E5F2E1]" />
                            <div className="h-7 w-36 rounded-full bg-[#E5F2E1]" />
                        </div>

                        <div className="mt-5 h-10 w-4/5 rounded-lg bg-[#E5F2E1]" />

                        <div className="mt-6 space-y-3">
                            <div className="h-4 w-full rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-full rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-5/6 rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-3/4 rounded bg-[#E5F2E1]" />
                        </div>

                        {/* Timeline */}
                        <div className="mt-10 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="h-6 w-48 rounded bg-[#E5F2E1]" />

                            <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                {[1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="h-11 w-11 rounded-xl bg-[#E5F2E1]" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-20 rounded bg-[#E5F2E1]" />
                                            <div className="h-4 w-36 rounded bg-[#E5F2E1]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NGO information */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="h-6 w-56 rounded bg-[#E5F2E1]" />

                            <div className="mt-6 flex gap-5">
                                <div className="h-20 w-20 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-48 rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-full rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-4/5 rounded bg-[#E5F2E1]" />
                                </div>
                            </div>

                            <div className="mt-7 grid gap-5 border-t border-[#E5EBDD] pt-6 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-[#E5F2E1]" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-20 rounded bg-[#E5F2E1]" />
                                            <div className="h-4 w-32 rounded bg-[#E5F2E1]" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* NGO administrator */}
                            <div className="mt-7 border-t border-[#E5EBDD] pt-6">
                                <div className="h-5 w-44 rounded bg-[#E5F2E1]" />

                                <div className="mt-4 flex items-center gap-4 rounded-2xl bg-[#FFFCF6] p-4">
                                    <div className="h-14 w-14 rounded-full bg-[#E5F2E1]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 rounded bg-[#E5F2E1]" />
                                        <div className="h-3 w-28 rounded bg-[#E5F2E1]" />
                                        <div className="h-5 w-20 rounded-full bg-[#E5F2E1]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Progress sidebar */}
                    <aside>
                        <div className="overflow-hidden rounded-3xl border border-[#E5EBDD] bg-white">
                            <div className="bg-[#EDF6E9] p-6">
                                <div className="h-4 w-32 rounded bg-[#DCE8D8]" />
                                <div className="mt-4 h-9 w-48 rounded bg-[#DCE8D8]" />
                                <div className="mt-3 h-4 w-40 rounded bg-[#DCE8D8]" />
                                <div className="mt-6 h-3 w-full rounded-full bg-white" />
                                <div className="mt-3 h-3 w-full rounded bg-[#DCE8D8]" />
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 rounded-2xl bg-[#E5F2E1]" />
                                    <div className="h-24 rounded-2xl bg-[#E5F2E1]" />
                                </div>

                                <div className="mt-7 h-14 w-full rounded-2xl bg-[#E5F2E1]" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
