import { authFetch } from "@/lib/api";
import type {
    ProfileDeleteResponse,
    ProfileUpdatePayload,
    ProfileUpdateResponse,
} from "@/types/profile";

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
        !("user" in response)
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
        !("message" in response)
    ) {
        throw {
            message: "The server returned an invalid delete response.",
        };
    }

    return response as ProfileDeleteResponse;
}
