import { authFetch } from "@/lib/api";

import type {
    NotificationResponse,
    NotificationItem,
    ToggleAllNotificationsReadStatusResponse,
    ToggleNotificationReadStatusResponse,
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

export async function getNotificationById(
    notificationId: number
): Promise<NotificationItem> {
    return (await authFetch(`/notification/${notificationId}/`, {
        method: "GET",
    })) as NotificationItem;
}

export async function toggleNotificationReadStatus(
    notificationId: number
): Promise<ToggleNotificationReadStatusResponse> {
    return (await authFetch(`/notification/${notificationId}/`, {
        method: "PATCH",
    })) as ToggleNotificationReadStatusResponse;
}