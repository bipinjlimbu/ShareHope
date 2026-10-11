const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getCsrfToken(): string | undefined {
    if (typeof document === "undefined") return undefined;

    const csrfCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("csrftoken="));

    return csrfCookie ? decodeURIComponent(csrfCookie.substring("csrftoken=".length)) : undefined;
}

export async function apiFetch(endpoint: string, options?: RequestInit) {
    const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;
    const method = (options?.method ?? "GET").toUpperCase();
    const headers = new Headers(options?.headers);

    if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const csrfToken = getCsrfToken();
        if (csrfToken) headers.set("X-CSRFToken", csrfToken);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw {
            ...data,
            status: response.status,
        };
    }

    return data;
}

export async function authFetch(endpoint: string, options?: RequestInit) {
    try {
        return await apiFetch(endpoint, options);
    } catch (error) {
        const status = typeof error === "object" && error !== null && "status" in error ? (error as { status?: number }).status : undefined;

        if (status !== 401 || endpoint === "/token/refresh/") throw error;

        await apiFetch("/token/refresh/", {
            method: "POST",
            body: JSON.stringify({}),
        });

        return apiFetch(endpoint, options);
    }
}
