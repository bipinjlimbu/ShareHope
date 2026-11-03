export default function ResetPasswordSkeleton() {
    return (
        <main
            aria-label="Loading reset password page"
            aria-busy="true"
            className="flex min-h-[80vh] animate-pulse items-center justify-center bg-slate-50 px-4 py-12 sm:px-6"
        >
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7 h-14 w-14 rounded-2xl bg-emerald-100" />

                <div className="h-8 w-56 max-w-full rounded-lg bg-slate-200" />

                <div className="mt-3 space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-4/5 rounded bg-slate-100" />
                </div>

                <div className="mt-8 space-y-5">
                    <div>
                        <div className="mb-2 h-4 w-28 rounded bg-slate-200" />
                        <div className="h-12 rounded-xl border border-slate-200 bg-slate-100" />
                        <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                    </div>

                    <div>
                        <div className="mb-2 h-4 w-36 rounded bg-slate-200" />
                        <div className="h-12 rounded-xl border border-slate-200 bg-slate-100" />
                    </div>

                    <div className="h-12 rounded-xl bg-emerald-100" />
                </div>

                <div className="mx-auto mt-6 h-4 w-40 rounded bg-slate-100" />
            </section>
        </main>
    );
}