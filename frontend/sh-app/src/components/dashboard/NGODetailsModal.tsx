"use client";

import { useEffect, useState } from "react";
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    UserRound,
    Users,
    X,
    XCircle,
} from "lucide-react";
import { getNGOById } from "@/services/ngoService";
import type { NGOListItem } from "@/types/ngo";
import NGODetailsModalSkeleton from "@/components/skeleton/dashboard/NGODetailsModalSkeleton";

interface NGODetailsModalProps {
    isOpen: boolean;
    ngoId: number | null;
    onClose: () => void;
}

const statusStyles: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    APPROVED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
};

function formatDate(value?: string | null): string {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kathmandu",
    }).format(date);
}

function getPersonName(
    person: NGOListItem["created_by"] | NGOListItem["reviewed_by"]
): string {
    if (!person) return "Not assigned";

    const fullName = `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim();

    return fullName || person.username || "Unknown user";
}

function getMediaUrl(path: string | null | undefined): string {
    if (!path) return "";

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        return path;
    }

    try {
        const apiOrigin = new URL(apiUrl).origin;
        return new URL(path, apiOrigin).toString();
    } catch {
        return path;
    }
}

function NGOLogo({ ngo }: { ngo: NGOListItem }) {
    const [imageFailed, setImageFailed] = useState(false);
    const logoUrl = getMediaUrl(ngo.ngo_logo);

    useEffect(() => {
        setImageFailed(false);
    }, [ngo.ngo_logo]);

    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534]">
            {logoUrl && !imageFailed ? (
                <img
                    src={logoUrl}
                    alt={`${ngo.name} logo`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <Building2 size={24} />
            )}
        </div>
    );
}

function MemberProfilePicture({
    profilePicture,
    name,
}: {
    profilePicture: string | null;
    name: string;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = getMediaUrl(profilePicture);

    useEffect(() => {
        setImageFailed(false);
    }, [profilePicture]);

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DDE8D7] bg-[#E5F2E1] text-[#166534]">
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={`${name} profile`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <UserRound size={19} />
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const normalized = (status || "UNKNOWN").toUpperCase();

    const className =
        statusStyles[normalized] ??
        "border-[#E1E9DC] bg-[#F4F7F0] text-[#536653]";

    const Icon =
        normalized === "APPROVED"
            ? CheckCircle2
            : normalized === "REJECTED"
                ? XCircle
                : Clock3;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            <Icon size={13} />
            {normalized.charAt(0) + normalized.slice(1).toLowerCase()}
        </span>
    );
}

function DetailField({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number | null | undefined;
    icon?: typeof Building2;
}) {
    return (
        <div className="min-w-0 rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-[#718071]">
                {Icon && (
                    <Icon size={14} className="shrink-0 text-[#4C8154]" />
                )}
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-semibold leading-6 text-[#183B2A]">
                {value === null || value === undefined || value === ""
                    ? "Not provided"
                    : value}
            </p>
        </div>
    );
}

function SectionHeading({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description?: string;
    icon: typeof Building2;
}) {
    return (
        <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                <Icon size={19} />
            </div>

            <div>
                <h3 className="font-bold text-[#183B2A]">{title}</h3>

                {description && (
                    <p className="mt-1 text-sm leading-5 text-[#718071]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function NGODetailsModal({
    isOpen,
    ngoId,
    onClose,
}: NGODetailsModalProps) {
    const [ngo, setNgo] = useState<NGOListItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        if (!isOpen || ngoId === null) {
            setNgo(null);
            setError(null);
            setIsLoading(false);
            return;
        }

        const id = ngoId;
        let isCurrentRequest = true;

        async function fetchDetails() {
            setIsLoading(true);
            setError(null);
            setNgo(null);

            try {
                const response = await getNGOById(id);

                if (isCurrentRequest) {
                    setNgo(response);
                }
            } catch (err: unknown) {
                console.error("Failed to fetch NGO details:", err);

                if (isCurrentRequest) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load this NGO's details."
                    );
                }
            } finally {
                if (isCurrentRequest) {
                    setIsLoading(false);
                }
            }
        }

        void fetchDetails();

        return () => {
            isCurrentRequest = false;
        };
    }, [isOpen, ngoId, retryKey]);

    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const documents = ngo?.documents ?? [];
    const members = ngo?.members ?? [];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#102719]/55 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="ngo-details-title"
                className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] shadow-2xl sm:rounded-3xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-[#E1E9DC] px-5 py-5 sm:px-7">
                    <div className="flex min-w-0 items-start gap-3">
                        {ngo ? (
                            <NGOLogo ngo={ngo} />
                        ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Building2 size={24} />
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#27824B]">
                                Organization record
                            </p>

                            <h2
                                id="ngo-details-title"
                                className="mt-1 break-words text-xl font-bold text-[#183B2A] sm:text-2xl"
                            >
                                {isLoading
                                    ? "Loading NGO details..."
                                    : ngo?.name || "NGO Details"}
                            </h2>

                            <p className="mt-1 text-sm text-[#718071]">
                                {ngo
                                    ? `NGO ID: #${ngo.id}`
                                    : "Full registration details"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close NGO details"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#617263] transition hover:bg-[#EAF2E5] hover:text-[#183B2A]"
                    >
                        <X size={21} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                    {isLoading ? (
                        <NGODetailsModalSkeleton />
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-200 bg-red-50 p-5"
                        >
                            <div className="flex items-start gap-3">
                                <XCircle
                                    size={22}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />

                                <div>
                                    <h3 className="font-bold text-red-800">
                                        Unable to load NGO details
                                    </h3>

                                    <p className="mt-2 break-words text-sm leading-6 text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setRetryKey((current) => current + 1);
                                }}
                                className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100"
                            >
                                Try again
                            </button>
                        </div>
                    ) : ngo ? (
                        <div className="space-y-7">
                            <section className="rounded-2xl border border-[#DDE8D7] bg-[#F4F8F0] p-4 sm:p-5">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-[#718071]">
                                            Current status
                                        </p>

                                        <div className="mt-2">
                                            <StatusBadge status={ngo.status} />
                                        </div>
                                    </div>

                                    <div className="text-sm text-[#617263]">
                                        <span className="font-medium">
                                            Submitted:
                                        </span>{" "}
                                        {formatDate(ngo.created_at)}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Organization information"
                                    description="Official registration and contact information."
                                    icon={Building2}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DetailField
                                        label="Organization name"
                                        value={ngo.name}
                                        icon={Building2}
                                    />

                                    <DetailField
                                        label="Registration number"
                                        value={ngo.registration_number}
                                        icon={ShieldCheck}
                                    />

                                    <DetailField
                                        label="Email address"
                                        value={ngo.email}
                                        icon={Mail}
                                    />

                                    <DetailField
                                        label="Phone number"
                                        value={ngo.phone}
                                        icon={Phone}
                                    />

                                    <div className="sm:col-span-2">
                                        <DetailField
                                            label="Registered address"
                                            value={ngo.address}
                                            icon={MapPin}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <DetailField
                                            label="Description"
                                            value={ngo.description}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <SectionHeading
                                    title="Registration documents"
                                    description={`${documents.length} document${documents.length === 1 ? "" : "s"} attached to this NGO.`}
                                    icon={FileText}
                                />

                                {documents.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-[#D8E3D3] p-6 text-center">
                                        <FileText
                                            size={24}
                                            className="mx-auto text-[#7B887B]"
                                        />

                                        <p className="mt-2 text-sm text-[#718071]">
                                            No documents have been uploaded.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {documents.map((document) => {
                                            const documentUrl = getMediaUrl(
                                                document.document_file
                                            );

                                            return (
                                                <div
                                                    key={document.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-[#E1E9DC] bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                                            <FileText size={19} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="break-words text-sm font-semibold text-[#183B2A]">
                                                                {document.document_type.replaceAll(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </p>

                                                            <p className="mt-1 break-all text-xs text-[#718071]">
                                                                {document.document_file
                                                                    .split("/")
                                                                    .pop() ||
                                                                    "Uploaded document"}
                                                            </p>

                                                            <p className="mt-1 text-xs text-[#718071]">
                                                                Uploaded{" "}
                                                                {formatDate(
                                                                    document.uploaded_at
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <a
                                                        href={documentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#BBD4B5] bg-[#F0F7ED] px-4 py-2.5 text-sm font-semibold text-[#166534] transition hover:bg-[#E5F2E1]"
                                                    >
                                                        View Document
                                                        <ExternalLink size={15} />
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>

                            <section>
                                <SectionHeading
                                    title="Memberships"
                                    description={`${members.length} member${members.length === 1 ? "" : "s"} associated with this NGO.`}
                                    icon={Users}
                                />

                                {members.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-[#D8E3D3] p-6 text-center">
                                        <Users
                                            size={24}
                                            className="mx-auto text-[#7B887B]"
                                        />

                                        <p className="mt-2 text-sm text-[#718071]">
                                            No members are associated with this NGO.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {members.map((membership) => {
                                            const memberName = getPersonName(
                                                membership.user
                                            );

                                            return (
                                                <div
                                                    key={membership.id}
                                                    className="flex flex-col gap-3 rounded-xl border border-[#E1E9DC] bg-white/70 p-4 sm:flex-row sm:items-center"
                                                >
                                                    <MemberProfilePicture
                                                        profilePicture={
                                                            membership.user
                                                                .profile_picture
                                                        }
                                                        name={memberName}
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="break-words text-sm font-semibold text-[#183B2A]">
                                                            {memberName}
                                                        </p>

                                                        <p className="mt-1 break-all text-xs text-[#718071]">
                                                            {membership.user.email}
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#718071]">
                                                            @{membership.user.username}
                                                            {" · "}
                                                            Joined{" "}
                                                            {formatDate(
                                                                membership.joined_at
                                                            )}
                                                        </p>
                                                    </div>

                                                    <span className="self-start rounded-full border border-[#DDE8D7] bg-[#F0F7ED] px-3 py-1.5 text-xs font-semibold text-[#35543B] sm:self-center">
                                                        {membership.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>

                            <section>
                                <SectionHeading
                                    title="Record ownership and review"
                                    description="The user who registered this NGO and the reviewer recorded by the backend."
                                    icon={ShieldCheck}
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                                        <p className="text-xs font-medium text-[#718071]">
                                            Registered by
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                                            {getPersonName(ngo.created_by)}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-[#718071]">
                                            {ngo.created_by?.email || "No email"}
                                        </p>

                                        <p className="mt-1 text-xs text-[#718071]">
                                            Role: {ngo.created_by?.role || "Unknown"}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-[#E8EDE4] bg-white/70 p-4">
                                        <p className="text-xs font-medium text-[#718071]">
                                            Reviewed by
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-[#183B2A]">
                                            {getPersonName(ngo.reviewed_by)}
                                        </p>

                                        <p className="mt-1 break-all text-xs text-[#718071]">
                                            {ngo.reviewed_by?.email ||
                                                "No reviewer recorded"}
                                        </p>

                                        <p className="mt-1 text-xs text-[#718071]">
                                            Role: {ngo.reviewed_by?.role || "Not available"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="grid gap-3 sm:grid-cols-2">
                                <DetailField
                                    label="Created at"
                                    value={formatDate(ngo.created_at)}
                                    icon={CalendarDays}
                                />

                                <DetailField
                                    label="NGO record ID"
                                    value={`#${ngo.id}`}
                                    icon={Building2}
                                />
                            </section>
                        </div>
                    ) : null}
                </div>

                <footer className="flex justify-end border-t border-[#E1E9DC] bg-[#F7F9F3] px-5 py-4 sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Close
                    </button>
                </footer>
            </section>
        </div>
    );
}