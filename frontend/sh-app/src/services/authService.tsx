
import { apiFetch } from "@/lib/api";
import type { RegisterPayload, RegisterResponse } from "@/types/auth";

export async function registerUser(
    payload: RegisterPayload
): Promise<RegisterResponse> {
    const formData = new FormData();

    formData.append("username", payload.username);
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("confirm_password", payload.confirm_password);

    if (payload.phone) {
        formData.append("phone", payload.phone);
    }

    if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
    }

    return apiFetch("/api/register/", {
        method: "POST",
        body: formData,
    });
}
