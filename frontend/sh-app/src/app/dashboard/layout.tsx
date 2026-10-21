"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";
import { getCurrentUser } from "@/services/authService";
import type { AuthUser } from "@/types/auth";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();

                if (!isMounted) return;

                if (!currentUser) {
                    router.replace("/login");
                    return;
                }

                setUser(currentUser);

                const roleRoutes: Record<string, string> = {
                    ADMIN: "/dashboard/admin",
                    DONOR: "/dashboard/donor",
                    NGO_ADMIN: "/dashboard/ngo",
                    NGO_STAFF: "/dashboard/ngo",
                };

                const allowedBaseRoute = roleRoutes[currentUser.role];

                if (!allowedBaseRoute) {
                    router.replace("/login");
                    return;
                }

                const roleBaseRoutes: Record<string, string[]> = {
                    ADMIN: ["/dashboard/admin"],
                    DONOR: ["/dashboard/donor"],
                    NGO_ADMIN: ["/dashboard/ngo"],
                    NGO_STAFF: ["/dashboard/ngo"],
                };

                const allowedRoutes = roleBaseRoutes[currentUser.role] ?? [];

                const hasAccess = allowedRoutes.some(
                    (baseRoute) =>
                        pathname === baseRoute ||
                        pathname.startsWith(`${baseRoute}/`)
                );

                if (
                    pathname === "/dashboard" ||
                    pathname === "/dashboard/"
                ) {
                    router.replace(allowedBaseRoute);
                    return;
                }

                if (!hasAccess) {
                    router.replace(allowedBaseRoute);
                    return;
                }

                setIsLoading(false);
            } catch {
                if (isMounted) {
                    router.replace("/login");
                }
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    if (isLoading || !user) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <DashboardSidebar role={user.role} />

            <div className="min-h-screen md:pl-64">
                <DashboardHeader user={user} />

                <main className="min-w-0 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
