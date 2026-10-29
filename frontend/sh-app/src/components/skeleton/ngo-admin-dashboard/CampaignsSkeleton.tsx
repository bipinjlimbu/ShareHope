export default function CampaignsSkeleton() {
    return (
        <main className="min-h-screen w-full animate-pulse bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-9 w-48 max-w-full rounded-lg bg-[#DCE7DA] sm:h-10" />
                        <div className="h-4 w-full max-w-2xl rounded bg-[#EDF2EB]" />
                    </div>

                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <div className="flex min-h-[58px] items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-[#D8EBD3]" />

                            <div className="space-y-2">
                                <div className="h-6 w-12 rounded bg-[#DCE7DA]" />
                                <div className="h-3 w-28 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>

                        <div className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-[#DCE7DA] px-5 py-3.5">
                            <div className="h-5 w-5 rounded bg-[#C5D9C1]" />
                            <div className="h-4 w-28 rounded bg-[#C5D9C1]" />
                        </div>
                    </div>
                </header>

                <section
                    aria-label="Loading campaign statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1 space-y-3">
                                    <div className="h-4 w-32 max-w-full rounded bg-[#E5EDE3]" />
                                    <div className="h-10 w-20 rounded bg-[#DCE7DA]" />
                                </div>

                                <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                            </div>

                            <div className="mt-4 h-3 w-4/5 max-w-full rounded bg-[#EDF2EB]" />
                        </div>
                    ))}
                </section>

                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="h-12 min-w-0 flex-1 rounded-xl border border-[#DDE7D9] bg-[#F5F9F2]" />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:w-[440px]">
                            <div className="h-12 rounded-xl border border-[#DDE7D9] bg-[#F5F9F2]" />
                            <div className="h-12 rounded-xl border border-[#DDE7D9] bg-[#F5F9F2]" />
                        </div>
                    </div>
                </section>

                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="space-y-3">
                        <div className="h-7 w-48 rounded bg-[#DCE7DA]" />
                        <div className="h-4 w-64 max-w-full rounded bg-[#EDF2EB]" />
                    </div>
                </div>

                <section
                    aria-label="Loading campaign list"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:grid-cols-3 2xl:gap-7"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <article
                            key={index}
                            className="min-w-0 overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm"
                        >
                            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#EAF3E6] sm:h-52">
                                <div className="h-16 w-16 rounded-2xl bg-[#D8EBD3]" />
                                <div className="absolute left-4 top-4 h-7 w-28 rounded-full bg-[#D5E5D1]" />
                            </div>

                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="h-7 w-32 max-w-[70%] rounded-lg bg-[#E5F2E1]" />
                                    <div className="h-4 w-10 rounded bg-[#EDF2EB]" />
                                </div>

                                <div className="mt-4 h-7 w-4/5 rounded bg-[#DCE7DA]" />

                                <div className="mt-3 space-y-2">
                                    <div className="h-4 w-full rounded bg-[#EDF2EB]" />
                                    <div className="h-4 w-full rounded bg-[#EDF2EB]" />
                                    <div className="h-4 w-3/5 rounded bg-[#EDF2EB]" />
                                </div>

                                <div className="mt-4 flex items-start gap-2">
                                    <div className="h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />
                                    <div className="h-4 w-3/4 rounded bg-[#E5EDE3]" />
                                </div>

                                <div className="mt-4 rounded-xl border border-[#E5EDE3] bg-[#FAFCF8] p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="h-3 w-24 rounded bg-[#E5EDE3]" />
                                            <div className="h-4 w-32 max-w-full rounded bg-[#DCE7DA]" />
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t border-[#E5EDE3] pt-3">
                                        <div className="h-3 w-24 rounded bg-[#E5EDE3]" />
                                        <div className="mt-2 h-4 w-4/5 rounded bg-[#DCE7DA]" />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {Array.from({ length: 2 }).map(
                                        (_, dateIndex) => (
                                            <div
                                                key={dateIndex}
                                                className="flex items-start gap-2"
                                            >
                                                <div className="h-4 w-4 shrink-0 rounded bg-[#D8EBD3]" />

                                                <div className="min-w-0 flex-1 space-y-2">
                                                    <div className="h-3 w-20 rounded bg-[#EDF2EB]" />
                                                    <div className="h-4 w-28 max-w-full rounded bg-[#E5EDE3]" />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="my-5 border-t border-[#EDF2E9]" />

                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-3 w-20 rounded bg-[#EDF2EB]" />
                                        <div className="h-4 w-28 max-w-full rounded bg-[#E5EDE3]" />
                                    </div>

                                    <div className="shrink-0 space-y-2">
                                        <div className="ml-auto h-3 w-20 rounded bg-[#EDF2EB]" />
                                        <div className="ml-auto h-4 w-24 rounded bg-[#E5EDE3]" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <div className="mt-8 flex justify-center">
                    <div className="h-3 w-80 max-w-full rounded bg-[#EDF2EB]" />
                </div>
            </div>
        </main>
    );
}
