export default function ForgotPasswordSkeleton() {
    return (
        <main
            aria-label="Loading forgot password page"
            aria-busy="true"
            className="flex min-h-screen animate-pulse items-center justify-center bg-white px-4 py-12 text-slate-900"
        >
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <section className="flex flex-col justify-between bg-green-700 p-8 text-white sm:p-12">
                    <div className="h-10 w-[150px] rounded-lg bg-green-600 sm:w-[170px]" />

                    <div className="my-12">
                        <div className="h-9 w-full max-w-sm rounded-lg bg-green-600 sm:h-10" />

                        <div className="mt-4 h-4 w-full max-w-sm rounded bg-green-600" />

                        <div className="mt-2 h-4 w-5/6 max-w-sm rounded bg-green-600" />

                        <div className="mt-2 h-4 w-2/3 max-w-sm rounded bg-green-600" />
                    </div>

                    <div className="h-4 w-64 max-w-full rounded bg-green-600" />
                </section>

                <section className="p-6 sm:p-10 md:p-12">
                    <div className="mb-8">
                        <div className="h-4 w-36 rounded bg-green-100" />

                        <div className="mt-3 h-9 w-full max-w-sm rounded-lg bg-slate-200" />

                        <div className="mt-4 h-4 w-full rounded bg-slate-100" />

                        <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />

                        <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                    </div>

                    <div className="space-y-5">
                        <div>
                            <div className="mb-2 h-4 w-28 rounded bg-slate-200" />

                            <div className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100" />
                        </div>

                        <div className="h-12 w-full rounded-xl bg-green-100" />
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="h-4 w-36 rounded bg-slate-100" />

                        <div className="h-4 w-24 rounded bg-green-100" />
                    </div>
                </section>
            </div>
        </main>
    );
}