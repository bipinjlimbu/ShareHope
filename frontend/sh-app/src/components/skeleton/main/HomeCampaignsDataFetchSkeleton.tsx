function CampaignCardSkeleton() {
    return (
        <div className="flex min-w-0 animate-pulse flex-col overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white shadow-sm">
            {/* Campaign image */}
            <div className="relative h-56 w-full bg-[#E5F2E1] sm:h-64">
                <div className="absolute left-4 top-4 h-7 w-32 rounded-full bg-white/80" />
                <div className="absolute bottom-4 left-4 h-6 w-24 rounded-full bg-white/60" />
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-7">
                {/* Donation type */}
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#E5EDE3]" />
                    <div className="h-3 w-28 rounded bg-[#E5EDE3]" />
                </div>

                {/* Campaign title */}
                <div className="mt-4 space-y-2">
                    <div className="h-6 w-full rounded-lg bg-[#E5EDE3]" />
                    <div className="h-6 w-3/4 rounded-lg bg-[#E5EDE3]" />
                </div>

                {/* Campaign goal */}
                <div className="mt-5 rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                    <div className="h-3 w-28 rounded bg-[#DCE8D8]" />
                    <div className="mt-3 h-5 w-36 rounded bg-[#DCE8D8]" />
                </div>

                {/* Collection progress */}
                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <div className="h-3 w-32 rounded bg-[#E5EDE3]" />
                        <div className="h-3 w-10 rounded bg-[#E5EDE3]" />
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5EDE3]" />

                    <div className="mt-3 h-3 w-32 rounded bg-[#E5EDE3]" />
                </div>

                {/* Dates */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EDF2E9] pt-4">
                    <div>
                        <div className="h-3 w-14 rounded bg-[#E5EDE3]" />
                        <div className="mt-3 h-4 w-24 rounded bg-[#E5EDE3]" />
                    </div>

                    <div className="border-l border-[#EDF2E9] pl-3">
                        <div className="h-3 w-14 rounded bg-[#E5EDE3]" />
                        <div className="mt-3 h-4 w-24 rounded bg-[#E5EDE3]" />
                    </div>
                </div>

                {/* NGO information */}
                <div className="mt-auto border-t border-[#EDF2E9] pt-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-[#E5EDE3]" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-16 rounded bg-[#E5EDE3]" />
                            <div className="h-4 w-32 max-w-full rounded bg-[#E5EDE3]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomeCampaignsDataFetchSkeleton() {
    return (
        <div
            aria-label="Loading campaigns"
            aria-live="polite"
            role="status"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            {Array.from({ length: 3 }).map((_, index) => (
                <CampaignCardSkeleton key={index} />
            ))}

            <span className="sr-only">Loading campaigns...</span>
        </div>
    );
}