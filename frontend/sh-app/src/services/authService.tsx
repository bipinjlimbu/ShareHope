import { apiFetch } from "@/lib/api";
import type {
    RegisterPayload,
    RegisterResponse,
    LoginPayload,
    LoginResponse,
    LogoutResponse,
} from "@/types/auth";

function getCookie(name: string): string | null {
    if (typeof document === "undefined") {
        return null;
    }

    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : null;
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
    const formData = new FormData();

    formData.append("username", payload.username);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("confirm_password", payload.confirm_password);

    if (payload.first_name) {
        formData.append("first_name", payload.first_name);
    }

    if (payload.last_name) {
        formData.append("last_name", payload.last_name);
    }

    if (payload.role) {
        formData.append("role", payload.role);
    }

    if (payload.phone) {
        formData.append("phone", payload.phone);
    }

    if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
    }

    return apiFetch("/register/", {
        method: "POST",
        body: formData,
    });
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    return apiFetch("/login/", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function refreshSession(): Promise<{ message: string }> {
    return apiFetch("/token/refresh/", {
        method: "POST",
        body: JSON.stringify({}),
    });
}

export async function logoutUser(): Promise<LogoutResponse> {
    const csrfToken = getCookie("csrftoken");

    if (!csrfToken) {
        throw new Error(
            "CSRF token is missing. Please refresh the page and try again."
        );
    }

    return apiFetch("/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({}),
    });
}

export async function getCsrfToken(): Promise<void> {
    await apiFetch("/csrf/", {
        method: "GET",
        credentials: "include",
    });
}