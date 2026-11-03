export default function CampaignsLoading() {
    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 flex flex-col items-center">
                    <div className="h-9 w-40 animate-pulse rounded-full bg-[#E5EDE3]" />
                    <div className="mt-6 h-10 w-72 max-w-full animate-pulse rounded-lg bg-[#E5EDE3] sm:h-12 sm:w-[480px]" />
                    <div className="mt-3 h-7 w-64 max-w-full animate-pulse rounded-lg bg-[#E5EDE3]" />
                    <div className="mt-5 h-4 w-full max-w-xl animate-pulse rounded bg-[#E5EDE3]" />
                    <div className="mt-2 h-4 w-4/5 max-w-lg animate-pulse rounded bg-[#E5EDE3]" />
                </header>

                <div className="mx-auto mb-10 max-w-3xl">
                    <div className="h-12 animate-pulse rounded-2xl bg-[#E5EDE3]" />

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="h-11 animate-pulse rounded-xl bg-[#E5EDE3]" />
                        <div className="h-11 animate-pulse rounded-xl bg-[#E5EDE3]" />
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="space-y-2">
                        <div className="h-6 w-48 animate-pulse rounded bg-[#E5EDE3]" />
                        <div className="h-4 w-64 animate-pulse rounded bg-[#E5EDE3]" />
                    </div>
                    <div className="h-8 w-28 animate-pulse rounded-full bg-[#E5EDE3]" />
                </div>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <article
                            key={index}
                            className="overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white"
                        >
                            <div className="h-56 animate-pulse bg-[#E5EDE3] sm:h-64" />

                            <div className="space-y-4 p-5 sm:p-7">
                                <div className="h-4 w-2/5 animate-pulse rounded bg-[#E5EDE3]" />
                                <div className="h-7 w-4/5 animate-pulse rounded bg-[#E5EDE3]" />

                                <div className="h-24 w-full animate-pulse rounded-xl bg-[#E5EDE3]" />

                                <div className="space-y-2">
                                    <div className="h-4 w-full animate-pulse rounded bg-[#E5EDE3]" />
                                    <div className="h-2 w-full animate-pulse rounded-full bg-[#E5EDE3]" />
                                    <div className="h-3 w-2/5 animate-pulse rounded bg-[#E5EDE3]" />
                                </div>

                                <div className="h-16 w-full animate-pulse rounded-xl bg-[#E5EDE3]" />

                                <div className="flex items-center gap-3 border-t border-[#EDF2E9] pt-4">
                                    <div className="h-9 w-9 animate-pulse rounded-full bg-[#E5EDE3]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-20 animate-pulse rounded bg-[#E5EDE3]" />
                                        <div className="h-4 w-36 animate-pulse rounded bg-[#E5EDE3]" />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}