export default function ContactSkeleton() {
    return (
        <div className="animate-pulse border border-[#E4E9DF] bg-white p-6 shadow-[0_12px_50px_rgba(24,59,42,0.04)] sm:p-10 lg:p-12">
            <div className="mb-9">
                <div className="h-3 w-28 rounded bg-[#E5F2E1]" />
                <div className="mt-4 h-8 w-56 max-w-full rounded bg-[#E5F2E1]" />
                <div className="mt-4 h-4 w-full max-w-md rounded bg-[#EDF6E9]" />
                <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-[#EDF6E9]" />
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div key={item}>
                            <div className="mb-3 h-4 w-24 rounded bg-[#E5F2E1]" />
                            <div className="h-12 w-full rounded bg-[#EDF6E9]" />
                        </div>
                    ))}
                </div>

                <div>
                    <div className="mb-3 h-4 w-28 rounded bg-[#E5F2E1]" />
                    <div className="h-40 w-full rounded bg-[#EDF6E9]" />
                </div>

                <div className="h-12 w-36 rounded bg-[#E5F2E1]" />
                <div className="h-3 w-64 max-w-full rounded bg-[#EDF6E9]" />
            </div>
        </div>
    );
}
