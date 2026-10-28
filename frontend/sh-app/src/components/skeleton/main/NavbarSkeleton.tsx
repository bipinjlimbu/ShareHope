import Image from "next/image";
import NavLogo from "@/images/NavLogo.png";

export default function NavbarSkeleton() {
    return (
        <header
            aria-label="Loading navigation"
            aria-busy="true"
            className="sticky top-0 z-50 border-b border-[#E6EDE4] bg-[#FFFCF6]/95 backdrop-blur-xl"
        >
            <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
                <div className="flex shrink-0 items-center">
                    <Image
                        src={NavLogo}
                        alt="ShareHope"
                        priority
                        className="h-auto w-[170px] object-contain sm:w-[190px]"
                    />
                </div>

                <nav
                    aria-hidden="true"
                    className="hidden items-center gap-8 md:flex"
                >
                    {["Home", "Campaigns", "NGOs", "About"].map((label) => (
                        <div
                            key={label}
                            className="text-sm font-medium text-[#536458]"
                        >
                            {label}
                        </div>
                    ))}
                </nav>

                <div
                    aria-hidden="true"
                    className="hidden items-center gap-3 md:flex"
                >
                    <div className="h-10 w-24 animate-pulse rounded-xl bg-[#E6EDE4]" />
                    <div className="h-11 w-28 animate-pulse rounded-xl bg-[#DDE7DC]" />
                </div>

                <div
                    aria-hidden="true"
                    className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl border border-[#DDE7DC] bg-[#F2F8EF] md:hidden"
                >
                    <div className="h-5 w-5 rounded-md bg-[#DDE7DC]" />
                </div>
            </div>
        </header>
    );
}