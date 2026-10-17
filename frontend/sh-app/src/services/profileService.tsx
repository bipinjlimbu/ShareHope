import { authFetch } from "@/lib/api";
import type {
    EmailVerificationRequestResponse,
    EmailVerificationResponse,
    ProfileDeleteResponse,
    ProfileGetResponse,
    ProfileUpdatePayload,
    ProfileUpdateResponse,
    ProfileUser,
    ResendOTPResponse,
} from "@/types/profile";

function isProfileUser(value: unknown): value is ProfileUser {
    return (
        typeof value === "object" &&
        value !== null &&
        "username" in value &&
        typeof value.username === "string"
    );
}

function isMessageResponse(
    value: unknown,
): value is { message: string } {
    return (
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        typeof value.message === "string"
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
        !isProfileUser(response.user) ||
        !isMessageResponse(response)
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

    if (!isMessageResponse(response)) {
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

    if (!isMessageResponse(response)) {
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

    if (!isMessageResponse(response)) {
        throw {
            message: "The server returned an invalid email verification response.",
        };
    }

    return response as EmailVerificationResponse;
}

export async function resendOTP(): Promise<ResendOTPResponse> {
    const response = await authFetch("/profile/resend-otp/", {
        method: "POST",
        body: JSON.stringify({}),
    });

    if (!isMessageResponse(response)) {
        throw {
            message: "The server returned an invalid OTP resend response.",
        };
    }

    return response as ResendOTPResponse;
}