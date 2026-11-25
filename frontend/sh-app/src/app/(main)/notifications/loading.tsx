export default function NotificationsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <header className="mb-10 text-center">
                    <div className="mx-auto h-9 w-36 rounded-full bg-[#E5EDE3]" />

                    <div className="mx-auto mt-5 h-10 w-72 max-w-full rounded-xl bg-[#E5EDE3] sm:h-12" />

                    <div className="mx-auto mt-3 h-10 w-64 max-w-full rounded-xl bg-[#E5EDE3]" />

                    <div className="mx-auto mt-5 max-w-xl space-y-2">
                        <div className="h-3 w-full rounded bg-[#E5EDE3]" />
                        <div className="mx-auto h-3 w-4/5 rounded bg-[#E5EDE3]" />
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5"
                        >
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-[#E5F2E1]" />

                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 max-w-full rounded bg-[#E5EDE3]" />
                                <div className="h-6 w-12 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Toolbar and Filters */}
                <section className="mb-6 rounded-3xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-2">
                            <div className="h-4 w-32 rounded bg-[#E5EDE3]" />
                            <div className="h-3 w-64 max-w-full rounded bg-[#E5EDE3]" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="h-10 w-36 rounded-xl bg-[#E5F2E1]" />
                            <div className="h-10 w-28 rounded-xl bg-red-50" />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-[#EDF2E9] pt-4">
                        {[16, 20, 16].map((width, index) => (
                            <div
                                key={index}
                                className="h-9 rounded-xl bg-[#E5EDE3]"
                                style={{ width: `${width * 4}px` }}
                            />
                        ))}
                    </div>
                </section>

                {/* Notification Cards */}
                <section className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex gap-3 rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:gap-4 sm:p-5"
                        >
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1] sm:h-12 sm:w-12" />

                            <div className="min-w-0 flex-1 space-y-3">
                                <div className="h-4 w-48 max-w-full rounded bg-[#E5EDE3]" />
                                <div className="h-3 w-full rounded bg-[#E5EDE3]" />
                                <div className="h-3 w-4/5 rounded bg-[#E5EDE3]" />

                                <div className="flex flex-wrap gap-3 pt-1">
                                    <div className="h-6 w-20 rounded-full bg-[#E5F2E1]" />
                                    <div className="h-6 w-24 rounded-full bg-[#E5EDE3]" />
                                </div>
                            </div>

                            <div className="flex shrink-0 gap-2">
                                <div className="h-9 w-9 rounded-xl bg-[#E5EDE3]" />
                                <div className="h-9 w-9 rounded-xl bg-red-50" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Footer Note */}
                <div className="mt-8 flex justify-center">
                    <div className="h-3 w-64 max-w-full rounded bg-[#E5EDE3]" />
                </div>
            </div>
        </main>
    );
}