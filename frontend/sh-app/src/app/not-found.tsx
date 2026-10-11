import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-6 py-16">
            <div className="w-full max-w-lg text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E5F2E1] text-[#166534]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 15s1.5-2 4-2 4 2 4 2" />
                        <path d="M9 9h.01M15 9h.01" />
                    </svg>
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-[#35A45C]">
                    Error 404
                </p>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#183B2A] sm:text-5xl">
                    Page not found
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#647568]">
                    We couldn&apos;t find the page you&apos;re looking for. It may have
                    been moved, removed, or the address may be incorrect.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-[#166534] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Back to Home
                    </Link>

                    <Link
                        href="/campaigns"
                        className="inline-flex items-center justify-center rounded-xl border border-[#D8E5D5] bg-white px-6 py-3.5 text-sm font-semibold text-[#166534] transition hover:border-[#35A45C] hover:bg-[#F2F8EF]"
                    >
                        Explore Campaigns
                    </Link>
                </div>

                <div className="mt-14 border-t border-[#E6EDE4] pt-6">
                    <p className="text-sm text-[#647568]">
                        Every small act of kindness matters.
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#166534]">
                        ShareHope
                    </p>
                </div>
            </div>
        </main>
    );
}