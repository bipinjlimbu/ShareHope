"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNGOs } from "@/services/ngoService";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    CircleAlert,
    Clock,
    Code2,
    RefreshCw,
    XCircle,
} from "lucide-react";

export default function AdminNGOsPage() {
    const [data, setData] = useState<unknown>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");

    async function fetchNGOs() {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getNGOs();

            console.log("NGO API response:", response);
            console.log(
                "NGO API response JSON:",
                JSON.stringify(response, null, 2)
            );

            setData(response);
            setLastUpdated(
                new Intl.DateTimeFormat("en-NP", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "Asia/Kathmandu",
                }).format(new Date())
            );
        } catch (err: unknown) {
            console.error("Failed to fetch NGOs:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch NGO data."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void fetchNGOs();
    }, []);

    const recordCount = Array.isArray(data)
        ? data.length
        : data !== null && typeof data === "object"
            ? "Object response"
            : data !== null
                ? "Non-object response"
                : "—";

    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/dashboard/admin"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#166534] transition hover:text-[#14532D]"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </Link>

                    <div className="flex items-center gap-2 text-sm font-medium text-[#27824B]">
                        <Building2 size={18} />
                        Administration
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                        NGO API Testing
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#6A796B] sm:text-base">
                        Inspect the data returned by the Django NGO endpoint before building the management page.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void fetchNGOs()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
                >
                    <RefreshCw
                        size={17}
                        className={isLoading ? "animate-spin" : ""}
                    />
                    {isLoading ? "Fetching..." : "Refresh data"}
                </button>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <Building2 size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-[#6A796B]">
                                Response records
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#183B2A]">
                                {isLoading ? "..." : recordCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <Code2 size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-[#6A796B]">
                                Response format
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#183B2A]">
                                {isLoading
                                    ? "..."
                                    : Array.isArray(data)
                                        ? "JSON Array"
                                        : data !== null && typeof data === "object"
                                            ? "JSON Object"
                                            : error
                                                ? "Failed"
                                                : "Other"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EBD8] text-[#8A6425]">
                            <Clock size={22} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-[#6A796B]">
                                Last fetched
                            </p>
                            <p className="mt-1 truncate text-sm font-bold text-[#183B2A]">
                                {lastUpdated || "Not fetched"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <section
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-5"
                >
                    <div className="flex items-start gap-3">
                        <CircleAlert
                            size={22}
                            className="mt-0.5 shrink-0 text-red-600"
                        />
                        <div className="min-w-0 flex-1">
                            <h2 className="font-bold text-red-800">
                                Failed to fetch NGOs
                            </h2>
                            <p className="mt-2 break-words text-sm leading-6 text-red-700">
                                {error}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-red-700">
                                Check your authentication, Django server, API URL, and browser Network tab.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="overflow-hidden rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6]">
                <div className="flex flex-col gap-3 border-b border-[#E1E9DC] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#183B2A]">
                            Raw API response
                        </h2>
                        <p className="mt-1 text-sm text-[#6A796B]">
                            Exact data returned by GET /ngo/
                        </p>
                    </div>

                    {!isLoading && !error && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#E5F2E1] px-3 py-1.5 text-xs font-semibold text-[#166534]">
                            <CheckCircle2 size={14} />
                            Request successful
                        </span>
                    )}

                    {isLoading && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#F4EBD8] px-3 py-1.5 text-xs font-semibold text-[#8A6425]">
                            <RefreshCw
                                size={14}
                                className="animate-spin"
                            />
                            Loading
                        </span>
                    )}

                    {error && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <XCircle size={14} />
                            Request failed
                        </span>
                    )}
                </div>

                <div className="p-4 sm:p-6">
                    {isLoading ? (
                        <div className="space-y-3 py-4">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-5 animate-pulse rounded-md bg-[#E9EFE5]"
                                    style={{
                                        width: `${100 - item * 8}%`,
                                    }}
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-[#6A796B]">
                                No successful response to display.
                            </p>
                        </div>
                    ) : (
                        <pre className="max-h-[650px] overflow-auto rounded-xl border border-[#E1E9DC] bg-[#F4F7F0] p-4 text-xs leading-6 text-[#24432D] sm:p-5 sm:text-sm">
                            {JSON.stringify(data, null, 2) ?? "null"}
                        </pre>
                    )}
                </div>

                {!isLoading && !error && (
                    <div className="border-t border-[#E1E9DC] px-5 py-4 sm:px-6">
                        <p className="text-xs leading-5 text-[#6A796B]">
                            Please inspect this response before implementing the NGO table, filters, status badges, or detail modal.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}