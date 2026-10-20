export default function ResetPasswordSkeleton() {
    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-md animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-emerald-100" />

                <div className="mx-auto h-7 w-52 rounded-lg bg-slate-200" />
                <div className="mx-auto mt-3 h-4 w-64 max-w-full rounded bg-slate-100" />

                <div className="mt-8 space-y-5">
                    <div>
                        <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                    </div>

                    <div>
                        <div className="mb-2 h-4 w-36 rounded bg-slate-200" />
                        <div className="h-12 rounded-xl bg-slate-100" />
                    </div>

                    <div className="h-12 rounded-xl bg-emerald-100" />
                </div>

                <div className="mx-auto mt-6 h-4 w-40 rounded bg-slate-100" />
            </section>
        </main>
    );
}