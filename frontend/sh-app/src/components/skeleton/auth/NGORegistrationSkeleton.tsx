export default function NGORegistrationSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-4 py-8 sm:px-6 lg:py-12">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 h-5 w-44 rounded bg-slate-200" />

                <div className="grid overflow-hidden rounded-3xl border border-green-950/10 bg-white shadow-xl shadow-green-950/5 lg:grid-cols-[0.9fr_1.1fr]">
                    <aside className="flex flex-col justify-between bg-[#14532D] p-7 sm:p-10 lg:p-12">
                        <div>
                            <div className="h-12 w-36 rounded-lg bg-white/20" />

                            <div className="mt-14">
                                <div className="h-14 w-14 rounded-2xl bg-white/15" />
                                <div className="mt-6 h-9 max-w-sm rounded bg-white/20" />
                                <div className="mt-3 h-9 max-w-xs rounded bg-white/20" />
                                <div className="mt-6 h-4 max-w-md rounded bg-white/15" />
                                <div className="mt-3 h-4 max-w-sm rounded bg-white/15" />
                                <div className="mt-3 h-4 max-w-xs rounded bg-white/15" />
                            </div>
                        </div>

                        <div className="mt-12 rounded-2xl border border-white/15 bg-white/10 p-5">
                            <div className="h-5 w-48 rounded bg-white/20" />
                            <div className="mt-3 h-4 w-full rounded bg-white/15" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-white/15" />
                        </div>
                    </aside>

                    <section className="p-6 sm:p-9 lg:p-12">
                        <div className="h-4 w-44 rounded bg-slate-200" />
                        <div className="mt-3 h-8 w-64 max-w-full rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-full max-w-sm rounded bg-slate-100" />

                        <div className="mt-8 space-y-6">
                            <div>
                                <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={index === 0 ? "sm:col-span-2" : ""}
                                        >
                                            <div className="mb-2 h-4 w-32 rounded bg-slate-200" />
                                            <div className="h-12 rounded-xl border border-slate-100 bg-slate-50" />
                                        </div>
                                    ))}

                                    <div className="sm:col-span-2">
                                        <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
                                        <div className="h-28 rounded-xl border border-slate-100 bg-slate-50" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="mb-4 h-5 w-40 rounded bg-slate-200" />
                                <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50" />
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <div className="mb-4 h-5 w-48 rounded bg-slate-200" />
                                <div className="mb-5 h-12 rounded-xl bg-slate-50" />
                                <div className="h-20 rounded-xl border border-slate-100 bg-slate-50" />
                            </div>

                            <div className="h-12 rounded-xl bg-green-900/20" />
                            <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}