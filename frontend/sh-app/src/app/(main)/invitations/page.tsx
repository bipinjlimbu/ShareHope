"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
    Building2,
    CalendarDays,
    Check,
    Clock3,
    Mail,
    MapPin,
    RefreshCw,
    Search,
    ShieldCheck,
    X,
} from "lucide-react";

import { getNGOStaffInvitations } from "@/services/ngoService";

import { useToast } from "@/components/toast/ToastProvider";

import NGOStaffInvitationsDataFetchSkeleton from "@/components/skeleton/main/NGOStaffInvitationsDataFetchSkeleton";

import type {
    NGOStaffInvitationResponse,
    NGOMembershipInvitation,
} from "@/types/ngo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

function getNGOLogoUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatInvitationDate(date: string) {
    return new Date(date).toLocaleDateString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    });
}

function InvitationCard({
    invitation,
}: {
    invitation: NGOMembershipInvitation;
}) {
    const [logoFailed, setLogoFailed] = useState(false);

    const ngo = invitation.ngo;
    const logoUrl = getNGOLogoUrl(ngo.ngo_logo);

    useEffect(() => {
        setLogoFailed(false);
    }, [ngo.ngo_logo]);

    return (
        <article className="rounded-2xl border border-[#E3EDE0] bg-white p-5 shadow-[0_2px_12px_rgba(24,59,42,0.035)] transition hover:border-[#C9DFC5] hover:shadow-[0_8px_24px_rgba(24,59,42,0.06)] sm:p-6">
            <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-[#E3EDE0] bg-[#EDF5EC]">
                        {logoUrl && !logoFailed ? (
                            <img
                                src={logoUrl}
                                alt={`${ngo.name} logo`}
                                className="h-full w-full object-cover"
                                onError={() => setLogoFailed(true)}
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E5F2E1] via-[#F0F7ED] to-[#D8EBD3]">
                                <Building2
                                    size={30}
                                    strokeWidth={1.4}
                                    className="text-[#166534]/50"
                                    aria-label="Organization logo unavailable"
                                />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="break-words text-base font-bold text-[#183B2A] sm:text-lg">
                                {ngo.name}
                            </h2>

                            <ShieldCheck
                                size={16}
                                className="shrink-0 text-[#29904C]"
                            />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#718174]">
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin size={13} />
                                {ngo.address}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays size={13} />
                                {formatInvitationDate(invitation.invited_at)}
                            </span>
                        </div>
                    </div>

                    <span className="hidden items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:inline-flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Pending response
                    </span>
                </div>

                <p className="text-sm leading-6 text-[#647568]">
                    {ngo.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF2E9] pt-4">
                    <div className="flex min-w-0 items-center gap-2 text-xs text-[#718174]">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{ngo.email}</span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 sm:hidden">
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        Pending response
                    </span>

                    <div className="flex w-full gap-2 sm:w-auto">
                        <button
                            type="button"
                            disabled
                            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white opacity-50 sm:flex-none"
                            title="Accept functionality will be available soon"
                        >
                            <Check size={16} />
                            Accept
                        </button>

                        <button
                            type="button"
                            disabled
                            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 opacity-50 sm:flex-none"
                            title="Decline functionality will be available soon"
                        >
                            <X size={16} />
                            Decline
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function InvitationsPage() {
    const { showToast } = useToast();

    const [invitations, setInvitations] =
        useState<NGOStaffInvitationResponse>([]);

    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const response = await getNGOStaffInvitations();

            setInvitations(
                Array.isArray(response) ? response : []
            );
        } catch (err: unknown) {
            console.error("Failed to fetch NGO invitations:", err);

            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Unable to load your invitations. Please try again.";

            setError(errorMessage);
            showToast(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        void fetchInvitations();
    }, [fetchInvitations]);

    const query = search.trim().toLowerCase();

    const filteredInvitations = useMemo(() => {
        return invitations.filter((invitation) => {
            if (!query) return true;

            const ngo = invitation.ngo;

            return [
                ngo.name,
                ngo.registration_number,
                ngo.email,
                ngo.address,
            ].some((value) => value?.toLowerCase().includes(query));
        });
    }, [invitations, query]);

    const totalInvitations = invitations.length;

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <header className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-sm font-semibold text-[#166534]">
                        <Mail size={16} />
                        Your Invitations
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                        Connect with Organizations
                        <span className="block text-[#29904C]">
                            Make a Difference Together
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647568] sm:text-base">
                        Explore invitations from NGOs and discover
                        opportunities to become part of meaningful
                        community work.
                    </p>
                </header>

                {/* Summary Cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-2xl border border-[#E3EDE0] bg-white p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDF5EC] text-[#166534]">
                            <Mail size={21} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[#718174]">
                                Total invitations
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#183B2A]">
                                {isLoading ? "—" : totalInvitations}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-2xl border border-[#E3EDE0] bg-white p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 size={21} />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-[#718174]">
                                Pending invitations
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#183B2A]">
                                {isLoading ? "—" : totalInvitations}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Search */}
                <section className="mb-6 rounded-2xl border border-[#E3EDE0] bg-white p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search NGO invitations..."
                                aria-label="Search NGO invitations"
                                className="h-11 w-full rounded-xl border border-[#DDE7DC] bg-[#FFFEFB] pl-10 pr-4 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA69B] focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs text-[#829184]">
                                {isLoading
                                    ? "Loading invitations..."
                                    : `Showing ${filteredInvitations.length} of ${totalInvitations} invitations`}
                            </p>

                            <button
                                type="button"
                                onClick={() => void fetchInvitations()}
                                disabled={isLoading}
                                title="Refresh invitations"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#DDE7DC] text-[#647568] transition hover:border-[#29904C] hover:bg-[#F0F7ED] hover:text-[#166534] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={15}
                                    className={isLoading ? "animate-spin" : ""}
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Invitation List */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#183B2A] sm:text-lg">
                            Your invitations
                        </h2>

                        <span className="text-xs text-[#829184]">
                            Newest first
                        </span>
                    </div>

                    {error ? (
                        <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Mail size={28} />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-[#183B2A]">
                                Invitations are temporarily unavailable
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                Please try loading your invitations again.
                            </p>

                            <button
                                type="button"
                                onClick={() => void fetchInvitations()}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                            >
                                <RefreshCw size={15} />
                                Try again
                            </button>
                        </div>
                    ) : isLoading ? (
                        <NGOStaffInvitationsDataFetchSkeleton />
                    ) : filteredInvitations.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                {query ? (
                                    <Search size={28} />
                                ) : (
                                    <Building2 size={28} />
                                )}
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-[#183B2A]">
                                {query
                                    ? "No matching invitations"
                                    : "No invitations yet"}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {query
                                    ? "Try a different search term to find an invitation."
                                    : "You haven't received any NGO invitations yet. New invitations will appear here."}
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
                        <div className="space-y-4">
                            {filteredInvitations.map((invitation) => (
                                <InvitationCard
                                    key={invitation.id}
                                    invitation={invitation}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Footer Note */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#DCEBDD] bg-[#F1F7EF] p-4">
                    <ShieldCheck
                        size={19}
                        className="mt-0.5 shrink-0 text-[#29904C]"
                    />

                    <p className="text-xs leading-5 text-[#647568]">
                        Review an organization's information before joining.
                        Your participation helps build a stronger and more
                        transparent community.
                    </p>
                </div>
            </div>
        </main>
    );
}