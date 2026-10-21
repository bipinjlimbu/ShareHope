
export default function DashboardSkeleton() {
    return (
        <div className="min-h-screen animate-pulse bg-slate-50">
            <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
                <div className="flex h-20 items-center border-b border-slate-100 px-5">
                    <div className="h-9 w-36 rounded-lg bg-slate-200" />
                </div>

                <div className="border-b border-slate-100 p-5">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded bg-slate-200" />
                            <div className="h-3 w-28 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 px-4 py-6">
                    <div className="mb-5 h-3 w-20 rounded bg-slate-200" />

                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 rounded-xl px-3 py-3"
                        >
                            <div className="h-5 w-5 rounded-md bg-slate-200" />
                            <div
                                className="h-3 rounded bg-slate-200"
                                style={{
                                    width: `${55 + (index % 3) * 15}%`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </aside>

            <div className="md:pl-64">
                <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="space-y-2">
                        <div className="h-3 w-32 rounded bg-slate-200" />
                        <div className="h-5 w-44 rounded bg-slate-200" />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-xl bg-slate-200" />
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                    </div>
                </header>

                <main className="space-y-6 p-4 sm:p-6 lg:p-8">
                    <div className="space-y-2">
                        <div className="h-7 w-52 rounded bg-slate-200" />
                        <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-5"
                            >
                                <div className="h-4 w-28 rounded bg-slate-200" />
                                <div className="mt-5 h-8 w-20 rounded bg-slate-200" />
                                <div className="mt-4 h-3 w-32 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 xl:col-span-2">
                            <div className="h-5 w-40 rounded bg-slate-200" />
                            <div className="mt-6 h-64 rounded-xl bg-slate-100" />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="h-5 w-36 rounded bg-slate-200" />
                            <div className="mt-6 space-y-5">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-slate-200" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-3/4 rounded bg-slate-200" />
                                            <div className="h-3 w-1/2 rounded bg-slate-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
