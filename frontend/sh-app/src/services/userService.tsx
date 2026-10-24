import { authFetch } from "@/lib/api";
import type { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
    const response: unknown = await authFetch("/users/", {
        method: "GET",
    });

    if (!Array.isArray(response)) {
        throw new Error("Invalid users API response.");
    }

    return response as User[];
}
