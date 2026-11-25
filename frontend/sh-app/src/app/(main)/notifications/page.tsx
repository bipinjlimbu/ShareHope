"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    RotateCcw,
    Trash2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type {
    NotificationItem,
    NotificationType,
} from "@/types/notification";

import {
    getNotifications,
    toggleAllNotificationsReadStatus,
    toggleNotificationReadStatus,
    deleteNotificationById,
    deleteAllNotifications,
} from "@/services/notificationService";

import { getAuthStatus } from "@/lib/authStatus";
import { useToast } from "@/components/toast/ToastProvider";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type NotificationFilter = "ALL" | "UNREAD" | "READ";

type NotificationStyle = {
    icon: LucideIcon;
    iconColor: string;
    iconBackground: string;
    label: string;
};

type DeleteModalState =
    | { type: "single"; notification: NotificationItem }
    | { type: "all" }
    | null;

function getErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const response = error as Record<string, unknown>;

        if (typeof response.message === "string") return response.message;
        if (typeof response.detail === "string") return response.detail;
        if (typeof response.error === "string") return response.error;
    }

    return "Something went wrong. Please try again.";
}

const notificationStyles: Record<NotificationType, NotificationStyle> = {
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

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [activeFilter, setActiveFilter] =
        useState<NotificationFilter>("ALL");

    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);

    const [updatingNotificationIds, setUpdatingNotificationIds] =
        useState<Set<number>>(new Set());

    const [deleteModal, setDeleteModal] =
        useState<DeleteModalState>(null);

    const [isDeleting, setIsDeleting] = useState(false);

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

    // Fetch notifications.
    const loadNotifications = useCallback(async () => {
        setIsLoading(true);
        setLoadError(false);

        try {
            const response = await getNotifications();
            setNotifications(response);
        } catch (error: unknown) {
            setLoadError(true);
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        if (!isAuthChecked) return;

        void loadNotifications();
    }, [isAuthChecked, loadNotifications]);

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

    // Toggle all notifications between read and unread.
    const handleToggleAllReadStatus = async () => {
        if (
            notifications.length === 0 ||
            isUpdatingAll ||
            updatingNotificationIds.size > 0 ||
            isDeleting
        ) {
            return;
        }

        setIsUpdatingAll(true);

        try {
            const response = await toggleAllNotificationsReadStatus();

            const markedAsRead =
                response.message === "All notifications marked as read.";

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    is_read: markedAsRead,
                }))
            );

            showToast(
                response.message || "Notification status updated successfully.",
                "success"
            );
        } catch (error: unknown) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsUpdatingAll(false);
        }
    };

    // Toggle an individual notification between read and unread.
    const handleToggleNotificationReadStatus = async (
        notificationId: number
    ) => {
        if (
            updatingNotificationIds.has(notificationId) ||
            isUpdatingAll ||
            isDeleting
        ) {
            return;
        }

        setUpdatingNotificationIds((previous) => {
            const updated = new Set(previous);
            updated.add(notificationId);
            return updated;
        });

        try {
            const response =
                await toggleNotificationReadStatus(notificationId);

            const markedAsUnread =
                response.message.toLowerCase().includes("unread");

            const markedAsRead =
                response.message.toLowerCase().includes("marked as read");

            if (!markedAsUnread && !markedAsRead) {
                throw new Error(
                    "Unable to determine the updated notification status."
                );
            }

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === notificationId
                        ? {
                            ...notification,
                            is_read: markedAsRead,
                        }
                        : notification
                )
            );

            showToast(
                response.message || "Notification status updated successfully.",
                "success"
            );
        } catch (error: unknown) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setUpdatingNotificationIds((previous) => {
                const updated = new Set(previous);
                updated.delete(notificationId);
                return updated;
            });
        }
    };

    // Open individual delete confirmation.
    const handleOpenSingleDeleteModal = (
        notification: NotificationItem
    ) => {
        if (
            isUpdatingAll ||
            updatingNotificationIds.size > 0 ||
            isDeleting
        ) {
            return;
        }

        setDeleteModal({
            type: "single",
            notification,
        });
    };

    // Open delete-all confirmation.
    const handleOpenDeleteAllModal = () => {
        if (
            notifications.length === 0 ||
            isUpdatingAll ||
            updatingNotificationIds.size > 0 ||
            isDeleting
        ) {
            return;
        }

        setDeleteModal({ type: "all" });
    };

    // Close confirmation modal.
    const handleCloseDeleteModal = () => {
        if (isDeleting) return;

        setDeleteModal(null);
    };

    // Delete an individual notification or all notifications.
    const handleConfirmDelete = async () => {
        if (!deleteModal || isDeleting) return;

        setIsDeleting(true);

        try {
            if (deleteModal.type === "single") {
                const response = await deleteNotificationById(
                    deleteModal.notification.id
                );

                setNotifications((previous) =>
                    previous.filter(
                        (notification) =>
                            notification.id !== deleteModal.notification.id
                    )
                );

                showToast(
                    response.message || "Notification deleted successfully.",
                    "success"
                );
            } else {
                const response = await deleteAllNotifications();

                setNotifications([]);

                showToast(
                    response.message ||
                    "All notifications deleted successfully.",
                    "success"
                );
            }

            setDeleteModal(null);
        } catch (error: unknown) {
            showToast(getErrorMessage(error), "error");
        } finally {
            setIsDeleting(false);
        }
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

    // Authentication loading state.
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

    // Notification loading state.
    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#FFFCF6] px-5 py-12 sm:px-8 sm:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <div className="mx-auto h-9 w-36 animate-pulse rounded-full bg-[#E5EDE3]" />

                        <div className="mx-auto mt-5 h-12 w-72 max-w-full animate-pulse rounded-xl bg-[#E5EDE3]" />

                        <div className="mx-auto mt-4 h-4 max-w-md animate-pulse rounded-lg bg-[#E5EDE3]" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5"
                            >
                                <div className="h-12 w-12 animate-pulse rounded-xl bg-[#E5F2E1]" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-32 animate-pulse rounded bg-[#E5EDE3]" />
                                    <div className="h-6 w-12 animate-pulse rounded bg-[#E5EDE3]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex items-start gap-4 rounded-2xl border border-[#E5EDE3] bg-white p-5"
                            >
                                <div className="h-12 w-12 animate-pulse rounded-xl bg-[#E5F2E1]" />

                                <div className="flex-1 space-y-3">
                                    <div className="h-4 w-48 max-w-full animate-pulse rounded bg-[#E5EDE3]" />
                                    <div className="h-3 w-full animate-pulse rounded bg-[#E5EDE3]" />
                                    <div className="h-3 w-28 animate-pulse rounded bg-[#E5EDE3]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    // Notification loading error.
    if (loadError) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#FFFCF6] px-5 py-16 sm:px-8">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F6ED] text-[#166534]">
                        <Bell size={28} />
                    </div>

                    <h1 className="mt-5 text-2xl font-extrabold text-[#14532D]">
                        Unable to load notifications
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[#718174]">
                        Something went wrong while retrieving your notifications.
                        Please try again.
                    </p>

                    <button
                        type="button"
                        onClick={() => void loadNotifications()}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#166534] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532D]"
                    >
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <>
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

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleToggleAllReadStatus}
                                    disabled={
                                        notifications.length === 0 ||
                                        isUpdatingAll ||
                                        updatingNotificationIds.size > 0 ||
                                        isDeleting
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8E8D4] bg-[#F0F7ED] px-4 py-2.5 text-sm font-semibold text-[#166534] transition hover:border-[#B8D8B1] hover:bg-[#E5F2E1] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCheck size={16} />

                                    {isUpdatingAll
                                        ? "Updating..."
                                        : unreadCount > 0
                                            ? "Mark all as read"
                                            : "Mark all as unread"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleOpenDeleteAllModal}
                                    disabled={
                                        notifications.length === 0 ||
                                        isUpdatingAll ||
                                        updatingNotificationIds.size > 0 ||
                                        isDeleting
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    Delete all
                                </button>
                            </div>
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
                                        isUpdating={updatingNotificationIds.has(
                                            notification.id
                                        )}
                                        isDeleting={isDeleting}
                                        onToggleReadStatus={
                                            handleToggleNotificationReadStatus
                                        }
                                        onDelete={handleOpenSingleDeleteModal}
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

            {/* Shared Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModal !== null}
                title={
                    deleteModal?.type === "all"
                        ? "Delete All Notifications?"
                        : "Delete Notification?"
                }
                description={
                    deleteModal?.type === "all"
                        ? "Are you sure you want to delete all your notifications? This will permanently remove every notification from your account. This action cannot be undone."
                        : "Are you sure you want to delete this notification? This action cannot be undone."
                }
                itemName={
                    deleteModal?.type === "single"
                        ? deleteModal.notification.title
                        : deleteModal?.type === "all"
                            ? `${notifications.length} notifications will be deleted`
                            : undefined
                }
                confirmText={
                    deleteModal?.type === "all"
                        ? "Delete All"
                        : "Delete Notification"
                }
                isDeleting={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </>
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
    isUpdating,
    isDeleting,
    onToggleReadStatus,
    onDelete,
}: {
    notification: NotificationItem;
    isUpdating: boolean;
    isDeleting: boolean;
    onToggleReadStatus: (notificationId: number) => void;
    onDelete: (notification: NotificationItem) => void;
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

            {/* Notification Actions */}
            <div className="flex shrink-0 items-start gap-2">
                {/* Toggle Read / Unread */}
                <button
                    type="button"
                    onClick={() => onToggleReadStatus(notification.id)}
                    disabled={isUpdating || isDeleting}
                    title={
                        notification.is_read
                            ? "Mark as unread"
                            : "Mark as read"
                    }
                    aria-label={
                        notification.is_read
                            ? `Mark ${notification.title} as unread`
                            : `Mark ${notification.title} as read`
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8E8D4] bg-white text-[#166534] transition hover:border-[#166534] hover:bg-[#166534] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#35A45C]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isUpdating ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#166534] border-t-transparent" />
                    ) : notification.is_read ? (
                        <RotateCcw size={16} />
                    ) : (
                        <Check size={17} />
                    )}
                </button>

                {/* Delete Notification */}
                <button
                    type="button"
                    onClick={() => onDelete(notification)}
                    disabled={isUpdating || isDeleting}
                    title="Delete notification"
                    aria-label={`Delete ${notification.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </article>
    );
}
