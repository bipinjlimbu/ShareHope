export default function OverviewSkeleton() {
    return (
        <main className="min-h-screen w-full animate-pulse bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px] space-y-7">
                <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="w-full">
                        <div className="mb-3 h-7 w-32 rounded-full bg-[#E5F2E1]" />
                        <div className="h-9 w-56 max-w-full rounded-lg bg-[#E5EDE3] sm:h-11 sm:w-72" />
                        <div className="mt-3 h-4 w-full max-w-xl rounded bg-[#EDF2E9]" />
                        <div className="mt-2 h-4 w-4/5 max-w-lg rounded bg-[#EDF2E9]" />
                    </div>

                    <div className="flex flex-col gap-3 self-start sm:items-end sm:self-auto">
                        <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                            <div className="h-10 w-10 rounded-xl bg-[#E5F2E1]" />
                            <div className="space-y-2">
                                <div className="h-4 w-28 rounded bg-[#D8E8D4]" />
                                <div className="h-3 w-12 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>
                    </div>
                </div>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-28 max-w-full rounded bg-[#E5EDE3]" />
                                    <div className="mt-4 h-9 w-36 max-w-full rounded-lg bg-[#D8E8D4]" />
                                </div>
                                <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                            </div>

                            <div className="mt-5 h-3 w-40 max-w-full rounded bg-[#EDF2E9]" />

                            <div className="mt-4 flex items-center justify-between border-t border-[#EDF2E9] pt-3">
                                <div className="h-3 w-20 rounded bg-[#EDF2E9]" />
                                <div className="h-4 w-4 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="h-5 w-44 rounded bg-[#D8E8D4]" />
                                <div className="mt-2 h-3 w-56 max-w-full rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3">
                                <div className="h-3 w-24 rounded bg-[#D8E8D4]" />
                                <div className="mt-2 h-6 w-32 rounded bg-[#C9DFC4]" />
                            </div>
                        </div>

                        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                            {[30, 48, 39, 62, 78, 95].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <div className="flex w-full flex-1 items-end justify-center">
                                        <div
                                            className={`w-full max-w-14 rounded-t-lg ${index === 5
                                                ? "bg-[#A8CFA1]"
                                                : "bg-[#D6E7D1]"
                                                }`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>
                                    <div className="mt-3 h-3 w-8 rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2 border-t border-[#EDF2E9] pt-4">
                            <div className="h-3 w-3 rounded-sm bg-[#A8CFA1]" />
                            <div className="h-3 w-36 rounded bg-[#EDF2E9]" />
                            <div className="ml-auto h-6 w-24 rounded-full bg-[#E5F2E1]" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <div className="h-5 w-36 rounded bg-[#D8E8D4]" />
                        <div className="mt-2 h-3 w-48 max-w-full rounded bg-[#EDF2E9]" />

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E9DCC0] bg-[#FBF6EA] p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-[#E9DCC0]" />
                                <div className="space-y-2">
                                    <div className="h-4 w-28 rounded bg-[#E9DCC0]" />
                                    <div className="h-3 w-32 max-w-full rounded bg-[#F0E5CE]" />
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded bg-[#E9DCC0]" />
                        </div>

                        <div className="mt-4 space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E5F2E1]" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-3.5 w-3/4 rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                        <div className="h-2.5 w-20 rounded bg-[#EDF2E9]" />
                                    </div>
                                    <div className="h-4 w-4 rounded bg-[#E5EDE3]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm 2xl:col-span-2">
                        <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                            <div className="h-5 w-40 rounded bg-[#D8E8D4]" />
                            <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EDF2E9]" />
                        </div>

                        <div className="divide-y divide-[#EDF2E9]">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="h-4 w-48 max-w-full rounded bg-[#D8E8D4]" />
                                                <div className="h-5 w-16 rounded-full bg-[#E5F2E1]" />
                                            </div>

                                            <div className="mt-2 h-3 w-full max-w-md rounded bg-[#EDF2E9]" />

                                            <div className="mt-3 flex flex-wrap gap-4">
                                                <div className="h-3 w-28 rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                                            </div>

                                            {index !== 2 && (
                                                <div className="mt-3 max-w-md">
                                                    <div className="mb-2 flex justify-between gap-3">
                                                        <div className="h-3 w-28 rounded bg-[#EDF2E9]" />
                                                        <div className="h-3 w-8 rounded bg-[#EDF2E9]" />
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-[#EDF2E9]">
                                                        <div
                                                            className="h-full rounded-full bg-[#C9DFC4]"
                                                            style={{
                                                                width: `${[72, 22, 0, 100][index]}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="mt-2 h-3 w-32 rounded bg-[#EDF2E9]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-9 w-24 shrink-0 self-start rounded-lg border border-[#D8E8D4] bg-[#F5F9F2] sm:self-center" />
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                            <div className="h-4 w-40 rounded bg-[#E5F2E1]" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <div className="h-5 w-32 rounded bg-[#D8E8D4]" />
                        <div className="mt-2 h-3 w-44 max-w-full rounded bg-[#EDF2E9]" />

                        <div className="mt-5 space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-4 w-3/4 rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-full rounded bg-[#EDF2E9]" />
                                    </div>
                                    <div className="h-4 w-4 rounded bg-[#E5EDE3]" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] p-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#D8E8D4]" />
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-[#D8E8D4]" />
                                    <div className="h-3 w-full rounded bg-[#E5EDE3]" />
                                    <div className="h-3 w-4/5 rounded bg-[#E5EDE3]" />
                                    <div className="mt-3 h-3 w-28 rounded bg-[#D8E8D4]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm">
                    <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                        <div className="h-5 w-40 rounded bg-[#D8E8D4]" />
                        <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EDF2E9]" />
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[760px]">
                            <div className="flex gap-6 bg-[#F1F6ED] px-5 py-4">
                                {[20, 32, 12, 16, 14, 12].map((width, index) => (
                                    <div
                                        key={index}
                                        className="h-3 rounded bg-[#D8E8D4]"
                                        style={{ width: `${width * 4}px` }}
                                    />
                                ))}
                            </div>

                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-6 border-t border-[#EDF2E9] px-5 py-4"
                                >
                                    <div className="flex w-44 shrink-0 items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-[#E5F2E1]" />
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 rounded bg-[#E5EDE3]" />
                                            <div className="h-2.5 w-20 rounded bg-[#EDF2E9]" />
                                        </div>
                                    </div>

                                    <div className="h-3 w-40 shrink-0 rounded bg-[#EDF2E9]" />
                                    <div className="h-3 w-14 shrink-0 rounded bg-[#EDF2E9]" />
                                    <div className="h-3 w-24 shrink-0 rounded bg-[#E5EDE3]" />
                                    <div className="h-5 w-20 shrink-0 rounded-full bg-[#E5F2E1]" />
                                    <div className="h-3 w-24 shrink-0 rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                        <div className="h-4 w-40 rounded bg-[#E5F2E1]" />
                    </div>
                </section>

                <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />
                            <div className="space-y-2">
                                <div className="h-4 w-44 rounded bg-[#D8E8D4]" />
                                <div className="h-3 w-64 max-w-full rounded bg-[#EDF2E9]" />
                            </div>
                        </div>

                        <div className="h-11 w-32 rounded-xl bg-[#D8E8D4]" />
                    </div>
                </section>

                <div className="flex justify-center pb-2">
                    <div className="h-3 w-64 max-w-full rounded bg-[#EDF2E9]" />
                </div>
            </div>
        </main>
    );
}