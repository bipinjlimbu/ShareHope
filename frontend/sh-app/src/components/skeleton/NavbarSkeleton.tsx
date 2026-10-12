export default function NavbarSkeleton() {
    return (
        <header
            className="sticky top-0 z-50 border-b border-[#E6EDE4] bg-[#FFFCF6]/95 backdrop-blur-xl"
            aria-label="Loading navigation"
        >
            <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
                <div className="flex shrink-0 items-center gap-2.5">
                    <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#E4F1E4]" />
                    <div className="h-6 w-28 animate-pulse rounded-md bg-[#E4F1E4]" />
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    <div className="h-4 w-11 animate-pulse rounded-md bg-[#E4F1E4]" />
                    <div className="h-4 w-20 animate-pulse rounded-md bg-[#E4F1E4]" />
                    <div className="h-4 w-10 animate-pulse rounded-md bg-[#E4F1E4]" />
                    <div className="h-4 w-12 animate-pulse rounded-md bg-[#E4F1E4]" />
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <div className="h-10 w-28 animate-pulse rounded-xl bg-[#E4F1E4]" />
                    <div className="h-11 w-24 animate-pulse rounded-xl bg-[#D5E8D5]" />
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE7DC] bg-[#F2F6EF] md:hidden">
                    <div className="h-5 w-5 animate-pulse rounded-md bg-[#DDE7DC]" />
                </div>
            </div>
        </header>
    );
}