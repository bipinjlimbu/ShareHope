import { apiFetch } from "@/lib/api";
import type {
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

    return apiFetch("/profile/", {
        method: "PUT",
        body: formData,
    }) as Promise<ProfileUpdateResponse>;
}