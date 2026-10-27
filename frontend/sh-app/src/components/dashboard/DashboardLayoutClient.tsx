"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebarSkeleton from "@/components/skeleton/dashboard/DashboardSidebarSkeleton";
import DashboardHeaderSkeleton from "@/components/skeleton/dashboard/DashboardHeaderSkeleton";
import { getProfile } from "@/services/profileService";
import type { AuthUser, UserRole } from "@/types/auth";

interface DashboardLayoutClientProps {
    children: ReactNode;
}

const roleRoutes: Record<UserRole, string> = {
    ADMIN: "/dashboard/admin",
    DONOR: "/dashboard/donor",
    NGO_ADMIN: "/dashboard/ngo",
    NGO_STAFF: "/dashboard/ngo",
};

function DashboardLayoutContent({
    children,
}: DashboardLayoutClientProps) {
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
                    setUser(null);
                    router.replace("/login");
                    return;
                }

                const allowedBaseRoute = roleRoutes[currentUser.role];

                if (!allowedBaseRoute) {
                    setUser(null);
                    router.replace("/login");
                    return;
                }

                if (pathname === "/dashboard" || pathname === "/dashboard/") {
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
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadUser();

        return () => {
            isMounted = false;
        };
    }, [pathname, router]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const isDashboardReady = !isLoading && user !== null;

    return (
        <div className="min-h-screen bg-[#FFFCF6] text-[#183B2A]">
            {isLoading || !user ? (
                <>
                    <DashboardSidebarSkeleton />
                    <div className="md:pl-64">
                        <DashboardHeaderSkeleton />
                    </div>
                </>
            ) : (
                <>
                    <DashboardSidebar
                        role={user.role}
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />

                    <div className="md:pl-64">
                        <DashboardHeader
                            user={user}
                            onMenuClick={() => setIsSidebarOpen(true)}
                        />
                    </div>
                </>
            )}

            <main
                aria-hidden={!isDashboardReady}
                className={`min-w-0 p-4 sm:p-6 lg:p-8 ${user ? "md:ml-64" : ""
                    } ${isDashboardReady
                        ? ""
                        : "invisible pointer-events-none"
                    }`}
            >
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayoutClient({
    children,
}: DashboardLayoutClientProps) {
    return (
        <Suspense
            fallback={
                <>
                    <DashboardSidebarSkeleton />
                    <div className="md:pl-64">
                        <DashboardHeaderSkeleton />
                    </div>
                </>
            }
        >
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </Suspense>
    );
}
