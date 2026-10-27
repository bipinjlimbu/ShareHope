"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Menu,
    LogOut,
    ChevronDown,
    UserRound,
} from "lucide-react";
import { logoutUser } from "@/services/authService";
import { useToast } from "@/components/toast/ToastProvider";
import type {
    DashboardHeaderProps,
    DashboardRole,
} from "@/types/dashboard";

const roleLabels: Record<DashboardRole, string> = {
    ADMIN: "Administrator",
    DONOR: "Donor",
    NGO_ADMIN: "NGO Administrator",
    NGO_STAFF: "NGO Staff",
};

export default function DashboardHeader({
    user,
    onMenuClick,
}: DashboardHeaderProps) {
    const router = useRouter();
    const { showToast } = useToast();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const role = user.role as DashboardRole;

    const fullName =
        [user.first_name, user.last_name]
            .filter(
                (name) =>
                    typeof name === "string" && name.trim()
            )
            .join(" ") ||
        user.username ||
        "ShareHope User";

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ?? "";

    const profilePictureUrl = user.profile_picture
        ? user.profile_picture.startsWith("http")
            ? user.profile_picture
            : `${API_URL}${user.profile_picture}`
        : null;

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setIsMenuOpen(false);

        try {
            await logoutUser();
            router.replace("/login");
        } catch {
            showToast(
                "Unable to log out. Please try again.",
                "error"
            );
            setIsLoggingOut(false);
        }
    }

    function handleProfileNavigation() {
        setIsMenuOpen(false);
        router.push("/profile");
    }

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E6EDE4] bg-[#FFFCF6]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open dashboard navigation"
                    className="rounded-xl border border-[#DDE7DC] p-2.5 text-[#31523C] transition hover:bg-[#EDF5EC] md:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-[#6A796B] sm:text-sm">
                        ShareHope Workspace
                    </p>

                    <h1 className="truncate text-base font-bold text-[#183B2A] sm:text-lg">
                        Welcome, {fullName}
                    </h1>
                </div>
            </div>

            <div className="flex items-center">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setIsMenuOpen((previous) => !previous)
                        }
                        aria-expanded={isMenuOpen}
                        aria-haspopup="menu"
                        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#EDF5EC] sm:gap-3 sm:px-2"
                    >
                        {profilePictureUrl ? (
                            <img
                                src={profilePictureUrl}
                                alt={`${fullName}'s profile`}
                                className="h-10 w-10 shrink-0 rounded-full border border-[#DDE7DC] object-cover"
                            />
                        ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F1E4] text-sm font-bold uppercase text-[#166534]">
                                {fullName.charAt(0) || "U"}
                            </span>
                        )}

                        <div className="hidden text-left sm:block">
                            <p className="max-w-36 truncate text-sm font-semibold text-[#31523C]">
                                {fullName}
                            </p>

                            <p className="mt-0.5 text-xs text-[#6A796B]">
                                {roleLabels[role] ?? "Member"}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`hidden text-[#778477] transition-transform sm:block ${isMenuOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isMenuOpen && (
                        <>
                            <button
                                type="button"
                                aria-label="Close account menu"
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 z-40 cursor-default"
                            />

                            <div
                                role="menu"
                                className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-[#E1E9DC] bg-[#FFFCF6] p-2 shadow-xl shadow-[#183B2A]/10"
                            >
                                <div className="flex items-center gap-3 border-b border-[#E6EDE4] px-3 py-3">
                                    {profilePictureUrl ? (
                                        <img
                                            src={profilePictureUrl}
                                            alt=""
                                            className="h-10 w-10 shrink-0 rounded-full border border-[#DDE7DC] object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4F1E4] text-sm font-bold uppercase text-[#166534]">
                                            {fullName.charAt(0) || "U"}
                                        </span>
                                    )}

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#183B2A]">
                                            {fullName}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#6A796B]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleProfileNavigation}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#31523C] transition hover:bg-[#EDF5EC]"
                                >
                                    <UserRound
                                        size={18}
                                        className="text-[#27824B]"
                                    />
                                    My profile
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <LogOut size={18} />

                                    {isLoggingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
