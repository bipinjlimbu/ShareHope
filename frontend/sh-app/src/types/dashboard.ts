import type { AuthUser } from "@/types/auth";

export type DashboardRole =
    | "ADMIN"
    | "DONOR"
    | "NGO_ADMIN"
    | "NGO_STAFF";

export interface DashboardNavItem {
    label: string;
    href: string;
    icon: string;
}

export interface DashboardSidebarProps {
    role: DashboardRole;
    isOpen: boolean;
    onClose: () => void;
}

export interface DashboardHeaderProps {
    user: AuthUser;
    onMenuClick: () => void;
}

export interface DashboardLayoutProps {
    children: React.ReactNode;
}