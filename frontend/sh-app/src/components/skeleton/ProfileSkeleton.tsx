export default function ProfileSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-10 sm:px-8 sm:py-14">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <div className="h-4 w-28 rounded bg-[#DDE9D9]" />
                    <div className="mt-3 h-10 w-56 rounded-lg bg-[#DDE9D9] sm:h-11 sm:w-64" />
                    <div className="mt-4 h-4 w-72 max-w-full rounded bg-[#E6EDE4]" />
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full border-4 border-[#F0F6ED] bg-[#E4F1E4]" />
                            <div className="mt-5 h-5 w-36 rounded bg-[#DDE9D9]" />
                            <div className="mt-2 h-4 w-24 rounded bg-[#E6EDE4]" />
                            <div className="mt-5 h-7 w-32 rounded-full bg-[#E4F1E4]" />
                        </div>

                        <div className="my-6 border-t border-[#E6EDE4]" />

                        <div className="space-y-3">
                            <div className="h-11 w-full rounded-xl bg-[#E4F1E4]" />
                            <div className="h-11 w-full rounded-xl bg-[#F3E8E7]" />
                        </div>

                        <div className="mx-auto mt-5 h-3 w-48 max-w-full rounded bg-[#E6EDE4]" />
                    </aside>

                    <section className="min-w-0 rounded-3xl border border-[#E6EDE4] bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="h-6 w-48 max-w-full rounded bg-[#DDE9D9]" />
                                <div className="mt-3 h-4 w-64 max-w-full rounded bg-[#E6EDE4]" />
                            </div>
                            <div className="h-10 w-10 shrink-0 rounded-xl border border-[#E6EDE4] bg-[#F0F6ED]" />
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-[#E6EDE4] bg-white p-4 sm:p-5"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F0F6ED]" />
                                    <div className="min-w-0 flex-1 pt-1">
                                        <div className="h-3 w-24 max-w-full rounded bg-[#E6EDE4]" />
                                        <div className="mt-3 h-4 w-32 max-w-full rounded bg-[#DDE9D9]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-[#E6EDE4] bg-[#F7F9F4] p-4 sm:p-5">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-white" />
                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-32 rounded bg-[#DDE9D9]" />
                                    <div className="mt-3 h-4 w-full rounded bg-[#E6EDE4]" />
                                    <div className="mt-2 h-4 w-4/5 rounded bg-[#E6EDE4]" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mx-auto mt-6 h-3 w-56 max-w-full rounded bg-[#E6EDE4]" />
            </div>
        </main>
    );
}