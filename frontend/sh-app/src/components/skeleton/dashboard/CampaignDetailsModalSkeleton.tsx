export default function CampaignDetailsModalSkeleton() {
    return (
        <div className="animate-pulse space-y-7">
            {/* Campaign status */}
            <section className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="h-3 w-24 rounded bg-[#DDE8D7]" />
                        <div className="mt-3 h-7 w-28 rounded-full bg-[#DDE8D7]" />
                    </div>

                    <div className="h-4 w-44 rounded bg-[#DDE8D7]" />
                </div>
            </section>

            {/* Campaign image - 16:9 */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-[#DDE8D7] bg-[#E5F2E1]">
                <div className="h-full w-full bg-[#DDE8D7]" />
            </div>

            {/* Campaign information */}
            <section>
                <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DDE8D7]" />

                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-44 rounded bg-[#DDE8D7]" />
                        <div className="h-3 w-64 max-w-full rounded bg-[#E8EDE4]" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="min-w-0 rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <div className="h-3 w-28 rounded bg-[#E8EDE4]" />
                            <div className="mt-3 h-5 w-3/4 rounded bg-[#DDE8D7]" />
                        </div>
                    ))}

                    <div className="sm:col-span-2 rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                        <div className="h-3 w-24 rounded bg-[#E8EDE4]" />
                        <div className="mt-3 space-y-2">
                            <div className="h-4 w-full rounded bg-[#DDE8D7]" />
                            <div className="h-4 w-11/12 rounded bg-[#DDE8D7]" />
                            <div className="h-4 w-2/3 rounded bg-[#DDE8D7]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Campaign goals and progress */}
            <section>
                <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DDE8D7]" />

                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-52 rounded bg-[#DDE8D7]" />
                        <div className="h-3 w-72 max-w-full rounded bg-[#E8EDE4]" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <div className="h-3 w-28 rounded bg-[#E8EDE4]" />
                            <div className="mt-3 h-5 w-40 max-w-full rounded bg-[#DDE8D7]" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Campaign timeline */}
            <section>
                <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DDE8D7]" />

                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-40 rounded bg-[#DDE8D7]" />
                        <div className="h-3 w-64 max-w-full rounded bg-[#E8EDE4]" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <div className="h-3 w-24 rounded bg-[#E8EDE4]" />
                            <div className="mt-3 h-5 w-36 rounded bg-[#DDE8D7]" />
                        </div>
                    ))}

                    <div className="sm:col-span-2 rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                        <div className="h-3 w-28 rounded bg-[#E8EDE4]" />
                        <div className="mt-3 h-5 w-40 rounded bg-[#DDE8D7]" />
                    </div>
                </div>
            </section>

            {/* Associated NGO */}
            <section>
                <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DDE8D7]" />

                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-36 rounded bg-[#DDE8D7]" />
                        <div className="h-3 w-72 max-w-full rounded bg-[#E8EDE4]" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <div className="h-3 w-32 rounded bg-[#E8EDE4]" />
                            <div className="mt-3 h-5 w-3/4 rounded bg-[#DDE8D7]" />
                        </div>
                    ))}

                    <div className="sm:col-span-2 rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                        <div className="h-3 w-24 rounded bg-[#E8EDE4]" />
                        <div className="mt-3 h-5 w-2/3 rounded bg-[#DDE8D7]" />
                    </div>
                </div>
            </section>

            {/* Record ownership and review */}
            <section>
                <div className="mb-4 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#DDE8D7]" />

                    <div className="flex-1 space-y-2">
                        <div className="h-5 w-56 rounded bg-[#DDE8D7]" />
                        <div className="h-3 w-80 max-w-full rounded bg-[#E8EDE4]" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4"
                        >
                            <div className="h-3 w-20 rounded bg-[#E8EDE4]" />
                            <div className="mt-3 h-5 w-36 max-w-full rounded bg-[#DDE8D7]" />
                            <div className="mt-2 h-3 w-44 max-w-full rounded bg-[#E8EDE4]" />
                            <div className="mt-2 h-3 w-28 rounded bg-[#E8EDE4]" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
