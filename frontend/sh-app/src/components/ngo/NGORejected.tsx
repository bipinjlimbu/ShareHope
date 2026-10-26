"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NGORejectedProps } from "@/types/ngo";
import { deleteNGOByUser } from "@/services/ngoService";

export default function NGORejected({
    rejectionReason,
    onBackToProfile,
}: NGORejectedProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleRegisterAgain = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        setError("");

        try {
            await deleteNGOByUser();
            router.push("/register/ngo");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to delete the rejected NGO registration. Please try again."
            );
            setIsDeleting(false);
        }
    };

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section className="w-full max-w-xl rounded-3xl border border-[#E6EDE4] bg-white p-6 text-center shadow-sm sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-8 w-8"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        />
                        <path
                            d="m9 9 6 6m0-6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <span className="mt-5 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                    Registration rejected
                </span>

                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Your NGO registration was not approved
                </h1>

                <p className="mt-4 text-sm leading-7 text-[#718174] sm:text-base">
                    Your organization’s registration was reviewed but could
                    not be approved. You can review the information and
                    submit your NGO registration again.
                </p>

                {rejectionReason?.trim() && (
                    <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-left">
                        <h2 className="text-sm font-bold text-red-800">
                            Reason for rejection
                        </h2>

                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-red-700">
                            {rejectionReason}
                        </p>
                    </div>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={handleRegisterAgain}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-xl bg-[#166534] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting
                            ? "Deleting registration..."
                            : "Try Registering NGO Again"}
                    </button>

                    <button
                        type="button"
                        onClick={onBackToProfile}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center rounded-xl border border-[#DDE7DC] px-5 py-3.5 text-sm font-semibold text-[#31523C] transition hover:bg-[#EDF5EC] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Back to Profile
                    </button>
                </div>
            </section>
        </main>
    );
}