interface NavbarDataFetchSkeletonProps {
    mobile?: boolean;
}

export default function NavbarDataFetchSkeleton({
    mobile = false,
}: NavbarDataFetchSkeletonProps) {
    if (mobile) {
        return (
            <div className="mt-3 animate-pulse rounded-xl border border-[#E6EDE4] bg-white p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#E5F2E1]" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-20 rounded bg-[#E5F2E1]" />
                        <div className="h-4 w-32 max-w-full rounded bg-[#EDF6E9]" />
                    </div>
                </div>
                <div className="mt-4 h-10 w-full rounded-xl bg-[#EDF6E9]" />
            </div>
        );
    }

    return (
        <div className="flex animate-pulse items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E5F2E1]" />
            <div className="h-4 w-24 rounded bg-[#EDF6E9]" />
            <div className="h-10 w-20 rounded-xl bg-[#E5F2E1]" />
        </div>
    );
}
