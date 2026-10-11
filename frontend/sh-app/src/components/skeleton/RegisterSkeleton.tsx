export default function RegisterSkeleton() {
    const inputClass =
        "h-12 w-full animate-pulse rounded-xl bg-gray-100";

    const field = (labelWidth: string) => (
        <div className="space-y-2">
            <div
                className={`h-4 ${labelWidth} animate-pulse rounded bg-gray-200`}
            />
            <div className={inputClass} />
        </div>
    );

    return (
        <main
            className="min-h-screen bg-[#FFFCF6] px-4 py-10 sm:px-6 lg:py-16"
            aria-label="Loading registration page"
        >
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-950/5 lg:grid-cols-2">
                <section className="relative flex flex-col justify-between overflow-hidden bg-[#14532D] p-8 text-white sm:p-12 lg:p-14">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 animate-pulse rounded-2xl bg-white/20" />
                            <div className="h-7 w-32 animate-pulse rounded-lg bg-white/20" />
                        </div>

                        <div className="mt-16 space-y-5 sm:mt-20">
                            <div className="h-4 w-36 animate-pulse rounded bg-white/20" />

                            <div className="space-y-3">
                                <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-white/20 sm:h-12" />
                                <div className="h-10 w-52 max-w-full animate-pulse rounded-lg bg-white/20 sm:h-12" />
                            </div>

                            <div className="max-w-md space-y-2">
                                <div className="h-4 w-full animate-pulse rounded bg-white/15" />
                                <div className="h-4 w-11/12 animate-pulse rounded bg-white/15" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-white/15" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 space-y-3 rounded-2xl border border-white/15 bg-white/10 p-5">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-white/20" />
                        <div className="h-4 w-full animate-pulse rounded bg-white/15" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-white/15" />
                    </div>
                </section>

                <section className="p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto max-w-md">
                        <div className="mb-8 space-y-3">
                            <div className="h-4 w-28 animate-pulse rounded bg-green-100" />
                            <div className="h-9 w-64 max-w-full animate-pulse rounded-lg bg-gray-200" />
                            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                {field("w-24")}
                                {field("w-24")}
                            </div>

                            {field("w-20")}
                            {field("w-28")}
                            {field("w-28")}
                            {field("w-24")}

                            <div className="space-y-2">
                                <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                                <div className={inputClass} />
                            </div>

                            {field("w-20")}
                            {field("w-32")}

                            <div className="h-12 w-full animate-pulse rounded-xl bg-green-200" />
                        </div>

                        <div className="mt-7 flex justify-center gap-2">
                            <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 w-16 animate-pulse rounded bg-green-100" />
                        </div>

                        <div className="mx-auto mt-5 h-8 w-4/5 animate-pulse rounded bg-gray-100" />
                    </div>
                </section>
            </div>
        </main>
    );
}
