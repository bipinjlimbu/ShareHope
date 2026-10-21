export type DashboardRole =
    | "ADMIN"
    | "DONOR"
    | "NGO_ADMIN"
    | "NGO_STAFF";

export interface DashboardNavItem {
    label: string;
    href: string;
    icon: string;
}
