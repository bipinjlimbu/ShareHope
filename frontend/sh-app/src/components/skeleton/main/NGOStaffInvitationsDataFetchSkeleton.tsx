export default function NGOStaffInvitationsDataFetchSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-[#E3EDE0] bg-white p-5 shadow-[0_2px_12px_rgba(24,59,42,0.035)] sm:p-6"
                >
                    {/* NGO Information */}
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 shrink-0 rounded-2xl bg-[#EAF0E7]" />

                        <div className="min-w-0 flex-1 space-y-3 pt-1">
                            <div className="h-4 w-48 max-w-full rounded-md bg-[#EAF0E7]" />

                            <div className="flex flex-wrap gap-3">
                                <div className="h-3 w-32 rounded-md bg-[#F0F3ED]" />
                                <div className="h-3 w-28 rounded-md bg-[#F0F3ED]" />
                            </div>
                        </div>

                        <div className="hidden h-7 w-32 shrink-0 rounded-full bg-[#F0F3ED] sm:block" />
                    </div>

                    {/* Description */}
                    <div className="mt-6 space-y-2">
                        <div className="h-3 w-full rounded-md bg-[#F0F3ED]" />
                        <div className="h-3 w-11/12 rounded-md bg-[#F0F3ED]" />
                        <div className="h-3 w-3/5 rounded-md bg-[#F0F3ED]" />
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex flex-col gap-4 border-t border-[#EDF2E9] pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="h-3 w-44 max-w-full rounded-md bg-[#F0F3ED]" />

                        <div className="flex gap-2">
                            <div className="h-10 w-24 rounded-xl bg-[#EAF0E7]" />
                            <div className="h-10 w-24 rounded-xl bg-[#FCEEEE]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}