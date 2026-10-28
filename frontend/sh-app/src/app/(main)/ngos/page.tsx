"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    Building2,
    Mail,
    MapPin,
    RefreshCw,
    Search,
} from "lucide-react";
import { getNGOs } from "@/services/ngoService";
import type { NGOListItem } from "@/types/ngo";
import NGOsSkeleton from "@/components/skeleton/main/NGOsSkeleton";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

function getNGOLogoUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getApprovedActiveNGOs(ngos: NGOListItem[]): NGOListItem[] {
    return ngos.filter(
        (ngo) =>
            ngo.status?.toUpperCase() === "APPROVED" &&
            ngo.is_active === true
    );
}

export default function NGOsPage() {
    const [ngos, setNgos] = useState<NGOListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNGOs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getNGOs();

            setNgos(
                getApprovedActiveNGOs(
                    Array.isArray(response) ? response : []
                )
            );
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "We couldn't load the NGOs. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadNGOs();
    }, [loadNGOs]);

    const query = search.trim().toLowerCase();

    const filteredNGOs = ngos.filter((ngo) => {
        if (!query) return true;

        return [
            ngo.name,
            ngo.registration_number,
            ngo.email,
            ngo.address,
        ].some((value) => value?.toLowerCase().includes(query));
    });

    if (loading) {
        return <NGOsSkeleton />;
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                <header className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-sm font-semibold text-[#166534]">
                        <Building2 size={16} />
                        Our NGO Partners
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                        Meet the Organizations
                        <span className="block text-[#29904C]">
                            Making a Difference
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647568] sm:text-base">
                        Discover verified organizations working to create
                        positive change in our communities.
                    </p>
                </header>

                <div className="mx-auto mb-10 max-w-2xl">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829184]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search organizations..."
                            aria-label="Search organizations"
                            className="h-12 w-full rounded-2xl border border-[#DDE7D9] bg-white pl-12 pr-4 text-sm text-[#183B2A] shadow-sm outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                        />
                    </div>
                </div>

                {error ? (
                    <div
                        role="alert"
                        className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
                    >
                        <AlertCircle
                            size={28}
                            className="mx-auto text-red-600"
                        />

                        <h2 className="mt-3 font-bold text-red-800">
                            Unable to load organizations
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-red-700">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => void loadNGOs()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                ) : filteredNGOs.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                            <Building2 size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#183B2A]">
                            {query
                                ? "No matching organizations"
                                : "No organizations available yet"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                            {query
                                ? "Try a different search term to find an organization."
                                : "Approved and active NGO partners will appear here."}
                        </p>

                        {query && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-[#183B2A] sm:text-xl">
                                Explore Organizations
                            </h2>

                            <span className="shrink-0 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                                {filteredNGOs.length}{" "}
                                {filteredNGOs.length === 1
                                    ? "organization"
                                    : "organizations"}
                            </span>
                        </div>

                        <section
                            aria-label="Approved and active NGOs"
                            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {filteredNGOs.map((ngo) => (
                                <NGOCard key={ngo.id} ngo={ngo} />
                            ))}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}

function NGOCard({ ngo }: { ngo: NGOListItem }) {
    const [logoFailed, setLogoFailed] = useState(false);
    const logoUrl = getNGOLogoUrl(ngo.ngo_logo);

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#E5EDE3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9DFC4] hover:shadow-xl">
            <div className="relative h-52 w-full overflow-hidden bg-[#E5F2E1] sm:h-56">
                {logoUrl && !logoFailed ? (
                    <img
                        src={logoUrl}
                        alt={`${ngo.name} logo`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setLogoFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E5F2E1] via-[#F0F7ED] to-[#D8EBD3]">
                        <Building2
                            size={64}
                            strokeWidth={1.2}
                            className="text-[#166534]/50"
                            aria-label="Organization logo unavailable"
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#183B2A]/40 via-transparent to-black/5" />

                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-bold text-[#166534] shadow-sm backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#29904C]" />
                    Verified NGO
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="min-w-0">
                    <h2 className="break-words text-xl font-bold leading-7 text-[#183B2A] transition-colors group-hover:text-[#166534]">
                        {ngo.name}
                    </h2>

                    {ngo.registration_number && (
                        <p className="mt-1.5 break-words text-xs font-medium text-[#829184]">
                            Registration No. {ngo.registration_number}
                        </p>
                    )}
                </div>

                <div className="mt-5 grid flex-1 grid-cols-2 gap-4 border-t border-[#EDF2E9] pt-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[#29904C]">
                            <Mail size={15} className="shrink-0" />
                            <span className="text-xs font-semibold text-[#526B56]">
                                Email
                            </span>
                        </div>

                        <p
                            className="mt-2 break-words text-sm leading-5 text-[#526B56]"
                            title={ngo.email || "Email not provided"}
                        >
                            {ngo.email || "Not provided"}
                        </p>
                    </div>

                    <div className="min-w-0 border-l border-[#EDF2E9] pl-4">
                        <div className="flex items-center gap-1.5 text-[#29904C]">
                            <MapPin size={15} className="shrink-0" />
                            <span className="text-xs font-semibold text-[#526B56]">
                                Address
                            </span>
                        </div>

                        <p
                            className="mt-2 line-clamp-2 break-words text-sm leading-5 text-[#526B56]"
                            title={ngo.address || "Address not provided"}
                        >
                            {ngo.address || "Not provided"}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}