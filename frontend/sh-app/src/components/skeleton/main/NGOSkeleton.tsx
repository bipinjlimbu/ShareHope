export default function NGOSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 text-center">
                    <div className="mx-auto h-9 w-44 rounded-full bg-[#E5EDE3]" />

                    <div className="mx-auto mt-5 h-10 w-full max-w-xl rounded-lg bg-[#E1E9DC] sm:h-12" />

                    <div className="mx-auto mt-3 h-10 w-full max-w-md rounded-lg bg-[#E1E9DC] sm:h-12" />

                    <div className="mx-auto mt-5 h-4 w-full max-w-2xl rounded bg-[#E5EDE3]" />
                    <div className="mx-auto mt-2 h-4 w-3/4 max-w-lg rounded bg-[#E5EDE3]" />
                </header>

                <div className="mx-auto mb-8 max-w-2xl">
                    <div className="h-12 rounded-2xl border border-[#E5EDE3] bg-white" />
                    <div className="mx-auto mt-3 h-4 w-32 rounded bg-[#E5EDE3]" />
                </div>

                <section
                    aria-label="Loading organizations"
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <article
                            key={index}
                            className="flex min-w-0 flex-col rounded-3xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-[68px] w-[68px] shrink-0 rounded-2xl bg-[#E5EDE3]" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-6 w-24 rounded-full bg-[#E5F2E1]" />
                                    <div className="mt-3 h-5 w-full rounded bg-[#E5EDE3]" />
                                    <div className="mt-2 h-4 w-3/4 rounded bg-[#E5EDE3]" />
                                </div>
                            </div>

                            <div className="mt-5 min-h-[2.75rem] space-y-2">
                                <div className="h-4 w-full rounded bg-[#E5EDE3]" />
                                <div className="h-4 w-4/5 rounded bg-[#E5EDE3]" />
                            </div>

                            <div className="mt-5 space-y-3 border-t border-[#EDF2E9] pt-4">
                                <div className="flex items-start gap-2.5">
                                    <div className="mt-0.5 h-[17px] w-[17px] shrink-0 rounded bg-[#DDE8D8]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-full rounded bg-[#E5EDE3]" />
                                        <div className="h-4 w-3/4 rounded bg-[#E5EDE3]" />
                                    </div>
                                </div>

                                <div className="h-4 w-4/5 rounded bg-[#E5EDE3]" />
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}