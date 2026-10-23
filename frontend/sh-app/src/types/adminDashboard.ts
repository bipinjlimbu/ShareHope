export interface AdminDashboardStats {
    totalUsers: number;
    totalNGOs: number;
    totalCampaigns: number;
    totalDonations: number;
    pendingNGOs: number;
    pendingCampaigns: number;
    pendingVerifications: number;
    totalFundsRaised: number;
}

export interface DonationTrend {
    month: string;
    amount: number;
}

export interface AdminPendingItem {
    id: number | string;
    title: string;
    subtitle: string;
    createdAt: string;
    type: "NGO" | "CAMPAIGN" | "VERIFICATION";
    href: string;
}

export interface AdminRecentDonation {
    id: number | string;
    donorName: string;
    campaignName: string;
    amount: number;
    donationType: "FUND" | "ITEM";
    status: string;
    createdAt: string;
}

export interface AdminDashboardData {
    stats: AdminDashboardStats;
    donationTrends: DonationTrend[];
    pendingItems: AdminPendingItem[];
    recentDonations: AdminRecentDonation[];
}