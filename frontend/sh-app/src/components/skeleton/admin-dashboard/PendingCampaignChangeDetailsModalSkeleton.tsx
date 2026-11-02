export default function PendingCampaignChangeDetailsModalSkeleton() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-5">
            <section
                role="dialog"
                aria-modal="true"
                aria-label="Loading campaign change details"
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="h-6 w-28 animate-pulse rounded-full bg-amber-100" />
                            <div className="h-6 w-24 animate-pulse rounded-full bg-[#E5EDE3]" />
                        </div>

                        <div className="mt-3 h-7 w-64 max-w-full animate-pulse rounded-lg bg-[#E5EDE3]" />
                        <div className="mt-2 h-4 w-full max-w-md animate-pulse rounded bg-[#EDF2E9]" />
                    </div>

                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#EDF2E9]" />
                </header>

                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-7">
                    <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <div className="h-5 w-44 animate-pulse rounded bg-[#E5EDE3]" />

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="rounded-xl bg-[#FAFCF8] p-3">
                                    <div className="h-3 w-24 animate-pulse rounded bg-[#E5EDE3]" />
                                    <div className="mt-3 h-4 w-32 max-w-full animate-pulse rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <div className="h-5 w-48 animate-pulse rounded bg-[#E5EDE3]" />
                        <div className="mt-2 h-3 w-full max-w-lg animate-pulse rounded bg-[#EDF2E9]" />

                        <div className="mt-5">
                            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-[#E5EDE3]" />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {[1, 2].map((item) => (
                                    <div key={item} className="min-w-0">
                                        <div className="mb-2 h-3 w-28 animate-pulse rounded bg-[#E5EDE3]" />
                                        <div className="aspect-video w-full animate-pulse rounded-xl border border-[#E5EDE3] bg-[#EDF2E9]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5 border-t border-[#EDF2E9]">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="grid grid-cols-1 gap-3 border-b border-[#EDF2E9] py-4 last:border-b-0 sm:grid-cols-2"
                                >
                                    <div className="min-w-0">
                                        <div className="mb-2 h-3 w-36 animate-pulse rounded bg-[#E5EDE3]" />

                                        {item === 2 ? (
                                            <div className="space-y-2">
                                                <div className="h-3 w-full animate-pulse rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-11/12 animate-pulse rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-3/4 animate-pulse rounded bg-[#EDF2E9]" />
                                            </div>
                                        ) : (
                                            <div className="h-4 w-3/4 max-w-full animate-pulse rounded bg-[#EDF2E9]" />
                                        )}
                                    </div>

                                    <div className="min-w-0 rounded-xl p-3">
                                        <div className="mb-3 flex items-center justify-between gap-2">
                                            <div className="h-3 w-24 animate-pulse rounded bg-[#DDEBDD]" />
                                            <div className="h-5 w-20 animate-pulse rounded-full bg-[#EDF2E9]" />
                                        </div>

                                        {item === 2 ? (
                                            <div className="space-y-2">
                                                <div className="h-3 w-full animate-pulse rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-11/12 animate-pulse rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-3/4 animate-pulse rounded bg-[#EDF2E9]" />
                                            </div>
                                        ) : (
                                            <div className="h-4 w-3/4 max-w-full animate-pulse rounded bg-[#EDF2E9]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                        <div className="h-3 w-full max-w-2xl animate-pulse rounded bg-amber-100" />
                        <div className="mt-2 h-3 w-3/4 max-w-xl animate-pulse rounded bg-amber-100" />
                    </div>
                </div>

                <footer className="flex shrink-0 justify-end border-t border-[#E5EDE3] bg-white px-5 py-4 sm:px-7">
                    <div className="h-10 w-20 animate-pulse rounded-xl bg-[#E5EDE3]" />
                </footer>
            </section>
        </div>
    );
}
