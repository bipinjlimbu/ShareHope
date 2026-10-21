"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    X,
    HeartHandshake,
    LayoutDashboard,
    Users,
    Building2,
    HandHeart,
    Wallet,
    ShieldCheck,
    CreditCard,
    History,
    ChartNoAxesCombined,
    Search,
    Heart,
    Receipt,
    Bell,
    PlusCircle,
    ClipboardList,
    type LucideIcon,
} from "lucide-react";
import { dashboardNavigation } from "@/config/dashboard-navigation";
import type {
    DashboardRole,
    DashboardSidebarProps,
} from "@/types/dashboard";
import FooterLogo from "@/images/FooterLogo.png";

const iconMap: Record<string, LucideIcon> = {
    "layout-dashboard": LayoutDashboard,
    users: Users,
    "building-2": Building2,
    "hand-heart": HandHeart,
    wallet: Wallet,
    "shield-check": ShieldCheck,
    "credit-card": CreditCard,
    history: History,
    "chart-no-axes-combined": ChartNoAxesCombined,
    search: Search,
    heart: Heart,
    receipt: Receipt,
    bell: Bell,
    "plus-circle": PlusCircle,
    "clipboard-list": ClipboardList,
};

const roleLabels: Record<DashboardRole, string> = {
    ADMIN: "Administrator",
    DONOR: "Donor",
    NGO_ADMIN: "NGO Administrator",
    NGO_STAFF: "NGO Staff",
};

export default function DashboardSidebar({
    role,
    isOpen,
    onClose,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const navItems = dashboardNavigation[role];

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
                    <Link
                        href="/"
                        onClick={onClose}
                        aria-label="ShareHope home"
                        className="flex items-center"
                    >
                        <Image
                            src={FooterLogo}
                            alt="ShareHope"
                            priority
                            className="h-auto w-36 object-contain"
                        />
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b border-slate-100 px-5 py-5">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                            <HeartHandshake size={21} />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                ShareHope
                            </p>
                            <p className="mt-0.5 truncate text-xs text-emerald-700">
                                {roleLabels[role]}
                            </p>
                        </div>
                    </div>
                </div>

                <nav
                    aria-label="Dashboard navigation"
                    className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
                >
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Workspace
                    </p>

                    {navItems.map((item) => {
                        const Icon = iconMap[item.icon] ?? LayoutDashboard;

                        const isActive =
                            pathname === item.href ||
                            (item.href !== `/dashboard/${role.toLowerCase()}` &&
                                pathname.startsWith(`${item.href}/`));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                aria-current={isActive ? "page" : undefined}
                                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                                    }`}
                            >
                                <Icon
                                    size={19}
                                    strokeWidth={1.8}
                                    className="shrink-0"
                                />

                                <span className="min-w-0 flex-1">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-100 p-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <p className="text-xs font-medium text-slate-600">
                                Making a difference together
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}