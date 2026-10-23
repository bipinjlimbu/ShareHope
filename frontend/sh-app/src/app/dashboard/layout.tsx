import type { ReactNode } from "react";
import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";
export const instant = false;

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}