import { authFetch } from "@/lib/api";
import type {
    ContactPayload,
    ContactResponse,
    ContactErrors,
} from "@/types/main";

export async function sendContactMessage(
    payload: ContactPayload
): Promise<ContactResponse> {
    try {
        return (await authFetch("/contact/", {
            method: "POST",
            body: JSON.stringify(payload),
        })) as ContactResponse;
    } catch (error: unknown) {
        throw error as ContactErrors;
    }
}
