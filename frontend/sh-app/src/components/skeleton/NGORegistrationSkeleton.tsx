export default function NGORegistrationSkeleton() {
    return (
        <div
            className="mx-auto max-w-4xl space-y-8 pb-10 animate-pulse"
            aria-label="Loading NGO registration form"
            role="status"
        >
            <div className="h-5 w-36 rounded bg-slate-200" />

            <header className="space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-9 w-72 max-w-full rounded-lg bg-slate-200" />
                <div className="h-4 w-full max-w-2xl rounded bg-slate-200" />
                <div className="h-4 w-2/3 max-w-xl rounded bg-slate-200" />
            </header>

            <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="h-6 w-6 shrink-0 rounded bg-slate-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                </div>
            </div>

            <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                <section className="space-y-5">
                    <div className="space-y-2">
                        <div className="h-6 w-52 rounded bg-slate-200" />
                        <div className="h-4 w-64 max-w-full rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-32 rounded bg-slate-200" />
                                <div className="h-12 rounded-xl bg-slate-100" />
                            </div>
                        ))}

                        <div className="space-y-2 sm:col-span-2">
                            <div className="h-4 w-48 rounded bg-slate-200" />
                            <div className="h-28 rounded-xl bg-slate-100" />
                        </div>

                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className={`space-y-2 ${index === 2 ? "sm:col-span-2" : ""
                                    }`}
                            >
                                <div className="h-4 w-36 rounded bg-slate-200" />
                                <div className="h-12 rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="border-t border-slate-100" />

                <section className="space-y-5">
                    <div className="space-y-2">
                        <div className="h-6 w-64 max-w-full rounded bg-slate-200" />
                        <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
                    </div>

                    <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-slate-200" />
                        <div className="h-16 rounded-xl bg-slate-100" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-4 w-36 rounded bg-slate-200" />
                                <div className="h-16 rounded-xl bg-slate-100" />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="border-t border-slate-100 pt-5">
                    <div className="h-12 w-52 rounded-xl bg-slate-200" />
                    <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-100" />
                </div>
            </div>

            <span className="sr-only">Loading registration form...</span>
        </div>
    );
}