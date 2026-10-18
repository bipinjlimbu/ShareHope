export default function RegisterSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-4 py-10 sm:px-6 lg:py-16">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-950/5 lg:grid-cols-2">
                <section className="relative flex flex-col justify-between overflow-hidden bg-[#14532D] p-8 sm:p-12 lg:p-14">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-400/10" />
                    <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-lime-300/10" />

                    <div className="relative">
                        <div className="h-10 w-[150px] rounded-lg bg-white/20 sm:w-[170px]" />

                        <div className="mt-16 sm:mt-20">
                            <div className="mb-4 h-4 w-40 rounded bg-green-200/30" />

                            <div className="h-11 w-full max-w-sm rounded-lg bg-white/20 sm:h-12" />
                            <div className="mt-3 h-11 w-4/5 max-w-sm rounded-lg bg-white/20 sm:h-12" />

                            <div className="mt-6 space-y-3">
                                <div className="h-4 w-full max-w-md rounded bg-green-100/20" />
                                <div className="h-4 w-11/12 max-w-md rounded bg-green-100/20" />
                                <div className="h-4 w-3/4 max-w-md rounded bg-green-100/20" />
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-16 rounded-2xl border border-white/15 bg-white/10 p-5">
                        <div className="h-5 w-56 max-w-full rounded bg-white/20" />
                        <div className="mt-4 space-y-2">
                            <div className="h-4 w-full rounded bg-green-100/20" />
                            <div className="h-4 w-11/12 rounded bg-green-100/20" />
                            <div className="h-4 w-3/4 rounded bg-green-100/20" />
                        </div>
                    </div>
                </section>

                <section className="p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto max-w-md">
                        <div className="mb-8">
                            <div className="h-4 w-28 rounded bg-green-100" />
                            <div className="mt-3 h-9 w-64 max-w-full rounded-lg bg-gray-200" />
                            <div className="mt-3 h-4 w-full max-w-sm rounded bg-gray-100" />
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                                    <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                                </div>
                                <div>
                                    <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                                    <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-20 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-28 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-28 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-36 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div>
                                <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
                                <div className="h-12 rounded-xl border border-gray-200 bg-gray-100" />
                            </div>

                            <div className="h-12 rounded-xl bg-green-100" />
                        </div>

                        <div className="mt-7 flex items-center justify-center gap-2">
                            <div className="h-4 w-36 rounded bg-gray-100" />
                            <div className="h-4 w-20 rounded bg-green-100" />
                        </div>

                        <div className="mx-auto mt-5 h-8 w-full max-w-sm rounded bg-gray-100" />
                    </div>
                </section>
            </div>
        </main>
    );
}