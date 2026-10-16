import { authFetch } from "@/lib/api";
import type {
    EmailVerificationRequestResponse,
    EmailVerificationResponse,
    ProfileDeleteResponse,
    ProfileGetResponse,
    ProfileUpdatePayload,
    ProfileUpdateResponse,
    ProfileUser,
} from "@/types/profile";

function isProfileUser(value: unknown): value is ProfileUser {
    return (
        typeof value === "object" &&
        value !== null &&
        "username" in value &&
        typeof value.username === "string"
    );
}

export async function getProfile(): Promise<ProfileGetResponse> {
    const response = await authFetch("/profile/", {
        method: "GET",
    });

    if (typeof response !== "object" || response === null) {
        throw {
            message: "The server returned an invalid profile response.",
        };
    }

    if ("user" in response && isProfileUser(response.user)) {
        return { user: response.user };
    }

    if (isProfileUser(response)) {
        return { user: response };
    }

    throw {
        message: "The server returned an invalid profile response.",
    };
}

export async function updateProfile(
    payload: ProfileUpdatePayload,
): Promise<ProfileUpdateResponse> {
    const formData = new FormData();

    formData.append("username", payload.username);
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);

    if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
    }

    const response = await authFetch("/profile/", {
        method: "PUT",
        body: formData,
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("user" in response) ||
        !isProfileUser(response.user)
    ) {
        throw {
            message: "The server returned an invalid profile response.",
        };
    }

    return response as ProfileUpdateResponse;
}

export async function deleteProfile(): Promise<ProfileDeleteResponse> {
    const response = await authFetch("/profile/", {
        method: "DELETE",
        body: JSON.stringify({}),
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("message" in response) ||
        typeof response.message !== "string"
    ) {
        throw {
            message: "The server returned an invalid delete response.",
        };
    }

    return response as ProfileDeleteResponse;
}

export async function requestEmailVerification(): Promise<EmailVerificationRequestResponse> {
    const response = await authFetch("/profile/", {
        method: "PATCH",
        body: JSON.stringify({}),
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("message" in response) ||
        typeof response.message !== "string"
    ) {
        throw {
            message: "The server returned an invalid email verification response.",
        };
    }

    return response as EmailVerificationRequestResponse;
}

export async function verifyEmail(
    otp: string,
): Promise<EmailVerificationResponse> {
    const response = await authFetch("/profile/verify-email/", {
        method: "POST",
        body: JSON.stringify({ otp }),
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("message" in response) ||
        typeof response.message !== "string"
    ) {
        throw {
            message: "The server returned an invalid email verification response.",
        };
    }

    return response as EmailVerificationResponse;
}