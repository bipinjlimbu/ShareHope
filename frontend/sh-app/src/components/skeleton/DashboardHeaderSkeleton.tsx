export default function DashboardHeaderSkeleton() {
    return (
        <header
            aria-label="Loading dashboard header"
            aria-busy="true"
            className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E6EDE4] bg-[#FFFCF6]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
        >
            <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl border border-[#E1E9DC] bg-[#E5F2E1] md:hidden" />

                <div className="min-w-0 space-y-2">
                    <div className="h-3.5 w-36 max-w-full animate-pulse rounded bg-[#D6E7D1]" />

                    <div className="h-4 w-44 max-w-[45vw] animate-pulse rounded bg-[#E1E9DC]" />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#E5F2E1] ring-1 ring-[#D6E7D1]" />

                <div className="hidden space-y-2 sm:block">
                    <div className="h-3.5 w-24 animate-pulse rounded bg-[#D6E7D1]" />

                    <div className="h-3 w-20 animate-pulse rounded bg-[#E1E9DC]" />
                </div>

                <div className="hidden h-4 w-4 animate-pulse rounded bg-[#E1E9DC] sm:block" />
            </div>
        </header>
    );
}