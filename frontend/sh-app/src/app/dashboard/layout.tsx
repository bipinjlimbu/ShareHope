"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";
import { getProfile } from "@/services/profileService";
import type { AuthUser, UserRole } from "@/types/auth";

interface DashboardLayoutProps {
    children: ReactNode;
}

const roleRoutes: Record<UserRole, string> = {
    ADMIN: "/dashboard/admin",
    DONOR: "/dashboard/donor",
    NGO_ADMIN: "/dashboard/ngo",
    NGO_STAFF: "/dashboard/ngo",
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            setIsLoading(true);

            try {
                const response = await getProfile();
                const currentUser = response.user;

                if (!isMounted) return;

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                const allowedBaseRoute = roleRoutes[currentUser.role];

                if (!allowedBaseRoute) {
                    router.replace("/login");
                    return;
                }

                if (
                    pathname === "/dashboard" ||
                    pathname === "/dashboard/"
                ) {
                    setUser(currentUser);
                    router.replace(allowedBaseRoute);
                    return;
                }

                const hasAccess =
                    pathname === allowedBaseRoute ||
                    pathname.startsWith(`${allowedBaseRoute}/`);

                if (!hasAccess) {
                    setUser(currentUser);
                    router.replace(allowedBaseRoute);
                    return;
                }

                setUser(currentUser);
                setIsLoading(false);
            } catch {
                if (isMounted) {
                    setUser(null);
                    router.replace("/login");
                }
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (isLoading || !user) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <DashboardSidebar
                role={user.role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="min-h-screen md:pl-64">
                <DashboardHeader
                    user={user}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />

                <main className="min-w-0 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}