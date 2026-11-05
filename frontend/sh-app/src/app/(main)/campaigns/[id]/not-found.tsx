import Link from "next/link";
import { ArrowLeft, ArrowRight, HeartHandshake, SearchX } from "lucide-react";

export default function CampaignNotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF6]">
            <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20">
                {/* Background decorations */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#E5F2E1]/60 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#E5F2E1]/60 blur-3xl" />

                <div className="relative mx-auto w-full max-w-2xl text-center">
                    {/* Illustration */}
                    <div className="relative mx-auto mb-9 flex h-48 w-48 items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-[#D5E8D1]" />
                        <div className="absolute inset-5 rounded-full border border-dashed border-[#B8D8B5]" />

                        <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-[#E5F2E1] text-[#166534] shadow-inner">
                            <SearchX size={62} strokeWidth={1.5} />
                        </div>

                        <span className="absolute -right-1 top-5 rounded-full bg-[#166534] px-4 py-2 text-sm font-bold text-white shadow-lg">
                            404
                        </span>

                        <span className="absolute -bottom-1 left-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D5E8D1] bg-white text-[#29904C] shadow-md">
                            <HeartHandshake size={25} />
                        </span>
                    </div>

                    {/* Content */}
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#29904C]">
                        Campaign Not Found
                    </p>

                    <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-5xl">
                        This campaign seems to have{" "}
                        <span className="text-[#29904C]">disappeared.</span>
                    </h1>

                    <p className="mx-auto mb-9 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
                        The campaign you are looking for may no longer exist,
                        may have been removed, or the link might be incorrect.
                        Don't worry, there are other meaningful causes waiting
                        for your support.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/campaigns"
                            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#14532D] hover:shadow-xl sm:w-auto"
                        >
                            Explore Campaigns
                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#D5E8D1] bg-white/70 px-7 py-3.5 text-sm font-bold text-[#183B2A] transition-all duration-300 hover:-translate-y-1 hover:border-[#166534] hover:bg-[#E5F2E1] sm:w-auto"
                        >
                            <ArrowLeft size={18} />
                            Back to Home
                        </Link>
                    </div>

                    {/* Bottom note */}
                    <div className="mt-14 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <HeartHandshake size={17} className="text-[#29904C]" />
                        Every contribution creates a little more hope.
                    </div>
                </div>
            </main>
        </div>
    );
}
