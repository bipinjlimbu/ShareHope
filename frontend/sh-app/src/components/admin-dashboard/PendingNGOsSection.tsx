"use client";

import { useMemo, useState } from "react";
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Phone,
    Search,
    Users,
    X,
} from "lucide-react";
import type { NGOListItem } from "@/types/ngo";

interface PendingNGOsSectionProps {
    ngos: NGOListItem[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onViewDetails: (id: number) => void;
    onApprove: (ngo: NGOListItem) => void;
    onReject: (ngo: NGOListItem) => void;
    isSubmittingReview: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getNGOLogoUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown date";

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function getDisplayName(ngo: NGOListItem): string {
    const firstName = ngo.created_by?.first_name?.trim() ?? "";
    const lastName = ngo.created_by?.last_name?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || ngo.created_by?.username || "Unknown user";
}

function NGOLogo({ ngo }: { ngo: NGOListItem }) {
    const [imageFailed, setImageFailed] = useState(false);
    const logoUrl = getNGOLogoUrl(ngo.ngo_logo);

    return (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#E5F2E1] text-[#166534]">
            {logoUrl && !imageFailed ? (
                <img
                    src={logoUrl}
                    alt={`${ngo.name} logo`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <Building2 size={26} />
            )}
        </div>
    );
}

export default function PendingNGOsSection({
    ngos,
    searchQuery,
    onSearchChange,
    onViewDetails,
    onApprove,
    onReject,
    isSubmittingReview,
}: PendingNGOsSectionProps) {
    const filteredNGOs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return ngos;

        return ngos.filter((ngo) => {
            const searchableText = [
                ngo.name,
                ngo.registration_number,
                ngo.email,
                ngo.phone,
                ngo.address,
                getDisplayName(ngo),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [ngos, searchQuery]);

    return (
        <>
            <section className="mb-7 rounded-2xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                <div className="relative min-w-0">
                    <Search
                        size={19}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                    />

                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search NGO name, registration number, email or phone..."
                        aria-label="Search pending NGO applications"
                        className="h-12 w-full rounded-xl border border-[#DDE7D9] bg-[#FFFCF6] pl-11 pr-10 text-sm text-[#183B2A] outline-none transition placeholder:text-[#91A092] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            aria-label="Clear search"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#647568] transition hover:bg-[#E5F2E1]"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </section>

            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                    <h2 className="text-xl font-bold text-[#183B2A]">
                        Applications awaiting review
                    </h2>

                    <p className="mt-1 text-sm text-[#647568]">
                        Showing {filteredNGOs.length.toLocaleString("en-NP")} of{" "}
                        {ngos.length.toLocaleString("en-NP")} applications
                    </p>
                </div>

                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-[#DDE7D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#526B56] transition hover:bg-[#F1F7ED] sm:self-auto"
                    >
                        <X size={15} />
                        Clear search
                    </button>
                )}
            </div>

            {filteredNGOs.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                        {ngos.length === 0 ? (
                            <CheckCircle2 size={25} />
                        ) : (
                            <Search size={25} />
                        )}
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-[#183B2A]">
                        {ngos.length === 0
                            ? "No pending applications"
                            : "No matching applications"}
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                        {ngos.length === 0
                            ? "There are no NGO applications waiting for review right now."
                            : "Try another search term to find the application you need."}
                    </p>

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#124D29]"
                        >
                            Clear search
                        </button>
                    )}
                </section>
            ) : (
                <section
                    aria-label="Pending NGO applications"
                    className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 2xl:gap-8"
                >
                    {filteredNGOs.map((ngo) => (
                        <article
                            key={ngo.id}
                            className="group rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C9DFC4] hover:shadow-md sm:p-6 lg:p-7"
                        >
                            <div className="flex items-start gap-4">
                                <NGOLogo ngo={ngo} />

                                <div className="min-w-0 flex-1 pt-0.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="break-words text-lg font-bold text-[#183B2A]">
                                            {ngo.name}
                                        </h3>

                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                            <Clock3 size={13} />
                                            Pending
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm text-[#647568]">
                                        Registration No.{" "}
                                        <span className="font-medium text-[#35543B]">
                                            {ngo.registration_number || "Not provided"}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs text-[#829184]">
                                        NGO ID: #{ngo.id}
                                    </p>
                                </div>
                            </div>

                            {ngo.description && (
                                <p className="mt-5 line-clamp-3 text-sm leading-6 text-[#647568]">
                                    {ngo.description}
                                </p>
                            )}

                            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                    <Mail size={15} className="mt-0.5 shrink-0 text-[#35A45C]" />
                                    <span className="break-all">
                                        {ngo.email || "No email provided"}
                                    </span>
                                </p>

                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568]">
                                    <Phone size={15} className="mt-0.5 shrink-0 text-[#35A45C]" />
                                    <span className="break-words">
                                        {ngo.phone || "No phone provided"}
                                    </span>
                                </p>

                                <p className="flex min-w-0 items-start gap-2 text-sm text-[#647568] sm:col-span-2">
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-[#35A45C]" />
                                    <span className="break-words">
                                        {ngo.address || "No address provided"}
                                    </span>
                                </p>
                            </div>

                            <div className="my-5 border-t border-[#EDF2E9]" />

                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                <p className="flex items-center gap-2 text-sm text-[#647568]">
                                    <FileText size={15} className="shrink-0 text-[#35A45C]" />
                                    <span>
                                        {ngo.document_count ?? ngo.documents?.length ?? 0} documents
                                    </span>
                                </p>

                                <p className="flex items-center gap-2 text-sm text-[#647568]">
                                    <Users size={15} className="shrink-0 text-[#35A45C]" />
                                    <span>
                                        {ngo.membership_count ?? ngo.members?.length ?? 0} members
                                    </span>
                                </p>

                                <p className="flex items-center gap-2 text-sm text-[#647568] sm:col-span-2">
                                    <CalendarDays size={15} className="shrink-0 text-[#35A45C]" />
                                    <span>
                                        Submitted {formatDate(ngo.created_at)}
                                    </span>
                                </p>
                            </div>

                            <div className="my-5 border-t border-[#EDF2E9]" />

                            <p className="text-xs text-[#829184]">
                                Submitted by{" "}
                                <span className="font-semibold text-[#526B56]">
                                    {getDisplayName(ngo)}
                                </span>
                            </p>

                            <div className="mt-5 space-y-3">
                                <button
                                    type="button"
                                    onClick={() => onViewDetails(ngo.id)}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#124D29] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20"
                                >
                                    <Building2 size={16} />
                                    View Application
                                </button>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => onApprove(ngo)}
                                        disabled={isSubmittingReview}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8E8D4] bg-[#F5F9F2] px-4 py-3 text-sm font-semibold text-[#166534] transition hover:border-[#B9D7B2] hover:bg-[#E5F2E1] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        Approve
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onReject(ngo)}
                                        disabled={isSubmittingReview}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <X size={16} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </>
    );
}
