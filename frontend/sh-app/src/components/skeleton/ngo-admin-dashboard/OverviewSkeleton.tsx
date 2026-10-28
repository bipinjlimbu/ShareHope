export default function OverviewSkeleton() {
    return (
        <main className="min-h-screen w-full animate-pulse bg-[#FFFCF6] px-1.5 py-3 sm:px-2.5 sm:py-4 lg:px-3 xl:px-4 2xl:px-5">
            <div className="mx-auto w-full max-w-[1600px] space-y-7">
                <header className="flex flex-col justify-between gap-5 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7 lg:p-8">
                    <div className="min-w-0 flex-1">
                        <div className="h-9 w-56 rounded-lg bg-[#E5EDE3] sm:h-10 sm:w-72" />

                        <div className="mt-4 h-4 w-full max-w-xl rounded bg-[#EDF2E9]" />
                        <div className="mt-2 h-4 w-3/4 max-w-lg rounded bg-[#EDF2E9]" />
                    </div>

                    <div className="flex flex-col gap-3 self-start sm:items-end sm:self-auto">
                        <div className="flex items-center gap-3 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-5 py-3.5">
                            <div className="h-10 w-10 rounded-xl bg-[#E5EDE3]" />

                            <div className="space-y-2">
                                <div className="h-4 w-28 rounded bg-[#DCE8D7]" />
                                <div className="h-3 w-12 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>
                    </div>
                </header>

                <section
                    aria-label="Loading NGO statistics"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
                >
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-32 rounded bg-[#E5EDE3]" />
                                    <div className="mt-4 h-9 w-36 rounded bg-[#DCE8D7]" />
                                </div>

                                <div className="h-12 w-12 shrink-0 rounded-2xl bg-[#E5F2E1]" />
                            </div>

                            <div className="mt-5 h-3 w-44 max-w-full rounded bg-[#EDF2E9]" />

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
                            <div className="min-w-0 flex-1">
                                <div className="h-5 w-48 rounded bg-[#DCE8D7]" />
                                <div className="mt-2 h-4 w-64 max-w-full rounded bg-[#EDF2E9]" />
                            </div>

                            <div className="rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3">
                                <div className="h-3 w-24 rounded bg-[#DCE8D7]" />
                                <div className="mt-2 h-6 w-32 rounded bg-[#DCE8D7]" />
                            </div>
                        </div>

                        <div className="mt-8 flex h-56 items-end gap-3 sm:gap-5">
                            {[30, 52, 43, 68, 78, 95].map((height, index) => (
                                <div
                                    key={index}
                                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                                >
                                    <div className="flex w-full flex-1 items-end justify-center">
                                        <div
                                            className={`w-full max-w-14 rounded-t-lg ${index === 5
                                                ? "bg-[#B8D9B0]"
                                                : "bg-[#E0EBDD]"
                                                }`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>

                                    <div className="mt-3 h-3 w-8 rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2 border-t border-[#EDF2E9] pt-4">
                            <div className="h-2.5 w-2.5 rounded-sm bg-[#D6E7D1]" />
                            <div className="h-3 w-36 rounded bg-[#EDF2E9]" />
                            <div className="ml-auto h-6 w-24 rounded-full bg-[#E5F2E1]" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <div className="h-5 w-40 rounded bg-[#DCE8D7]" />
                        <div className="mt-2 h-4 w-48 max-w-full rounded bg-[#EDF2E9]" />

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E9DCC0] bg-[#FBF6EA] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-white" />

                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="h-4 w-28 rounded bg-[#E9DCC0]" />
                                    <div className="h-3 w-36 max-w-full rounded bg-[#F0E4CA]" />
                                </div>
                            </div>

                            <div className="h-8 w-8 rounded bg-[#E9DCC0]" />
                        </div>

                        <div className="mt-4 space-y-1">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-4 w-32 max-w-full rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-40 max-w-full rounded bg-[#EDF2E9]" />
                                        <div className="h-3 w-20 rounded bg-[#EDF2E9]" />
                                    </div>

                                    <div className="h-4 w-4 shrink-0 rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm 2xl:col-span-2">
                        <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                            <div className="h-5 w-40 rounded bg-[#DCE8D7]" />
                            <div className="mt-2 h-4 w-64 max-w-full rounded bg-[#EDF2E9]" />
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
                                                <div className="h-4 w-44 max-w-full rounded bg-[#DCE8D7]" />
                                                <div className="h-5 w-16 rounded-full bg-[#E5F2E1]" />
                                            </div>

                                            <div className="mt-2 h-3 w-full max-w-md rounded bg-[#EDF2E9]" />

                                            <div className="mt-3 flex flex-wrap gap-4">
                                                <div className="h-3 w-28 rounded bg-[#EDF2E9]" />
                                                <div className="h-3 w-24 rounded bg-[#EDF2E9]" />
                                            </div>

                                            {index !== 2 && (
                                                <div className="mt-3 max-w-md">
                                                    <div className="mb-2 flex justify-between">
                                                        <div className="h-3 w-28 rounded bg-[#EDF2E9]" />
                                                        <div className="h-3 w-8 rounded bg-[#EDF2E9]" />
                                                    </div>
                                                    <div className="h-2 overflow-hidden rounded-full bg-[#EDF2E9]">
                                                        <div
                                                            className="h-full rounded-full bg-[#D6E7D1]"
                                                            style={{
                                                                width: `${[68, 22, 100][index % 3]}%`,
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
                            <div className="h-5 w-40 rounded bg-[#E5EDE3]" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                        <div className="h-5 w-32 rounded bg-[#DCE8D7]" />
                        <div className="mt-2 h-4 w-48 max-w-full rounded bg-[#EDF2E9]" />

                        <div className="mt-5 space-y-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-xl p-3"
                                >
                                    <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-4 w-32 max-w-full rounded bg-[#E5EDE3]" />
                                        <div className="h-3 w-40 max-w-full rounded bg-[#EDF2E9]" />
                                    </div>

                                    <div className="h-4 w-4 shrink-0 rounded bg-[#EDF2E9]" />
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] p-4">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E5F2E1]" />

                                <div className="min-w-0 flex-1">
                                    <div className="h-4 w-32 rounded bg-[#DCE8D7]" />
                                    <div className="mt-2 h-3 w-full rounded bg-[#E5EDE3]" />
                                    <div className="mt-2 h-3 w-5/6 rounded bg-[#E5EDE3]" />
                                    <div className="mt-4 h-4 w-28 rounded bg-[#DCE8D7]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#E5EDE3] bg-white shadow-sm">
                    <div className="border-b border-[#E5EDE3] px-5 py-5 sm:px-6">
                        <div className="h-5 w-40 rounded bg-[#DCE8D7]" />
                        <div className="mt-2 h-4 w-64 max-w-full rounded bg-[#EDF2E9]" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-[#F1F6ED]">
                                <tr>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <th key={index} className="px-5 py-3.5">
                                            <div className="h-3 w-16 rounded bg-[#DCE8D7]" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#EDF2E9]">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 shrink-0 rounded-full bg-[#E5F2E1]" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-28 rounded bg-[#E5EDE3]" />
                                                    <div className="h-3 w-20 rounded bg-[#EDF2E9]" />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="h-4 w-36 rounded bg-[#EDF2E9]" />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="h-4 w-12 rounded bg-[#EDF2E9]" />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="h-4 w-24 rounded bg-[#E5EDE3]" />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="h-6 w-20 rounded-full bg-[#E5F2E1]" />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="h-4 w-24 rounded bg-[#EDF2E9]" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-[#E5EDE3] bg-[#FCFDFB] px-5 py-4 sm:px-6">
                        <div className="h-5 w-40 rounded bg-[#E5EDE3]" />
                    </div>
                </section>

                <section className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-[#E5F2E1]" />

                            <div className="min-w-0 flex-1">
                                <div className="h-4 w-40 max-w-full rounded bg-[#DCE8D7]" />
                                <div className="mt-2 h-4 w-64 max-w-full rounded bg-[#EDF2E9]" />
                            </div>
                        </div>

                        <div className="h-11 w-32 rounded-xl bg-[#D6E7D1]" />
                    </div>
                </section>

                <div className="flex justify-center pb-2">
                    <div className="h-3 w-56 rounded bg-[#EDF2E9]" />
                </div>
            </div>
        </main>
    );
}