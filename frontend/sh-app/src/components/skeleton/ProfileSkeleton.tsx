export default function ProfileSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-10 sm:px-8 sm:py-14">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 space-y-3">
                    <div className="h-4 w-28 rounded bg-[#DDE7DC]" />
                    <div className="h-10 w-56 rounded-xl bg-[#DDE7DC]" />
                    <div className="h-4 w-72 max-w-full rounded bg-[#E6EDE4]" />
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="rounded-3xl border border-[#E6EDE4] bg-white p-6 shadow-sm sm:p-7">
                        <div className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-[#E6EDE4]" />
                            <div className="mt-4 h-6 w-40 rounded-lg bg-[#E6EDE4]" />
                            <div className="mt-2 h-4 w-24 rounded bg-[#EDF2E9]" />
                            <div className="mt-4 h-7 w-36 rounded-full bg-[#EDF2E9]" />
                        </div>

                        <div className="my-6 border-t border-[#E6EDE4]" />

                        <div className="space-y-3">
                            <div className="h-12 rounded-xl bg-[#DDE7DC]" />
                            <div className="h-12 rounded-xl bg-[#F1DCDC]" />
                            <div className="mx-auto mt-4 h-3 w-48 rounded bg-[#EDF2E9]" />
                        </div>
                    </aside>

                    <section className="rounded-3xl border border-[#E6EDE4] bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="h-6 w-48 rounded bg-[#DDE7DC]" />
                                <div className="h-4 w-64 max-w-full rounded bg-[#EDF2E9]" />
                            </div>
                            <div className="hidden h-11 w-11 rounded-xl bg-[#EDF2E9] sm:block" />
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex gap-3.5 rounded-2xl border border-[#E6EDE4] p-4 sm:p-5"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#EDF2E9]" />
                                    <div className="min-w-0 flex-1 space-y-3 pt-1">
                                        <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                                        <div className="h-4 w-full max-w-40 rounded bg-[#DDE7DC]" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-3 rounded-2xl border border-[#E6EDE4] bg-[#F7F9F4] p-4 sm:p-5">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-white" />
                            <div className="flex-1 space-y-3 py-1">
                                <div className="h-4 w-36 rounded bg-[#DDE7DC]" />
                                <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                <div className="h-3 w-4/5 rounded bg-[#EDF2E9]" />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mx-auto mt-6 h-3 w-56 rounded bg-[#EDF2E9]" />
            </div>
        </main>
    );
}