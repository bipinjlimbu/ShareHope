
"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    Check,
    CheckCheck,
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
    Inbox,
    Sparkles,
    Clock3,
    Filter,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type {
    NotificationItem,
    NotificationType,
} from "@/types/notification";
import type { User } from "@/types/user";

import { getAuthStatus } from "@/lib/authStatus";
import { useToast } from "@/components/toast/ToastProvider";

type NotificationFilter = "ALL" | "UNREAD" | "READ";

type NotificationStyle = {
    icon: LucideIcon;
    iconColor: string;
    iconBackground: string;
    label: string;
};

// Dummy user for notification data.
const dummyUser = {
    id: 1,
} as User;

// Dummy notification data.
const initialNotifications: NotificationItem[] = [
    {
        id: 1,
        user: dummyUser,
        type: "DONATION",
        title: "New donation received",
        message:
            "You have received a new donation of NPR 5,000 for the Education Support Campaign.",
        is_read: false,
        created_at: new Date(
            Date.now() - 5 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 2,
        user: dummyUser,
        type: "CAMPAIGN",
        title: "Campaign approved",
        message:
            "Your campaign 'Support Children's Education' has been approved and is now active.",
        is_read: false,
        created_at: new Date(
            Date.now() - 35 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 3,
        user: dummyUser,
        type: "NGO",
        title: "NGO registration approved",
        message:
            "Congratulations! Your NGO registration has been successfully approved by the administrator.",
        is_read: false,
        created_at: new Date(
            Date.now() - 2 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 4,
        user: dummyUser,
        type: "PAYMENT",
        title: "Payment successful",
        message:
            "Your donation payment of NPR 2,500 was completed successfully.",
        is_read: true,
        created_at: new Date(
            Date.now() - 5 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 5,
        user: dummyUser,
        type: "INVITATION",
        title: "New staff invitation",
        message:
            "You have received an invitation to join Helping Hands Foundation as an NGO staff member.",
        is_read: true,
        created_at: new Date(
            Date.now() - 24 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 6,
        user: dummyUser,
        type: "TESTIMONIAL",
        title: "New testimonial submitted",
        message:
            "A donor has shared a testimonial about their experience with your organization.",
        is_read: true,
        created_at: new Date(
            Date.now() - 30 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 7,
        user: dummyUser,
        type: "PROFILE",
        title: "Profile updated",
        message:
            "Your account profile information has been successfully updated.",
        is_read: true,
        created_at: new Date(
            Date.now() - 48 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 8,
        user: dummyUser,
        type: "REPORT",
        title: "Report generated",
        message:
            "Your requested campaign donation report is ready to view.",
        is_read: true,
        created_at: new Date(
            Date.now() - 72 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 9,
        user: dummyUser,
        type: "USER",
        title: "Welcome to ShareHope",
        message:
            "Welcome to ShareHope! Thank you for joining our community and helping create positive change.",
        is_read: true,
        created_at: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
    },
    {
        id: 10,
        user: dummyUser,
        type: "AUDIT",
        title: "Account activity recorded",
        message:
            "Your recent account activity has been successfully recorded in the system.",
        is_read: true,
        created_at: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
    },
];

const notificationStyles: Record<
    NotificationType,
    NotificationStyle
> = {
    USER: {
        icon: UserCircle,
        iconColor: "text-blue-600",
        iconBackground: "bg-blue-50",
        label: "Account",
    },
    NGO: {
        icon: Building2,
        iconColor: "text-emerald-700",
        iconBackground: "bg-emerald-50",
        label: "Organization",
    },
    PROFILE: {
        icon: UserRound,
        iconColor: "text-violet-600",
        iconBackground: "bg-violet-50",
        label: "Profile",
    },
    CAMPAIGN: {
        icon: Megaphone,
        iconColor: "text-orange-600",
        iconBackground: "bg-orange-50",
        label: "Campaign",
    },
    DONATION: {
        icon: HandHeart,
        iconColor: "text-pink-600",
        iconBackground: "bg-pink-50",
        label: "Donation",
    },
    TESTIMONIAL: {
        icon: Star,
        iconColor: "text-amber-600",
        iconBackground: "bg-amber-50",
        label: "Testimonial",
    },
    INVITATION: {
        icon: Mail,
        iconColor: "text-indigo-600",
        iconBackground: "bg-indigo-50",
        label: "Invitation",
    },
    CONTACT: {
        icon: Mail,
        iconColor: "text-cyan-600",
        iconBackground: "bg-cyan-50",
        label: "Contact",
    },
    PAYMENT: {
        icon: CreditCard,
        iconColor: "text-green-700",
        iconBackground: "bg-green-50",
        label: "Payment",
    },
    REPORT: {
        icon: FileText,
        iconColor: "text-sky-600",
        iconBackground: "bg-sky-50",
        label: "Report",
    },
    AUDIT: {
        icon: ClipboardCheck,
        iconColor: "text-slate-600",
        iconBackground: "bg-slate-100",
        label: "Audit",
    },
};

function formatNotificationDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    const difference = Math.max(0, now.getTime() - date.getTime());

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function NotificationsPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [notifications, setNotifications] =
        useState<NotificationItem[]>(initialNotifications);

    const [activeFilter, setActiveFilter] =
        useState<NotificationFilter>("ALL");

    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const redirectingRef = useRef(false);

    // Authentication check.
    useEffect(() => {
        const checkAuthStatus = () => {
            if (!getAuthStatus()) {
                if (!redirectingRef.current) {
                    redirectingRef.current = true;

                    showToast(
                        "You must be logged in to access your notifications.",
                        "error"
                    );

                    router.replace("/login");
                }

                return;
            }

            redirectingRef.current = false;
            setIsAuthChecked(true);
        };

        checkAuthStatus();

        window.addEventListener("auth-change", checkAuthStatus);

        return () => {
            window.removeEventListener("auth-change", checkAuthStatus);
        };
    }, [router, showToast]);

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    const readCount = notifications.length - unreadCount;

    const filteredNotifications = useMemo(() => {
        switch (activeFilter) {
            case "UNREAD":
                return notifications.filter(
                    (notification) => !notification.is_read
                );

            case "READ":
                return notifications.filter(
                    (notification) => notification.is_read
                );

            default:
                return notifications;
        }
    }, [notifications, activeFilter]);

    const handleMarkAsRead = (notificationId: number) => {
        setNotifications((previous) =>
            previous.map((notification) =>
                notification.id === notificationId
                    ? { ...notification, is_read: true }
                    : notification
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                is_read: true,
            }))
        );
    };

    const filters: {
        label: string;
        value: NotificationFilter;
        count: number;
    }[] = [
            {
                label: "All",
                value: "ALL",
                count: notifications.length,
            },
            {
                label: "Unread",
                value: "UNREAD",
                count: unreadCount,
            },
            {
                label: "Read",
                value: "READ",
                count: readCount,
            },
        ];

    // Do not render notifications before authentication is confirmed.
    if (!isAuthChecked || redirectingRef.current) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                        <Bell size={26} />
                    </div>

                    <div className="mt-5 h-6 w-36 animate-pulse rounded-lg bg-[#E5EDE3]" />

                    <p className="mt-3 text-sm text-[#829184]">
                        Checking your account...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
            <div className="mx-auto max-w-7xl">

                {/* Page Header */}
                <header className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2 text-sm font-semibold text-[#166534]">
                        <Bell size={16} />
                        Your Updates
                    </span>

                    <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#183B2A] sm:text-4xl lg:text-5xl">
                        Notifications
                        <span className="block text-[#29904C]">
                            Stay Connected
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#647568] sm:text-base">
                        Stay informed about your donations, campaigns,
                        organization activities, and important updates
                        from ShareHope.
                    </p>
                </header>

                {/* Notification Summary */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <SummaryCard
                        icon={Bell}
                        label="Total Notifications"
                        value={notifications.length}
                        iconColor="text-[#166534]"
                        iconBackground="bg-[#E5F2E1]"
                    />

                    <SummaryCard
                        icon={Inbox}
                        label="Unread Notifications"
                        value={unreadCount}
                        iconColor="text-orange-600"
                        iconBackground="bg-orange-50"
                    />

                    <SummaryCard
                        icon={CheckCheck}
                        label="Read Notifications"
                        value={readCount}
                        iconColor="text-blue-600"
                        iconBackground="bg-blue-50"
                    />
                </section>

                {/* Notification Toolbar */}
                <section className="mb-6 rounded-3xl border border-[#E5EDE3] bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <Filter
                                    size={17}
                                    className="text-[#29904C]"
                                />

                                <h2 className="text-base font-bold text-[#183B2A]">
                                    Your Activity
                                </h2>
                            </div>

                            <p className="mt-1 text-xs text-[#829184]">
                                Manage and keep track of your notifications.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2.5 text-sm font-semibold text-[#166534] transition hover:border-[#B8D8B1] hover:bg-[#E5F2E1] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                        >
                            <CheckCheck size={16} />
                            Mark all as read
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EDF2E9] pt-4">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeFilter === filter.value
                                    ? "bg-[#166534] text-white shadow-sm"
                                    : "border border-[#E5EDE3] bg-white text-[#647568] hover:border-[#B8D8B1] hover:bg-[#F0F7ED] hover:text-[#166534]"
                                    }`}
                            >
                                {filter.label}

                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${activeFilter === filter.value
                                        ? "bg-white/20 text-white"
                                        : "bg-[#F0F7ED] text-[#166534]"
                                        }`}
                                >
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notification List */}
                <section aria-label="Notifications">
                    {filteredNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {filteredNotifications.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-[#D5E3D0] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E5F2E1] text-[#166534]">
                                <Inbox size={30} strokeWidth={1.6} />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-[#183B2A]">
                                {activeFilter === "UNREAD"
                                    ? "You're all caught up!"
                                    : activeFilter === "READ"
                                        ? "No read notifications"
                                        : "No notifications yet"}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647568]">
                                {activeFilter === "UNREAD"
                                    ? "You don't have any unread notifications at the moment."
                                    : activeFilter === "READ"
                                        ? "Notifications you have already read will appear here."
                                        : "When there's something new, your notifications will appear here."}
                            </p>

                            {activeFilter !== "ALL" && (
                                <button
                                    type="button"
                                    onClick={() => setActiveFilter("ALL")}
                                    className="mt-5 rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                                >
                                    View all notifications
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Footer Note */}
                <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#829184]">
                    <Sparkles size={14} className="text-[#29904C]" />
                    <p>
                        Stay connected with everything happening on ShareHope.
                    </p>
                </div>
            </div>
        </main>
    );
}

function SummaryCard({
    icon: Icon,
    label,
    value,
    iconColor,
    iconBackground,
}: {
    icon: LucideIcon;
    label: string;
    value: number;
    iconColor: string;
    iconBackground: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5 shadow-sm transition hover:border-[#C9DFC4] hover:shadow-md">
            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
            >
                <Icon size={22} />
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-[#829184] sm:text-sm">
                    {label}
                </p>

                <p className="mt-1 text-2xl font-extrabold tabular-nums text-[#183B2A]">
                    {value}
                </p>
            </div>
        </div>
    );
}

function NotificationCard({
    notification,
    onMarkAsRead,
}: {
    notification: NotificationItem;
    onMarkAsRead: (notificationId: number) => void;
}) {
    const style = notificationStyles[notification.type];
    const Icon = style.icon;

    return (
        <article
            className={`group relative flex gap-3 overflow-hidden rounded-2xl border p-4 transition-all duration-200 sm:gap-4 sm:p-5 ${notification.is_read
                ? "border-[#E5EDE3] bg-white hover:border-[#C9DFC4] hover:shadow-md"
                : "border-[#D4E8CE] bg-[#F8FCF5] shadow-sm hover:border-[#B8D8B1] hover:shadow-md"
                }`}
        >
            {/* Unread Indicator */}
            {!notification.is_read && (
                <span
                    className="absolute bottom-0 left-0 top-0 w-1 bg-[#29904C]"
                    aria-label="Unread notification"
                />
            )}

            {/* Notification Icon */}
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${style.iconBackground} ${style.iconColor}`}
            >
                <Icon size={21} strokeWidth={1.8} />
            </div>

            {/* Notification Content */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3
                        className={`break-words text-sm sm:text-base ${notification.is_read
                            ? "font-semibold text-[#183B2A]"
                            : "font-bold text-[#183B2A]"
                            }`}
                    >
                        {notification.title}
                    </h3>

                    {!notification.is_read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#29904C]" />
                    )}
                </div>

                <p className="mt-1.5 text-xs leading-6 text-[#647568] sm:text-sm">
                    {notification.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.iconBackground} ${style.iconColor}`}
                    >
                        {style.label}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-[#829184]">
                        <Clock3 size={13} />
                        {formatNotificationDate(notification.created_at)}
                    </span>
                </div>
            </div>

            {/* Mark as Read */}
            {!notification.is_read && (
                <div className="flex shrink-0 items-start">
                    <button
                        type="button"
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Mark as read"
                        aria-label={`Mark ${notification.title} as read`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8E8D4] bg-white text-[#166534] transition hover:border-[#166534] hover:bg-[#166534] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#35A45C]/20"
                    >
                        <Check size={17} />
                    </button>
                </div>
            )}
        </article>
    );
}
