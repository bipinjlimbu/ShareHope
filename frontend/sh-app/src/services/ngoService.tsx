import { authFetch } from "@/lib/api";
import type {
    NGORegistrationPayload,
    NGORegistrationResponse,
} from "@/types/ngo";

export async function registerNGO(
    payload: NGORegistrationPayload
): Promise<NGORegistrationResponse> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append(
        "registration_number",
        payload.registration_number
    );
    formData.append("description", payload.description);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);
    formData.append("ngo_logo", payload.ngo_logo);
    formData.append(
        "ngo_document_type",
        payload.ngo_document_type
    );
    formData.append(
        "ngo_document_file",
        payload.ngo_document_file
    );

    const response = await authFetch("/register/ngo/", {
        method: "POST",
        body: formData,
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("message" in response) ||
        typeof response.message !== "string"
    ) {
        throw {
            message: "The server returned an invalid NGO registration response.",
        };
    }

    return {
        message: response.message,
    };
}