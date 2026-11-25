import { authFetch } from "@/lib/api";

import type {
    NotificationResponse,
    ToggleAllNotificationsReadStatusResponse,
    DeleteAllNotificationsResponse,
} from "@/types/notification";

export async function getNotifications(): Promise<NotificationResponse> {
    return (await authFetch("/notification/", {
        method: "GET",
    })) as NotificationResponse;
}

export async function toggleAllNotificationsReadStatus(): Promise<ToggleAllNotificationsReadStatusResponse> {
    return (await authFetch("/notification/", {
        method: "PATCH",
    })) as ToggleAllNotificationsReadStatusResponse;
}

export async function deleteAllNotifications(): Promise<DeleteAllNotificationsResponse> {
    return (await authFetch("/notification/", {
        method: "DELETE",
    })) as DeleteAllNotificationsResponse;
}
