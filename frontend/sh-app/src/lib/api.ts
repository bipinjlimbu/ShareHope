
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options?: RequestInit) {
    const isFormData = options?.body instanceof FormData;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options?.headers,
        },
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
    return apiFetch(endpoint, options);
}
