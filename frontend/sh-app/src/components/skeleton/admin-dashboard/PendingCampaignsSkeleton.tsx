export default function PendingCampaignsSkeleton() {
    return (
        <main className="min-h-screen w-full animate-pulse bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px]">
                {/* Header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <div className="h-9 w-64 max-w-full rounded-lg bg-[#E5EDE3] sm:h-10 sm:w-80" />

                        <div className="mt-3 h-4 w-full max-w-2xl rounded-md bg-[#EDF2E9]" />
                        <div className="mt-2 h-4 w-4/5 max-w-xl rounded-md bg-[#EDF2E9]" />
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DCEBD7]" />

                        <div>
                            <div className="h-6 w-12 rounded-md bg-[#DCEBD7]" />
                            <div className="mt-2 h-3 w-28 rounded-md bg-[#E5EDE3]" />
                        </div>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="h-4 w-32 rounded-md bg-[#E5EDE3]" />
                                    <div className="mt-4 h-10 w-20 rounded-lg bg-[#DCEBD7]" />
                                </div>

                                <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                            </div>

                            <div className="mt-5 h-3 w-full max-w-xs rounded-md bg-[#EDF2E9]" />
                        </div>
                    ))}
                </section>

                {/* Search and Filter */}
                <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="h-12 flex-1 rounded-xl border border-[#DDE7D9] bg-[#FFFCF6]" />

                        <div className="h-12 rounded-xl border border-[#DDE7D9] bg-white xl:w-64" />
                    </div>
                </section>

                {/* Section Heading */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <div className="h-6 w-52 rounded-md bg-[#DCEBD7]" />
                        <div className="mt-2 h-4 w-64 max-w-full rounded-md bg-[#EDF2E9]" />
                    </div>
                </div>

                {/* Campaign Cards */}
                <section className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6 2xl:gap-7">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <article
                            key={index}
                            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm"
                        >
                            {/* Image and Campaign Information */}
                            <div className="flex min-w-0 items-start gap-4 p-5 pb-0 sm:gap-5 sm:p-6 sm:pb-0">
                                <div className="aspect-video w-32 shrink-0 rounded-xl bg-[#E5F2E1] sm:w-40" />

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="h-7 w-32 rounded-full bg-[#F5EEDB]" />
                                        <div className="h-7 w-24 rounded-full bg-[#EDF2E9]" />
                                    </div>

                                    <div className="mt-4 h-6 w-full max-w-xs rounded-md bg-[#DCEBD7]" />
                                    <div className="mt-2 h-3 w-24 rounded-md bg-[#EDF2E9]" />
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-5 pt-4 sm:p-6 sm:pt-4">
                                {/* Donation Type and NGO */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-9 w-28 rounded-lg bg-[#F1F7ED]" />
                                    <div className="h-9 w-40 max-w-full rounded-lg bg-[#F1F7ED]" />
                                </div>

                                {/* Campaign Goal */}
                                <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                                    <div className="h-3 w-28 rounded-md bg-[#DCEBD7]" />
                                    <div className="mt-3 h-5 w-3/4 max-w-xs rounded-md bg-[#DCEBD7]" />
                                </div>

                                {/* Campaign Dates */}
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {Array.from({ length: 2 }).map((_, dateIndex) => (
                                        <div
                                            key={dateIndex}
                                            className="rounded-xl border border-[#E8EDE4] bg-white p-3"
                                        >
                                            <div className="h-3 w-16 rounded-md bg-[#EDF2E9]" />
                                            <div className="mt-3 h-4 w-28 max-w-full rounded-md bg-[#DCEBD7]" />
                                        </div>
                                    ))}
                                </div>

                                {/* Submission Information and Actions */}
                                <div className="mt-auto pt-5">
                                    <div className="mb-4 flex items-center justify-between gap-3 border-t border-[#EDF2E9] pt-4">
                                        <div className="h-3 w-40 max-w-full rounded-md bg-[#EDF2E9]" />
                                        <div className="h-3 w-20 rounded-md bg-[#EDF2E9]" />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="h-12 w-full rounded-xl bg-[#DCEBD7]" />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="h-12 rounded-xl bg-[#E3F2E6]" />
                                            <div className="h-12 rounded-xl bg-[#FCEBE8]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Footer Text */}
                <div className="mt-8 flex justify-center">
                    <div className="h-3 w-3/4 max-w-lg rounded-md bg-[#EDF2E9]" />
                </div>
            </div>
        </main>
    );
}