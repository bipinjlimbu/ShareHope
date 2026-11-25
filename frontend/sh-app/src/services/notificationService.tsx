import { authFetch } from "@/lib/api";

import type {
    NotificationResponse,
} from "@/types/notification";

export async function getNotifications(): Promise<NotificationResponse> {
    return (await authFetch("/notification/", {
        method: "GET",
    })) as NotificationResponse;
}
