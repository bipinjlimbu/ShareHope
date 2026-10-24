import { authFetch } from "@/lib/api";
import type { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
    const response = await authFetch("/users/", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users.");
    }

    return response.json() as Promise<User[]>;
}