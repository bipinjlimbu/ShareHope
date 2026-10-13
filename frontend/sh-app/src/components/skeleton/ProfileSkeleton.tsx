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

                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 animate-pulse rounded-full bg-[#DDE7DC]" />
                            <div className="mt-4 h-6 w-36 max-w-full animate-pulse rounded-md bg-[#E4F1E4]" />
                            <div className="mt-2 h-4 w-20 animate-pulse rounded bg-[#E4F1E4]" />
                            <div className="mt-4 h-7 w-32 animate-pulse rounded-full bg-[#E4F1E4]" />
                        </div>

                        <div className="my-6 border-t border-[#E6EDE4]" />

                        <div className="space-y-3">
                            <div className="h-11 w-full animate-pulse rounded-xl bg-[#D5E8D5]" />
                            <div className="h-11 w-full animate-pulse rounded-xl bg-[#F4E7E7]" />
                        </div>

                        <div className="mx-auto mt-4 h-3 w-48 max-w-full animate-pulse rounded bg-[#E4F1E4]" />
                    </aside>

                    <section className="min-w-0 rounded-3xl border border-[#E6EDE4] bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="h-6 w-52 max-w-full animate-pulse rounded-md bg-[#E4F1E4]" />
                                <div className="mt-3 h-4 w-full max-w-xs animate-pulse rounded bg-[#E4F1E4]" />
                            </div>

                            <div className="hidden h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#E4F1E4] sm:block" />
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-[#E6EDE4] bg-white p-4 sm:p-5"
                                >
                                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#E4F1E4]" />
                                    <div className="min-w-0 flex-1 pt-1">
                                        <div className="h-3 w-24 animate-pulse rounded bg-[#DDE7DC]" />
                                        <div className="mt-3 h-4 w-32 max-w-full animate-pulse rounded bg-[#E4F1E4]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-[#E6EDE4] bg-[#F7F9F4] p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#DDE7DC]" />
                                <div className="flex-1">
                                    <div className="h-4 w-32 animate-pulse rounded bg-[#DDE7DC]" />
                                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#E4F1E4]" />
                                    <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-[#E4F1E4]" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}