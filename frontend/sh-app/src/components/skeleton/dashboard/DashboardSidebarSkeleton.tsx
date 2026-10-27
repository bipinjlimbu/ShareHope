import Image from "next/image";
import NavLogo from "@/images/NavLogo.png";

export default function DashboardSidebarSkeleton() {
    return (
        <aside
            aria-label="Loading dashboard navigation"
            aria-busy="true"
            className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-[#E6EDE4] bg-[#FFFCF6] md:flex"
        >
            <div className="flex h-20 items-center border-b border-[#E6EDE4] px-5">
                <Image
                    src={NavLogo}
                    alt="ShareHope"
                    priority
                    className="h-auto w-36 object-contain"
                />
            </div>

            <div className="border-b border-[#E6EDE4] px-5 py-5">
                <div className="flex items-center gap-3 rounded-xl border border-[#E5F2E1] bg-[#EDF6E9] p-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#C9E3C5]" />

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3.5 w-20 animate-pulse rounded bg-[#C9E3C5]" />
                        <div className="h-3 w-28 max-w-full animate-pulse rounded bg-[#D8EAD3]" />
                    </div>
                </div>
            </div>

            <nav
                aria-label="Loading navigation items"
                className="flex-1 space-y-1 overflow-hidden px-3 py-5"
            >
                <div className="mb-3 px-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-[#E1E9DC]" />
                </div>

                {Array.from({ length: 7 }, (_, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 ${index === 0 ? "bg-[#E5F2E1]" : ""
                            }`}
                    >
                        <div className="h-[19px] w-[19px] shrink-0 animate-pulse rounded-md bg-[#D6E7D1]" />

                        <div
                            className="h-3.5 animate-pulse rounded bg-[#E1E9DC]"
                            style={{
                                width: `${92 + (index % 3) * 16}px`,
                            }}
                        />
                    </div>
                ))}
            </nav>

            <div className="border-t border-[#E6EDE4] p-4">
                <div className="rounded-xl border border-[#E6EDE4] bg-white p-3">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#C9E3C5]" />
                        <div className="h-3 w-40 max-w-full animate-pulse rounded bg-[#E1E9DC]" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
