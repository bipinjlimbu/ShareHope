import {
    Building2,
    UserRound,
    UserCircle,
    Megaphone,
    HandHeart,
    Star,
    Mail,
    CreditCard,
    FileText,
    ClipboardCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { NotificationType } from "@/types/notification";

export type NotificationUserRole =
    | "ADMIN"
    | "DONOR"
    | "NGO_ADMIN"
    | "NGO_STAFF";

export interface NotificationConfiguration {
    icon: LucideIcon;
    iconColor: string;
    iconBackground: string;
    label: string;
    getHref: (role?: string) => string;
}

function getDonationHref(role?: string): string {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin/donations";

        case "NGO_ADMIN":
        case "NGO_STAFF":
            return "/dashboard/ngo/donations";

        case "DONOR":
        default:
            return "/dashboard/donor/donations";
    }
}

function getPaymentHref(role?: string): string {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin/payments";

        case "NGO_ADMIN":
        case "NGO_STAFF":
            return "/dashboard/ngo/donations";

        case "DONOR":
        default:
            return "/dashboard/donor/donations";
    }
}

export const NOTIFICATION_CONFIG: Record<
    NotificationType,
    NotificationConfiguration
> = {
    USER: {
        icon: UserCircle,
        iconColor: "text-blue-600",
        iconBackground: "bg-blue-50",
        label: "Account",
        getHref: (role) =>
            role === "ADMIN"
                ? "/dashboard/admin/users"
                : "/profile",
    },

    NGO: {
        icon: Building2,
        iconColor: "text-emerald-700",
        iconBackground: "bg-emerald-50",
        label: "Organization",
        getHref: () => "/ngos",
    },

    PROFILE: {
        icon: UserRound,
        iconColor: "text-violet-600",
        iconBackground: "bg-violet-50",
        label: "Profile",
        getHref: () => "/profile",
    },

    CAMPAIGN: {
        icon: Megaphone,
        iconColor: "text-orange-600",
        iconBackground: "bg-orange-50",
        label: "Campaign",
        getHref: () => "/campaigns",
    },

    DONATION: {
        icon: HandHeart,
        iconColor: "text-pink-600",
        iconBackground: "bg-pink-50",
        label: "Donation",
        getHref: (role) => getDonationHref(role),
    },

    TESTIMONIAL: {
        icon: Star,
        iconColor: "text-amber-600",
        iconBackground: "bg-amber-50",
        label: "Testimonial",
        getHref: () => "/testimonials",
    },

    INVITATION: {
        icon: Mail,
        iconColor: "text-indigo-600",
        iconBackground: "bg-indigo-50",
        label: "Invitation",
        getHref: () => "/invitations",
    },

    CONTACT: {
        icon: Mail,
        iconColor: "text-cyan-600",
        iconBackground: "bg-cyan-50",
        label: "Contact",
        getHref: () => "/contact",
    },

    PAYMENT: {
        icon: CreditCard,
        iconColor: "text-green-700",
        iconBackground: "bg-green-50",
        label: "Payment",
        getHref: (role) => getPaymentHref(role),
    },

    REPORT: {
        icon: FileText,
        iconColor: "text-sky-600",
        iconBackground: "bg-sky-50",
        label: "Report",
        getHref: () => "/dashboard/admin/reports",
    },

    AUDIT: {
        icon: ClipboardCheck,
        iconColor: "text-slate-600",
        iconBackground: "bg-slate-100",
        label: "Audit",
        getHref: () => "/dashboard/admin/audit-logs",
    },
};

export function getNotificationConfiguration(
    type: NotificationType,
    role?: string
): NotificationConfiguration {
    const configuration = NOTIFICATION_CONFIG[type];

    return configuration;
}