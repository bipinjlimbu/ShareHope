export default function CampaignsDataFetchSkeleton() {
    return (
        <section
            aria-label="Loading campaigns"
            aria-busy="true"
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
            {Array.from({ length: 6 }).map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white"
                >
                    <div className="h-56 bg-[#E5EDE3] sm:h-64" />

                    <div className="flex flex-col p-5 sm:p-7">
                        <div className="h-4 w-2/5 rounded bg-[#E5EDE3]" />

                        <div className="mt-3 h-7 w-4/5 rounded bg-[#E5EDE3]" />

                        <div className="mt-5 h-24 w-full rounded-xl bg-[#E5EDE3]" />

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-32 rounded bg-[#E5EDE3]" />
                                <div className="h-3 w-10 rounded bg-[#E5EDE3]" />
                            </div>

                            <div className="h-2 w-full rounded-full bg-[#E5EDE3]" />

                            <div className="h-3 w-36 rounded bg-[#E5EDE3]" />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#EDF2E9] pt-4">
                            <div className="space-y-2">
                                <div className="h-3 w-16 rounded bg-[#E5EDE3]" />
                                <div className="h-4 w-24 rounded bg-[#E5EDE3]" />
                            </div>

                            <div className="space-y-2 border-l border-[#EDF2E9] pl-3">
                                <div className="h-3 w-16 rounded bg-[#E5EDE3]" />
                                <div className="h-4 w-24 rounded bg-[#E5EDE3]" />
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-3 border-t border-[#EDF2E9] pt-4">
                            <div className="h-9 w-9 shrink-0 rounded-full bg-[#E5EDE3]" />

                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-20 rounded bg-[#E5EDE3]" />
                                <div className="h-4 w-36 max-w-full rounded bg-[#E5EDE3]" />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </section>
    );
}