import { getProfile } from "@/services/profileService";

export const AUTH_STATUS_KEY = "sharehope_authenticated";
export const AUTH_ROLE_KEY = "sharehope_user_role";

export const USER_ROLES = {
    ADMIN: "ADMIN",
    DONOR: "DONOR",
    NGO_ADMIN: "NGO_ADMIN",
    NGO_STAFF: "NGO_STAFF",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
    ADMIN: "/dashboard/admin",
    DONOR: "/dashboard/donor",
    NGO_ADMIN: "/dashboard/ngo-admin",
    NGO_STAFF: "/dashboard/ngo-staff",
};

function normalizeRole(role: unknown): UserRole | null {
    if (typeof role !== "string") return null;

    const normalizedRole = role.trim().toUpperCase();

    if (
        Object.values(USER_ROLES).includes(
            normalizedRole as UserRole
        )
    ) {
        return normalizedRole as UserRole;
    }

    return null;
}

export function getAuthStatus(): boolean {
    if (typeof window === "undefined") return false;

    return sessionStorage.getItem(AUTH_STATUS_KEY) === "true";
}

export function getUserRole(): UserRole | null {
    if (typeof window === "undefined") return null;

    return normalizeRole(sessionStorage.getItem(AUTH_ROLE_KEY));
}

export function setAuthStatus(
    authenticated: boolean,
    role?: UserRole | string | null
): void {
    if (typeof window === "undefined") return;

    let currentRole: UserRole | null = null;

    if (authenticated) {
        sessionStorage.setItem(AUTH_STATUS_KEY, "true");

        currentRole = normalizeRole(role);

        if (currentRole) {
            sessionStorage.setItem(AUTH_ROLE_KEY, currentRole);
        } else {
            sessionStorage.removeItem(AUTH_ROLE_KEY);
        }
    } else {
        sessionStorage.removeItem(AUTH_STATUS_KEY);
        sessionStorage.removeItem(AUTH_ROLE_KEY);
    }

    window.dispatchEvent(
        new CustomEvent("auth-change", {
            detail: {
                authenticated,
                role: authenticated ? currentRole : null,
            },
        })
    );
}

export async function syncAuthFromProfile(): Promise<UserRole | null> {
    try {
        const response = await getProfile();
        const role = normalizeRole(response.user.role);

        if (!role) {
            setAuthStatus(false);
            return null;
        }

        setAuthStatus(true, role);

        return role;
    } catch {
        setAuthStatus(false);
        return null;
    }
}

export function hasRole(
    allowedRoles: readonly UserRole[]
): boolean {
    if (!getAuthStatus()) return false;

    const currentRole = getUserRole();

    if (!currentRole) return false;

    return allowedRoles.includes(currentRole);
}

export function canAccess(
    allowedRoles?: readonly UserRole[]
): boolean {
    if (!getAuthStatus()) return false;

    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    return hasRole(allowedRoles);
}

export function getDashboardRoute(): string | null {
    if (!getAuthStatus()) return null;

    const role = getUserRole();

    if (!role) return null;

    return ROLE_DASHBOARD_ROUTES[role];
}

export function isAuthenticatedOnlyPath(
    pathname: string
): boolean {
    const protectedPaths = [
        "/profile",
        "/dashboard",
    ];

    return protectedPaths.some(
        (path) =>
            pathname === path ||
            pathname.startsWith(`${path}/`)
    );
}