"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Flag,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    ShieldCheck,
    Users,
} from "lucide-react";

import { getNGOById } from "@/services/ngoService";
import { getProfile } from "@/services/profileService";
import { getAuthStatus } from "@/lib/authStatus";

import type { NGOListItem } from "@/types/ngo";

type Viewer = {
    id: number;
    role: string;
};

type ViewerStatus = "loading" | "ready";

function getImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    if (!apiUrl) return path;

    return `${apiUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(date: string): string {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat("en-NP", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kathmandu",
    }).format(parsedDate);
}

function getInitial(name: string): string {
    return name.trim().charAt(0).toUpperCase() || "N";
}

export default function NGODetailsPage() {
    const params = useParams<{ id: string }>();
    const ngoId = Number(params.id);

    const [ngo, setNgo] = useState<NGOListItem | null>(null);
    const [isNGOLoading, setIsNGOLoading] = useState(true);
    const [ngoError, setNgoError] = useState("");

    const [viewer, setViewer] = useState<Viewer | null>(null);
    const [viewerStatus, setViewerStatus] =
        useState<ViewerStatus>("loading");

    const loadViewer = useCallback(async () => {
        if (!getAuthStatus()) {
            setViewer(null);
            setViewerStatus("ready");
            return;
        }

        setViewerStatus("loading");

        try {
            const profile = await getProfile();

            setViewer({
                id: Number(profile.user.id),
                role: profile.user.role,
            });
        } catch {
            setViewer({
                id: -1,
                role: "UNKNOWN",
            });
        } finally {
            setViewerStatus("ready");
        }
    }, []);

    useEffect(() => {
        let active = true;

        async function loadNGO() {
            if (!Number.isInteger(ngoId) || ngoId <= 0) {
                setNgoError("The organization link is invalid.");
                setIsNGOLoading(false);
                return;
            }

            setIsNGOLoading(true);
            setNgoError("");

            try {
                const response = await getNGOById(ngoId);

                if (active) {
                    setNgo(response);
                }
            } catch {
                if (active) {
                    setNgoError(
                        "We couldn't load this organization. It may have been removed or is temporarily unavailable."
                    );
                }
            } finally {
                if (active) {
                    setIsNGOLoading(false);
                }
            }
        }

        void loadNGO();
        void loadViewer();

        const handleAuthChange = () => {
            void loadViewer();
        };

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            active = false;
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [ngoId, loadViewer]);

    const ngoLogo = useMemo(
        () => getImageUrl(ngo?.ngo_logo ?? null),
        [ngo?.ngo_logo]
    );

    if (isNGOLoading) {
        return (
            <main className="min-h-screen bg-[#FFFCF6] pb-20">
                <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                    <div className="h-10 w-44 animate-pulse rounded-full bg-[#E5F2E1]" />

                    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
                        <section>
                            <div className="h-48 animate-pulse rounded-3xl bg-[#E5F2E1] sm:h-56" />

                            <div className="mt-8 h-9 w-3/4 animate-pulse rounded-xl bg-[#E5F2E1]" />
                            <div className="mt-5 h-4 w-full animate-pulse rounded bg-[#E5F2E1]" />
                            <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-[#E5F2E1]" />

                            <div className="mt-10 h-64 animate-pulse rounded-3xl border border-[#E5EBDD] bg-white" />
                            <div className="mt-8 h-72 animate-pulse rounded-3xl border border-[#E5EBDD] bg-white" />
                        </section>

                        <aside className="space-y-6">
                            <div className="h-72 animate-pulse rounded-3xl border border-[#E5EBDD] bg-white" />
                            <div className="h-56 animate-pulse rounded-3xl border border-[#E5EBDD] bg-white" />
                        </aside>
                    </div>
                </div>
            </main>
        );
    }

    if (ngoError || !ngo) {
        return (
            <main className="min-h-screen bg-[#FFFCF6] px-4 py-16">
                <div className="mx-auto w-full max-w-lg rounded-3xl border border-[#E5EBDD] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF6E9] text-[#166534]">
                        <Building2 size={30} />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-[#183B2A]">
                        Organization unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        {ngoError || "This organization could not be found."}
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

    const ngoAdmin = ngo.created_by;

    const adminFullName = [
        ngoAdmin.first_name,
        ngoAdmin.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    const isOwnNGO =
        viewerStatus === "ready" &&
        viewer?.role === "NGO_ADMIN" &&
        viewer.id === ngo.created_by.id;

    const isVerified = ngo.status === "APPROVED";

    return (
        <main className="min-h-screen bg-[#FFFCF6] pb-20">
            {/* Back navigation */}
            <div className="bg-[#FFFCF6]">
                <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                    <Link
                        href="/ngos"
                        className="inline-flex items-center gap-2 rounded-full border border-[#DCE8D8] bg-[#EDF6E9] px-4 py-2.5 text-sm font-semibold text-[#166534] transition hover:border-[#166534] hover:bg-[#E5F2E1]"
                    >
                        <ArrowLeft size={17} />
                        Back to organizations
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
                <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
                    {/* Main NGO information */}
                    <section>
                        {/* NGO identity - no cover image */}
                        <div className="rounded-3xl border border-[#E5EBDD] bg-white p-6 shadow-sm sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-[#E5EBDD] bg-[#EDF6E9] sm:h-36 sm:w-36">
                                    {ngoLogo ? (
                                        <img
                                            src={ngoLogo}
                                            alt={ngo.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Building2
                                            size={54}
                                            className="text-[#166534]"
                                        />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${isVerified
                                                ? "bg-[#E5F2E1] text-[#166534]"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {ngo.status}
                                        </span>

                                        {ngo.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF6E9] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#29904C]" />
                                                Active organization
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                                                Inactive organization
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl">
                                        {ngo.name}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays
                                                size={15}
                                                className="text-[#29904C]"
                                            />
                                            Joined {formatDate(ngo.created_at)}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5">
                                            <Users
                                                size={15}
                                                className="text-[#29904C]"
                                            />
                                            {Number(
                                                ngo.membership_count ?? 0
                                            ).toLocaleString("en-NP")}{" "}
                                            members
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 border-t border-[#E5EBDD] pt-6">
                                <h2 className="text-sm font-bold uppercase tracking-wide text-[#166534]">
                                    About the organization
                                </h2>

                                <p className="mt-3 whitespace-pre-line text-base leading-8 text-gray-600">
                                    {ngo.description ||
                                        "This organization is working to make a positive difference in the community."}
                                </p>
                            </div>

                            {/* Chat and report - UI only */}
                            <div className="mt-7 grid gap-3 border-t border-[#E5EBDD] pt-6 sm:grid-cols-2">
                                <button
                                    type="button"
                                    disabled
                                    title="Live chat is coming soon"
                                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-[#166534] px-5 py-3.5 font-bold text-white opacity-70"
                                >
                                    <MessageCircle size={19} />
                                    Chat with NGO
                                    <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                                        Soon
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    disabled
                                    title="NGO reporting is coming soon"
                                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-[#E5EBDD] bg-[#FFFCF6] px-5 py-3.5 font-bold text-gray-500 opacity-70"
                                >
                                    <Flag size={18} />
                                    Report organization
                                    <span className="rounded-full bg-gray-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                                        Soon
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Organization information */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck
                                    size={21}
                                    className="text-[#166534]"
                                />

                                <h2 className="text-xl font-bold text-[#183B2A]">
                                    Organization information
                                </h2>
                            </div>

                            <div className="mt-7 grid gap-6 sm:grid-cols-2">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <ShieldCheck size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Registration number
                                        </p>

                                        <p className="mt-1 break-words font-semibold text-[#183B2A]">
                                            {ngo.registration_number ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <MapPin size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Address
                                        </p>

                                        <p className="mt-1 break-words font-semibold text-[#183B2A]">
                                            {ngo.address || "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <Mail size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Email address
                                        </p>

                                        {ngo.email ? (
                                            <a
                                                href={`mailto:${ngo.email}`}
                                                className="mt-1 block break-all font-semibold text-[#166534] hover:underline"
                                            >
                                                {ngo.email}
                                            </a>
                                        ) : (
                                            <p className="mt-1 font-semibold text-[#183B2A]">
                                                Not provided
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                        <Phone size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Phone number
                                        </p>

                                        {ngo.phone ? (
                                            <a
                                                href={`tel:${ngo.phone}`}
                                                className="mt-1 block font-semibold text-[#166534] hover:underline"
                                            >
                                                {ngo.phone}
                                            </a>
                                        ) : (
                                            <p className="mt-1 font-semibold text-[#183B2A]">
                                                Not provided
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NGO administrator */}
                        <div className="mt-8 rounded-3xl border border-[#E5EBDD] bg-white p-6 sm:p-8">
                            <div className="flex items-center gap-2">
                                <Users
                                    size={21}
                                    className="text-[#166534]"
                                />

                                <h2 className="text-xl font-bold text-[#183B2A]">
                                    Organization administrator
                                </h2>
                            </div>

                            <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-[#FFFCF6] p-5 sm:flex-row sm:items-center">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5EBDD] bg-[#E5F2E1]">
                                    {ngoAdmin.profile_picture ? (
                                        <img
                                            src={
                                                getImageUrl(
                                                    ngoAdmin.profile_picture
                                                ) ?? ""
                                            }
                                            alt={
                                                adminFullName ||
                                                ngoAdmin.username
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-[#166534]">
                                            {getInitial(
                                                adminFullName ||
                                                ngoAdmin.username
                                            )}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-lg font-bold text-[#183B2A]">
                                        {adminFullName ||
                                            ngoAdmin.username}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        @{ngoAdmin.username}
                                    </p>

                                    <span className="mt-3 inline-flex rounded-full bg-[#E5F2E1] px-3 py-1 text-xs font-semibold text-[#166534]">
                                        NGO Administrator
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays
                                    size={16}
                                    className="text-[#29904C]"
                                />
                                Registered on {formatDate(ngo.created_at)}
                            </div>
                        </div>
                    </section>

                    {/* Organization overview */}
                    <aside className="lg:sticky lg:top-8">
                        <div className="overflow-hidden rounded-3xl border border-[#E5EBDD] bg-white shadow-sm">
                            <div className="border-b border-[#E5EBDD] bg-[#EDF6E9] px-6 py-6">
                                <p className="text-sm font-semibold text-[#166534]">
                                    Organization overview
                                </p>

                                <h2 className="mt-2 text-2xl font-extrabold text-[#183B2A]">
                                    Making a difference together
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Learn more about this organization's
                                    presence on ShareHope.
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-[#FFFCF6] p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                            <Users size={19} />
                                        </div>

                                        <p className="mt-4 text-2xl font-extrabold text-[#183B2A]">
                                            {Number(
                                                ngo.membership_count ?? 0
                                            ).toLocaleString("en-NP")}
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-gray-500">
                                            Members
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-[#FFFCF6] p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                            <FileCheck2 size={19} />
                                        </div>

                                        <p className="mt-4 text-2xl font-extrabold text-[#183B2A]">
                                            {Number(
                                                ngo.document_count ?? 0
                                            ).toLocaleString("en-NP")}
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-gray-500">
                                            Registered documents
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-5 border-t border-[#E5EBDD] pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <CheckCircle2 size={19} />
                                        </div>

                                        <div>
                                            <p className="font-bold text-[#183B2A]">
                                                Verification status
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {isVerified
                                                    ? "This organization has been approved by ShareHope."
                                                    : "This organization has not yet received approved verification status."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF6E9] text-[#166534]">
                                            <Clock3 size={19} />
                                        </div>

                                        <div>
                                            <p className="font-bold text-[#183B2A]">
                                                Organization status
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {ngo.is_active
                                                    ? "The organization is currently active."
                                                    : "The organization is currently inactive."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {viewerStatus === "loading" ? (
                                    <div className="mt-7 h-14 w-full animate-pulse rounded-2xl bg-[#DCE8D8]" />
                                ) : isOwnNGO ? (
                                    <Link
                                        href="/dashboard/ngo"
                                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] px-6 py-4 font-bold text-white transition hover:bg-[#14532D]"
                                    >
                                        Go to NGO Dashboard
                                        <ArrowRight size={18} />
                                    </Link>
                                ) : (
                                    <div className="mt-7 rounded-2xl border border-[#E5EBDD] bg-[#FFFCF6] p-5 text-center">
                                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                            <Building2 size={22} />
                                        </div>

                                        <p className="mt-3 font-bold text-[#183B2A]">
                                            Supporting communities
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            Discover campaigns from
                                            organizations and find ways to
                                            contribute to their causes.
                                        </p>

                                        <Link
                                            href="/campaigns"
                                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#166534] hover:underline"
                                        >
                                            Explore campaigns
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 rounded-3xl border border-[#DCE8D8] bg-[#E5F2E1]/60 p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#166534]">
                                    <ShieldCheck size={21} />
                                </div>

                                <h3 className="font-bold text-[#183B2A]">
                                    Transparency matters
                                </h3>
                            </div>

                            <p className="mt-3 text-sm leading-7 text-gray-600">
                                ShareHope helps people discover organizations
                                and understand who is behind the causes they
                                support.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}