export default function HelpLoading() {
    return (
        <main className="animate-pulse overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            {/* Hero skeleton */}
            <section className="border-b border-[#E6EDE2]">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
                    <div className="h-3 w-48 rounded bg-[#E5EBDD]" />

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.65fr] lg:items-end lg:gap-20">
                        <div className="space-y-4">
                            <div className="h-12 w-64 max-w-full rounded-lg bg-[#E5EBDD] sm:h-16 sm:w-96" />
                            <div className="h-12 w-56 max-w-full rounded-lg bg-[#E5EBDD] sm:h-16 sm:w-80" />
                            <div className="h-12 w-40 max-w-full rounded-lg bg-[#E5EBDD] sm:h-16 sm:w-64" />
                        </div>

                        <div className="max-w-md space-y-4 pb-2 lg:pb-3">
                            <div className="h-4 w-full rounded bg-[#E5EBDD]" />
                            <div className="h-4 w-full rounded bg-[#E5EBDD]" />
                            <div className="h-4 w-4/5 rounded bg-[#E5EBDD]" />
                            <div className="mt-7 h-4 w-48 rounded bg-[#E5EBDD]" />
                        </div>
                    </div>

                    <div className="mt-14 grid gap-3 sm:grid-cols-[1.4fr_0.6fr] sm:gap-5 lg:mt-20">
                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#E5F0E1] p-7 sm:min-h-[350px] sm:p-10">
                            <div className="h-12 w-12 rounded-2xl bg-white/80" />

                            <div className="space-y-4">
                                <div className="h-3 w-32 rounded bg-[#C9DCC5]" />
                                <div className="h-8 w-full max-w-md rounded bg-[#D3E3CF]" />
                                <div className="h-4 w-full max-w-sm rounded bg-[#D3E3CF]" />
                                <div className="h-4 w-4/5 max-w-sm rounded bg-[#D3E3CF]" />
                            </div>
                        </div>

                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#14532D] p-7 sm:min-h-[350px] sm:p-9">
                            <div className="h-12 w-12 rounded-2xl bg-white/15" />

                            <div className="space-y-4">
                                <div className="h-3 w-36 rounded bg-white/20" />
                                <div className="h-8 w-4/5 rounded bg-white/20" />
                                <div className="h-4 w-full rounded bg-white/15" />
                                <div className="h-4 w-3/4 rounded bg-white/15" />
                                <div className="h-4 w-28 rounded bg-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Categories skeleton */}
            <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="h-3 w-40 rounded bg-[#E5EBDD]" />
                    <div className="mt-4 h-9 w-80 max-w-full rounded bg-[#E5EBDD]" />
                    <div className="mt-4 h-4 w-full max-w-lg rounded bg-[#EDF2E9]" />

                    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex min-h-[285px] flex-col rounded-[1.5rem] border border-[#E5EDE2] bg-[#FFFCF6] p-7 sm:p-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-8 rounded bg-[#E5EBDD]" />
                                    <div className="h-12 w-12 rounded-2xl bg-[#EAF3E6]" />
                                </div>

                                <div className="mt-8 h-6 w-36 rounded bg-[#E5EBDD]" />
                                <div className="mt-4 h-4 w-full rounded bg-[#EDF2E9]" />
                                <div className="mt-3 h-4 w-full rounded bg-[#EDF2E9]" />
                                <div className="mt-3 h-4 w-3/4 rounded bg-[#EDF2E9]" />

                                <div className="mt-auto h-4 w-36 rounded bg-[#E5EBDD]" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ skeleton */}
            <section className="border-y border-[#E5EDE3] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div>
                        <div className="h-3 w-44 rounded bg-[#E5EBDD]" />
                        <div className="mt-5 h-9 w-64 max-w-full rounded bg-[#E5EBDD]" />
                        <div className="mt-5 h-4 w-full rounded bg-[#EDF2E9]" />
                        <div className="mt-3 h-4 w-full rounded bg-[#EDF2E9]" />
                        <div className="mt-3 h-4 w-4/5 rounded bg-[#EDF2E9]" />

                        <div className="mt-8 rounded-2xl border border-[#E3EAE0] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#EAF3E6]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-[#E5EBDD]" />
                                    <div className="h-3 w-40 rounded bg-[#EDF2E9]" />
                                </div>
                            </div>

                            <div className="mt-5 h-4 w-32 rounded bg-[#E5EBDD]" />
                        </div>
                    </div>

                    <div className="space-y-10">
                        {[1, 2, 3, 4].map((group) => (
                            <div key={group}>
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-3 w-6 rounded bg-[#E5EBDD]" />
                                    <div className="h-5 w-40 rounded bg-[#E5EBDD]" />
                                </div>

                                <div className="divide-y divide-[#E5EDE2] border-y border-[#E5EDE2]">
                                    {[1, 2, 3].map((question) => (
                                        <div
                                            key={question}
                                            className="flex items-center justify-between gap-5 py-6"
                                        >
                                            <div className="h-4 w-full max-w-md rounded bg-[#EDF2E9]" />
                                            <div className="h-8 w-8 shrink-0 rounded-full bg-[#EAF3E6]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact section skeleton */}
            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid min-h-[280px] gap-10 rounded-[1.75rem] bg-[#14532D] px-7 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-16">
                        <div className="space-y-5">
                            <div className="h-3 w-48 rounded bg-white/20" />
                            <div className="h-9 w-full max-w-xl rounded bg-white/20 sm:h-11" />
                            <div className="h-4 w-full max-w-lg rounded bg-white/15" />
                            <div className="h-4 w-4/5 max-w-md rounded bg-white/15" />
                        </div>

                        <div className="h-12 w-44 rounded-xl bg-white/20" />
                    </div>

                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#E3EAE0] pt-6 sm:flex-row sm:items-center">
                        <div className="h-3 w-56 rounded bg-[#E5EBDD]" />
                        <div className="h-3 w-48 rounded bg-[#E5EBDD]" />
                    </div>
                </div>
            </section>
        </main>
    );
}
