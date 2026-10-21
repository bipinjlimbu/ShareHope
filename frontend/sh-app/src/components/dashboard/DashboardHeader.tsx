"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Menu,
    Bell,
    LogOut,
    ChevronDown,
    UserRound,
} from "lucide-react";
import { logoutUser } from "@/services/authService";
import { useToast } from "@/components/ToastProvider";
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
            .filter((name) => typeof name === "string" && name.trim())
            .join(" ") ||
        user.username ||
        "ShareHope User";

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setIsMenuOpen(false);

        try {
            await logoutUser();
            router.replace("/login");
        } catch {
            showToast("Unable to log out. Please try again.", "error");
            setIsLoggingOut(false);
        }
    }

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open dashboard navigation"
                    className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50 md:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        ShareHope Workspace
                    </p>
                    <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                        Welcome, {fullName}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => router.push(
                        role === "ADMIN"
                            ? "/dashboard/admin/notifications"
                            : role === "DONOR"
                                ? "/dashboard/donor/notifications"
                                : "/dashboard/ngo/notifications"
                    )}
                    className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                >
                    <Bell size={20} />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((previous) => !previous)}
                        aria-expanded={isMenuOpen}
                        aria-haspopup="menu"
                        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3 sm:px-2"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                            {fullName.charAt(0).toUpperCase()}
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                                {fullName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {roleLabels[role] ?? "Member"}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className="hidden text-slate-400 sm:block"
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
                                className="absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-950/10"
                            >
                                <div className="border-b border-slate-100 px-3 py-3">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {fullName}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        router.push(
                                            role === "ADMIN"
                                                ? "/dashboard/admin/profile"
                                                : role === "DONOR"
                                                    ? "/dashboard/donor/profile"
                                                    : "/dashboard/ngo/profile"
                                        );
                                    }}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                                >
                                    <UserRound size={18} />
                                    My profile
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
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