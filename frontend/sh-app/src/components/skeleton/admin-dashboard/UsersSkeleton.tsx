export default function UsersSkeleton() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="h-8 w-48 rounded-lg bg-[#E5F2E1]" />
                    <div className="mt-3 h-4 w-72 max-w-full rounded bg-[#E5F2E1]" />
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm"
                        >
                            <div className="mb-5 h-4 w-28 rounded bg-[#E5F2E1]" />
                            <div className="h-8 w-16 rounded bg-[#E5F2E1]" />
                            <div className="mt-3 h-3 w-36 rounded bg-[#F0F5ED]" />
                        </div>
                    ))}
                </div>

                <div className="mb-6 rounded-2xl border border-[#E5EDE3] bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="h-11 flex-1 rounded-xl bg-[#F0F5ED]" />
                        <div className="h-11 w-full rounded-xl bg-[#F0F5ED] sm:w-44" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 shrink-0 rounded-full bg-[#E5F2E1]" />
                                <div className="min-w-0 flex-1">
                                    <div className="h-5 w-36 max-w-full rounded bg-[#E5F2E1]" />
                                    <div className="mt-3 h-3 w-28 rounded bg-[#F0F5ED]" />
                                    <div className="mt-2 h-3 w-44 max-w-full rounded bg-[#F0F5ED]" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between">
                                <div className="h-7 w-24 rounded-full bg-[#F0F5ED]" />
                                <div className="h-7 w-20 rounded-full bg-[#F0F5ED]" />
                            </div>

                            <div className="my-5 h-px bg-[#E5EDE3]" />

                            <div className="flex justify-between gap-3">
                                <div className="h-9 flex-1 rounded-lg bg-[#F0F5ED]" />
                                <div className="h-9 w-24 rounded-lg bg-[#F0F5ED]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
