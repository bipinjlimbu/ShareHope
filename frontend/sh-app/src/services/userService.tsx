import { authFetch } from "@/lib/api";
import type {
    User,
    UpdateUserStatusPayload,
    UpdateUserStatusResponse,
} from "@/types/user";

export async function getUsers(): Promise<User[]> {
    const response: unknown = await authFetch("/users/", {
        method: "GET",
    });

    if (!Array.isArray(response)) {
        throw new Error("Invalid users API response.");
    }

    return response as User[];
}

export async function getUserById(id: number): Promise<User> {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid user ID.");
    }

    const response: unknown = await authFetch(`/users/${id}/`, {
        method: "GET",
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("id" in response) ||
        typeof response.id !== "number"
    ) {
        throw new Error("Invalid user detail API response.");
    }

    return response as User;
}

export async function updateUserStatus(
    userId: number,
    isActive: boolean
): Promise<UpdateUserStatusResponse> {
    if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error("Invalid user ID.");
    }

    const payload: UpdateUserStatusPayload = {
        is_active: isActive ? "true" : "false",
    };

    const response: unknown = await authFetch(`/users/${userId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (
        typeof response !== "object" ||
        response === null ||
        !("message" in response) ||
        typeof response.message !== "string"
    ) {
        throw new Error("Invalid user status update API response.");
    }

    return response as UpdateUserStatusResponse;
}