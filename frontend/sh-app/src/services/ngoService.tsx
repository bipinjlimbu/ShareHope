import { authFetch } from "@/lib/api";
import type {
    NGORegistrationPayload,
    NGORegistrationResponse,
    NGORegistrationErrors,
    NGOUserResponse,
} from "@/types/ngo";

export async function registerNGO(
    payload: NGORegistrationPayload
): Promise<NGORegistrationResponse> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("registration_number", payload.registration_number);
    formData.append("description", payload.description);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);
    formData.append("ngo_document_type", payload.ngo_document_type);

    if (payload.ngo_logo) {
        formData.append("ngo_logo", payload.ngo_logo);
    }

    if (payload.ngo_document_file) {
        formData.append("ngo_document_file", payload.ngo_document_file);
    }

    try {
        return (await authFetch("/register/ngo/", {
            method: "POST",
            body: formData,
        })) as NGORegistrationResponse;
    } catch (error: unknown) {
        throw error as NGORegistrationErrors;
    }
}

export async function getNGOs() {
    return await authFetch("/ngo/", {
        method: "GET",
    });
}

export async function getNGOByUser(): Promise<NGOUserResponse> {
    return (await authFetch("/ngo/user", {
        method: "GET",
    })) as NGOUserResponse;
}