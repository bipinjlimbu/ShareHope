export default function AboutLoading() {
    return (
        <main className="animate-pulse overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            <section className="border-b border-[#E6EDE2]">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
                    <div className="h-3 w-48 rounded bg-[#E5F2E1]" />

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.65fr] lg:items-end lg:gap-20">
                        <div className="space-y-4">
                            <div className="h-12 w-full max-w-xl rounded-lg bg-[#E5F2E1] sm:h-16 lg:h-20" />
                            <div className="h-12 w-4/5 max-w-lg rounded-lg bg-[#E5F2E1] sm:h-16 lg:h-20" />
                            <div className="h-12 w-3/5 max-w-md rounded-lg bg-[#E5F2E1] sm:h-16 lg:h-20" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-4 w-full rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-full rounded bg-[#E5F2E1]" />
                            <div className="h-4 w-4/5 rounded bg-[#E5F2E1]" />
                            <div className="mt-7 h-4 w-40 rounded bg-[#E5F2E1]" />
                        </div>
                    </div>

                    <div className="mt-14 grid gap-3 sm:grid-cols-[1.4fr_0.6fr] sm:gap-5 lg:mt-20">
                        <div className="min-h-[270px] rounded-[1.75rem] bg-[#E5F2E1] sm:min-h-[390px]" />
                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#DCEBDD] p-7 sm:min-h-[390px] sm:p-9">
                            <div className="h-12 w-12 rounded-2xl bg-[#C8DEC5]" />
                            <div className="space-y-4">
                                <div className="h-8 w-4/5 rounded bg-[#C8DEC5]" />
                                <div className="h-8 w-3/5 rounded bg-[#C8DEC5]" />
                                <div className="h-3 w-full rounded bg-[#C8DEC5]" />
                                <div className="h-3 w-4/5 rounded bg-[#C8DEC5]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div className="space-y-5">
                        <div className="h-3 w-32 rounded bg-[#E5F2E1]" />
                        <div className="h-8 w-full max-w-sm rounded bg-[#E5F2E1]" />
                        <div className="h-8 w-4/5 max-w-xs rounded bg-[#E5F2E1]" />
                    </div>
                    <div className="space-y-5">
                        <div className="h-6 w-full rounded bg-[#E5F2E1]" />
                        <div className="h-6 w-5/6 rounded bg-[#E5F2E1]" />
                        <div className="h-4 w-full rounded bg-[#EDF6E9]" />
                        <div className="h-4 w-full rounded bg-[#EDF6E9]" />
                        <div className="h-4 w-4/5 rounded bg-[#EDF6E9]" />
                        <div className="mt-8 h-16 w-full rounded bg-[#EDF6E9]" />
                    </div>
                </div>
            </section>

            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 space-y-4">
                        <div className="h-3 w-36 rounded bg-[#E5F2E1]" />
                        <div className="h-9 w-full max-w-lg rounded bg-[#E5F2E1]" />
                    </div>
                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="min-h-[350px] rounded-[1.75rem] bg-[#E5F2E1] p-8 sm:p-11" />
                        <div className="min-h-[350px] rounded-[1.75rem] bg-[#DCEBDD] p-8 sm:p-11" />
                    </div>
                </div>
            </section>

            <section className="border-y border-[#E5EDE3] bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="space-y-4">
                        <div className="h-3 w-36 rounded bg-[#E5F2E1]" />
                        <div className="h-9 w-full max-w-xl rounded bg-[#E5F2E1]" />
                        <div className="h-4 w-full max-w-md rounded bg-[#EDF6E9]" />
                    </div>
                    <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="space-y-5 border-t-2 border-[#DCE9D7] py-7">
                                <div className="h-4 w-10 rounded bg-[#E5F2E1]" />
                                <div className="h-6 w-3/4 rounded bg-[#E5F2E1]" />
                                <div className="h-4 w-full rounded bg-[#EDF6E9]" />
                                <div className="h-4 w-5/6 rounded bg-[#EDF6E9]" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                    <div className="space-y-5">
                        <div className="h-3 w-40 rounded bg-[#E5F2E1]" />
                        <div className="h-9 w-full max-w-sm rounded bg-[#E5F2E1]" />
                        <div className="h-4 w-full rounded bg-[#EDF6E9]" />
                        <div className="h-4 w-5/6 rounded bg-[#EDF6E9]" />
                    </div>
                    <div className="divide-y divide-[#E3EAE0] border-y border-[#E3EAE0]">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="flex gap-5 py-7">
                                <div className="h-4 w-8 rounded bg-[#E5F2E1]" />
                                <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 w-40 rounded bg-[#E5F2E1]" />
                                    <div className="h-4 w-full rounded bg-[#EDF6E9]" />
                                    <div className="h-4 w-4/5 rounded bg-[#EDF6E9]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#EAF2E5] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                        <div className="space-y-5">
                            <div className="h-3 w-48 rounded bg-[#D4E2D0]" />
                            <div className="h-10 w-full max-w-2xl rounded bg-[#D4E2D0] sm:h-14" />
                            <div className="h-4 w-full max-w-xl rounded bg-[#D4E2D0]" />
                            <div className="h-4 w-4/5 max-w-lg rounded bg-[#D4E2D0]" />
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <div className="h-12 w-44 rounded-xl bg-[#C8DEC5]" />
                            <div className="h-12 w-44 rounded-xl bg-[#D4E2D0]" />
                        </div>
                    </div>
                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#D4E2D0] pt-6 sm:flex-row">
                        <div className="h-3 w-48 rounded bg-[#D4E2D0]" />
                        <div className="h-3 w-52 rounded bg-[#D4E2D0]" />
                    </div>
                </div>
            </section>
        </main>
    );
}
