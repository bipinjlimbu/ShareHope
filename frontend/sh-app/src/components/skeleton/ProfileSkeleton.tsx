export default function ProfileSkeleton() {
    return (
        <main
            className="min-h-screen bg-[#FFFCF6] px-5 py-10 sm:px-8 sm:py-14"
            aria-label="Loading profile"
        >
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <div className="h-4 w-28 animate-pulse rounded bg-[#DDE7DC]" />
                    <div className="mt-3 h-10 w-52 max-w-full animate-pulse rounded-lg bg-[#E4F1E4]" />
                    <div className="mt-4 h-4 w-full max-w-lg animate-pulse rounded bg-[#E4F1E4]" />
                </div>

                <section className="overflow-hidden rounded-3xl border border-[#E6EDE4] bg-white shadow-sm">
                    <div className="h-32 animate-pulse bg-[#DDE7DC] sm:h-40" />

                    <div className="px-5 pb-7 sm:px-8 sm:pb-9">
                        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:gap-6">
                            <div className="h-24 w-24 shrink-0 animate-pulse rounded-3xl border-4 border-white bg-[#DDE7DC] sm:h-28 sm:w-28" />

                            <div className="flex-1 pb-1">
                                <div className="h-7 w-44 max-w-full animate-pulse rounded-md bg-[#E4F1E4]" />
                                <div className="mt-3 h-4 w-24 animate-pulse rounded bg-[#E4F1E4]" />
                            </div>
                        </div>

                        <div className="mt-9 border-t border-[#E6EDE4] pt-7">
                            <div className="h-6 w-52 max-w-full animate-pulse rounded-md bg-[#E4F1E4]" />
                            <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-[#E4F1E4]" />

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-[#E6EDE4] bg-white p-4 sm:p-5"
                                    >
                                        <div className="h-3 w-28 animate-pulse rounded bg-[#DDE7DC]" />
                                        <div className="mt-3 h-5 w-40 max-w-full animate-pulse rounded bg-[#E4F1E4]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 rounded-2xl border border-[#DDE7DC] bg-[#F5F8F1] p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#DDE7DC]" />
                                <div className="flex-1">
                                    <div className="h-5 w-32 animate-pulse rounded bg-[#DDE7DC]" />
                                    <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-[#E4F1E4]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}