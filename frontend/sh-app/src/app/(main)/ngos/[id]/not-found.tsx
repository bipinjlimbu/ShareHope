import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NGODetailsNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FFFCF6] px-4 py-16">
            <div className="w-full max-w-lg rounded-3xl border border-[#E5EBDD] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF6E9] text-[#166534]">
                    <Building2 size={30} />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-[#183B2A]">
                    Organization not found
                </h1>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                    The organization you are looking for does not exist or
                    may no longer be available.
                </p>

                <Link
                    href="/ngos"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-6 py-3 font-semibold text-white transition hover:bg-[#14532D]"
                >
                    <ArrowLeft size={18} />
                    Explore organizations
                </Link>
            </div>
        </main>
    );
}