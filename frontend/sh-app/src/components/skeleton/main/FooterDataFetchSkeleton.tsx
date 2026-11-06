export default function FooterDataFetchSkeleton() {
    return (
        <div className="mt-5 animate-pulse">
            {/* Profile skeleton */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-white/15" />

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3 w-20 rounded bg-white/15" />
                    <div className="h-4 w-28 max-w-full rounded bg-white/20" />
                </div>
            </div>

            {/* Account links skeleton */}
            <div className="mt-5 space-y-4">
                <div className="h-3 w-24 rounded bg-white/15" />
                <div className="h-3 w-20 rounded bg-white/15" />
            </div>
        </div>
    );
}
