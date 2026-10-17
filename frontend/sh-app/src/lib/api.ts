import { setAuthStatus } from "@/lib/authStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getCsrfToken(): string | undefined {
    if (typeof document === "undefined") {
        return undefined;
    }

    const csrfCookie = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrftoken="));

    return csrfCookie
        ? decodeURIComponent(
            csrfCookie.substring("csrftoken=".length)
        )
        : undefined;
}

function getErrorStatus(error: unknown): number | undefined {
    if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof error.status === "number"
    ) {
        return error.status;
    }

    return undefined;
}

function redirectToLogin(): void {
    if (typeof window === "undefined") {
        return;
    }

    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/campaigns",
        "/about",
    ];

    const currentPath = window.location.pathname;

    const isPublicPath = publicPaths.some(
        (path) =>
            currentPath === path ||
            (path !== "/" && currentPath.startsWith(`${path}/`))
    );

    if (!isPublicPath) {
        window.location.replace("/login");
    }
}

export async function apiFetch(
    endpoint: string,
    options?: RequestInit
) {
    const isFormData =
        typeof FormData !== "undefined" &&
        options?.body instanceof FormData;

    const method = (options?.method ?? "GET").toUpperCase();
    const headers = new Headers(options?.headers);

    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(method)
    ) {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            headers.set("X-CSRFToken", csrfToken);
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw {
            ...(typeof data === "object" && data !== null
                ? data
                : {}),
            status: response.status,
        };
    }

    return data;
}

export async function authFetch(
    endpoint: string,
    options?: RequestInit
) {
    try {
        return await apiFetch(endpoint, options);
    } catch (error: unknown) {
        if (getErrorStatus(error) !== 401) {
            throw error;
        }

        if (endpoint === "/token/refresh/") {
            setAuthStatus(false);
            redirectToLogin();
            throw error;
        }

        try {
            await apiFetch("/token/refresh/", {
                method: "POST",
                body: JSON.stringify({}),
            });
        } catch (refreshError: unknown) {
            const status = getErrorStatus(refreshError);

            if (status === 401 || status === 400) {
                setAuthStatus(false);
                redirectToLogin();
            }

            throw refreshError;
        }

        try {
            return await apiFetch(endpoint, options);
        } catch (retryError: unknown) {
            if (getErrorStatus(retryError) === 401) {
                setAuthStatus(false);
                redirectToLogin();
            }

            throw retryError;
        }
    }
}