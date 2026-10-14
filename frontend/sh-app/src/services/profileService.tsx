
import type {
    ProfileUpdatePayload,
    ProfileUpdateResponse,
    ProfileFormErrors,
} from "@/types/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

function getCSRFToken(): string | undefined {
    if (typeof document === "undefined") return undefined;

    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith("csrftoken="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : undefined;
}

export class ProfileServiceError extends Error {
    errors?: ProfileFormErrors;

    constructor(message: string, errors?: ProfileFormErrors) {
        super(message);
        this.name = "ProfileServiceError";
        this.errors = errors;
    }
}

export async function updateProfile(
    payload: ProfileUpdatePayload,
): Promise<ProfileUpdateResponse> {
    if (!API_URL) {
        throw new ProfileServiceError(
            "The API URL is not configured.",
        );
    }

    const formData = new FormData();

    formData.append("username", payload.username);
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);

    if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
    }

    const csrfToken = getCSRFToken();

    const response = await fetch(`${API_URL}/profile/`, {
        method: "PUT",
        credentials: "include",
        headers: {
            ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: formData,
    });

    const data: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const errors =
            typeof data === "object" && data !== null
                ? (data as ProfileFormErrors)
                : undefined;

        const message =
            errors && typeof errors.detail === "string"
                ? errors.detail
                : errors && typeof errors.message === "string"
                    ? errors.message
                    : "Unable to update your profile.";

        throw new ProfileServiceError(message, errors);
    }

    if (
        typeof data !== "object" ||
        data === null ||
        !("user" in data)
    ) {
        throw new ProfileServiceError(
            "The server returned an invalid profile response.",
        );
    }

    return data as ProfileUpdateResponse;
}
