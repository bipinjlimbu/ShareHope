import NGOStaffInvitationsDataFetchSkeleton from "@/components/skeleton/main/NGOStaffInvitationsDataFetchSkeleton";

export default function InvitationsLoading() {
    return (
        <main className="min-h-screen animate-pulse bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <header className="mb-10 text-center">
                    <div className="mx-auto h-9 w-40 rounded-full bg-[#E5F0E1]" />

                    <div className="mx-auto mt-6 h-9 w-full max-w-xl rounded-lg bg-[#E5F0E1] sm:h-11" />

                    <div className="mx-auto mt-3 h-9 w-full max-w-md rounded-lg bg-[#E5F0E1] sm:h-11" />

                    <div className="mx-auto mt-5 h-3 w-full max-w-2xl rounded-md bg-[#EDF2E9]" />
                    <div className="mx-auto mt-2 h-3 w-3/4 max-w-xl rounded-md bg-[#EDF2E9]" />
                </header>

                {/* Summary Cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-4 rounded-2xl border border-[#E3EDE0] bg-white p-5"
                        >
                            <div className="h-12 w-12 shrink-0 rounded-xl bg-[#EAF0E7]" />

                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-28 rounded-md bg-[#F0F3ED]" />
                                <div className="h-6 w-12 rounded-md bg-[#EAF0E7]" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Search */}
                <section className="mb-6 rounded-2xl border border-[#E3EDE0] bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="h-11 w-full rounded-xl bg-[#F0F3ED] sm:max-w-sm" />

                        <div className="h-3 w-40 rounded-md bg-[#F0F3ED]" />
                    </div>
                </section>

                {/* Invitation Heading */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="h-5 w-40 rounded-md bg-[#EAF0E7]" />
                    <div className="h-3 w-24 rounded-md bg-[#F0F3ED]" />
                </div>

                {/* Invitation Cards */}
                <NGOStaffInvitationsDataFetchSkeleton />

                {/* Footer Note */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#DCEBDD] bg-[#F1F7EF] p-4">
                    <div className="h-5 w-5 shrink-0 rounded-md bg-[#DCEBDD]" />

                    <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 w-full max-w-2xl rounded-md bg-[#E1EBDD]" />
                        <div className="h-3 w-3/4 max-w-xl rounded-md bg-[#E1EBDD]" />
                    </div>
                </div>
            </div>
        </main>
    );
}