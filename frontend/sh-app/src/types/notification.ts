import type { User } from "@/types/user";

export type NotificationType =
    | "USER"
    | "NGO"
    | "PROFILE"
    | "CAMPAIGN"
    | "DONATION"
    | "TESTIMONIAL"
    | "INVITATION"
    | "CONTACT"
    | "PAYMENT"
    | "REPORT"
    | "AUDIT";

export interface NotificationItem {
    id: number;
    user: User;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export type NotificationResponse = NotificationItem[];
