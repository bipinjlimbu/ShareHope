import type {
    DashboardRole,
    DashboardNavItem,
} from "@/types/dashboard";

export const dashboardNavigation: Record<
    DashboardRole,
    DashboardNavItem[]
> = {
    ADMIN: [
        { label: "Overview", href: "/dashboard/admin", icon: "layout-dashboard" },
        { label: "User Management", href: "/dashboard/admin/users", icon: "users" },
        { label: "NGO Management", href: "/dashboard/admin/ngos", icon: "building-2" },
        { label: "Pending NGO Approvals", href: "/dashboard/admin/pending-ngos", icon: "shield-check" },
        { label: "Campaigns", href: "/dashboard/admin/campaigns", icon: "hand-heart" },
        { label: "Pending Campaigns", href: "/dashboard/admin/pending-campaigns", icon: "shield-check" },
        { label: "Donations", href: "/dashboard/admin/donations", icon: "wallet" },
        { label: "Payments", href: "/dashboard/admin/payments", icon: "credit-card" },
        { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: "history" },
        { label: "Reports & Analytics", href: "/dashboard/admin/reports", icon: "chart-no-axes-combined" },
    ],

    DONOR: [
        { label: "Overview", href: "/dashboard/donor", icon: "layout-dashboard" },
        { label: "Explore Campaigns", href: "/dashboard/donor/campaigns", icon: "search" },
        { label: "My Donations", href: "/dashboard/donor/donations", icon: "heart" },
        { label: "Donation History", href: "/dashboard/donor/history", icon: "history" },
        { label: "Receipts", href: "/dashboard/donor/receipts", icon: "receipt" },
    ],

    NGO_ADMIN: [
        { label: "Overview", href: "/dashboard/ngo-admin", icon: "layout-dashboard" },
        { label: "My Campaigns", href: "/dashboard/ngo-admin/campaigns", icon: "hand-heart" },
        { label: "Received Donations", href: "/dashboard/ngo-admin/donations", icon: "wallet" },
        { label: "Donation Verifications", href: "/dashboard/ngo-admin/verifications", icon: "shield-check" },
        { label: "Staff Management", href: "/dashboard/ngo-admin/staff", icon: "users" },
        { label: "Donation History", href: "/dashboard/ngo-admin/history", icon: "history" },
        { label: "Reports & Analytics", href: "/dashboard/ngo-admin/reports", icon: "chart-no-axes-combined" },
    ],

    NGO_STAFF: [
        { label: "Overview", href: "/dashboard/ngo-staff", icon: "layout-dashboard" },
        { label: "Assigned Tasks", href: "/dashboard/ngo-staff/tasks", icon: "clipboard-list" },
        { label: "Donation Verifications", href: "/dashboard/ngo-staff/verifications", icon: "shield-check" },
        { label: "Donation History", href: "/dashboard/ngo-staff/history", icon: "history" },
    ],
};