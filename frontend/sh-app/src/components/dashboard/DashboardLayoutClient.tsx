"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebarSkeleton from "@/components/skeleton/dashboard/DashboardSidebarSkeleton";
import DashboardHeaderSkeleton from "@/components/skeleton/dashboard/DashboardHeaderSkeleton";
import { getProfile } from "@/services/profileService";
import { getNGOByUser } from "@/services/ngoService";
import type { AuthUser, UserRole } from "@/types/auth";
import type { NGOStatus } from "@/types/ngo";

interface DashboardLayoutClientProps {
    children: ReactNode;
}

const roleRoutes: Record<UserRole, string> = {
    ADMIN: "/dashboard/admin",
    DONOR: "/dashboard/donor",
    NGO_ADMIN: "/dashboard/ngo-admin",
    NGO_STAFF: "/dashboard/ngo-staff",
};

function getErrorStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) {
        return undefined;
    }

    const candidate = error as {
        status?: number;
        statusCode?: number;
        response?: {
            status?: number;
        };
    };

    return (
        candidate.status ??
        candidate.statusCode ??
        candidate.response?.status
    );
}

function getNGOStatus(
    status?: NGOStatus | string,
    verificationStatus?: NGOStatus | string
): string | undefined {
    return status ?? verificationStatus;
}

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

                const isDashboardRoot =
                    pathname === "/dashboard" ||
                    pathname === "/dashboard/";

                const hasAccess =
                    pathname === allowedBaseRoute ||
                    pathname.startsWith(`${allowedBaseRoute}/`);

                if (!isDashboardRoot && !hasAccess) {
                    setUser(currentUser);
                    router.replace(allowedBaseRoute);
                    return;
                }

                if (currentUser.role === "NGO_ADMIN") {
                    try {
                        const ngo = await getNGOByUser();

                        if (!isMounted) return;

                        const ngoStatus = getNGOStatus(
                            ngo.status,
                            ngo.verification_status
                        );

                        if (
                            ngoStatus === "PENDING" ||
                            ngoStatus === "REJECTED"
                        ) {
                            setUser(currentUser);
                            router.replace("/profile");
                            return;
                        }

                        if (ngoStatus !== "APPROVED") {
                            setUser(currentUser);
                            router.replace("/profile");
                            return;
                        }

                        setUser(currentUser);

                        if (isDashboardRoot) {
                            router.replace("/dashboard/ngo");
                            return;
                        }
                    } catch (error: unknown) {
                        if (!isMounted) return;

                        if (getErrorStatus(error) === 404) {
                            setUser(currentUser);
                            router.replace("/register/ngo");
                            return;
                        }

                        setUser(null);
                        router.replace("/login");
                        return;
                    }
                } else if (isDashboardRoot) {
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
            <DashboardLayoutContent>
                {children}
            </DashboardLayoutContent>
        </Suspense>
    );
}