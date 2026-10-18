import Link from "next/link";

export default function LoginSkeleton() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-slate-900">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <section className="flex flex-col justify-between bg-green-700 p-8 text-white sm:p-12">
                    <Link
                        href="/"
                        aria-label="ShareHope home"
                        className="inline-flex w-fit items-center"
                    >
                        <div className="h-10 w-[150px] animate-pulse rounded-lg bg-green-600 sm:w-[170px]" />
                    </Link>

                    <div className="my-12">
                        <div className="h-9 w-full max-w-sm animate-pulse rounded-lg bg-green-600 sm:h-10" />
                        <div className="mt-4 h-4 w-full max-w-sm animate-pulse rounded bg-green-600" />
                        <div className="mt-2 h-4 w-5/6 max-w-sm animate-pulse rounded bg-green-600" />
                        <div className="mt-2 h-4 w-2/3 max-w-sm animate-pulse rounded bg-green-600" />
                    </div>

                    <div className="h-4 w-64 max-w-full animate-pulse rounded bg-green-600" />
                </section>

                <section className="p-6 sm:p-10 md:p-12">
                    <div className="mb-8">
                        <div className="h-4 w-32 animate-pulse rounded bg-green-100" />
                        <div className="mt-3 h-9 w-full max-w-sm animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-3 h-4 w-full max-w-xs animate-pulse rounded bg-slate-100" />
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
                            <div className="h-12 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                                <div className="h-4 w-28 animate-pulse rounded bg-green-100" />
                            </div>

                            <div className="h-12 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
                        </div>

                        <div className="h-12 w-full animate-pulse rounded-xl bg-green-100" />
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-28 animate-pulse rounded bg-green-100" />
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        <div className="h-3 w-full max-w-xs animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-48 max-w-full animate-pulse rounded bg-slate-100" />
                    </div>
                </section>
            </div>
        </main>
    );
}