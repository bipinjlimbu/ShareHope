export type NGOStatus = "PENDING" | "APPROVED" | "REJECTED";

export type CampaignStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

export type DonationStatus =
    | "SUBMITTED"
    | "RECEIVED"
    | "VERIFIED"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export type DonationType = "FUND" | "ITEM";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface DemoUser {
    id: number;
    username: string;
    role: "ADMIN" | "DONOR" | "NGO_ADMIN" | "NGO_STAFF";
    is_verified: boolean;
    date_joined: string;
}

export interface DemoNGO {
    id: number;
    name: string;
    status: NGOStatus;
    created_at: string;
}

export interface DemoCampaign {
    id: number;
    title: string;
    ngo_name: string;
    status: CampaignStatus;
    donation_type: "FUND" | "ITEM" | "BOTH";
    goal_amount: number | null;
    created_at: string;
}

export interface DemoDonation {
    reference_number: string;
    donor_name: string;
    is_anonymous: boolean;
    campaign_title: string;
    donation_type: DonationType;
    status: DonationStatus;
    created_at: string;
    payment: {
        amount: number;
        currency: string;
        status: PaymentStatus;
    } | null;
}