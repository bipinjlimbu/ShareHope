import type { User } from "@/types/user";
import type { NGOListItem } from "@/types/ngo";

export type CampaignStatus =
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELLED";

export type CampaignDonationType = "FUND" | "ITEM" | "BOTH";

export interface CampaignCreatePayload {
    title: string;
    description: string;
    category: string;
    donation_type: CampaignDonationType;
    goal_amount: string;
    goal_quantity: string;
    goal_item_name: string;
    currency: string;
    start_date: string;
    end_date: string;
    status?: CampaignStatus | "";
    campaign_image: File | null;
}

export interface CampaignUpdatePayload {
    title?: string;
    description?: string;
    goal_amount?: string;
    goal_quantity?: string;
    end_date?: string;
    campaign_image?: File | null;
}

export interface CampaignCreateResponse {
    message: string;
}

export interface CampaignUpdateResponse {
    message: string;
}

export interface CampaignDeleteResponse {
    message: string;
}

export interface CampaignApproveResponse {
    message: string;
}

export interface CampaignRejectResponse {
    message: string;
}

export type CampaignCreateErrors = Record<
    string,
    string | string[] | undefined
>;

export type CampaignUpdateErrors = Record<
    string,
    string | string[] | undefined
>;

export type CampaignDeleteErrors = Record<
    string,
    string | string[] | undefined
>;

export type CampaignApproveErrors = Record<
    string,
    string | string[] | undefined
>;

export type CampaignRejectErrors = Record<
    string,
    string | string[] | undefined
>;

export interface CampaignCreateFormErrors {
    title?: string;
    description?: string;
    category?: string;
    donation_type?: string;
    goal_amount?: string;
    goal_quantity?: string;
    goal_item_name?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    campaign_image?: string;
    non_field_errors?: string;
    general?: string;
    [key: string]: string | undefined;
}

export interface CampaignUpdateFormErrors {
    title?: string;
    description?: string;
    goal_amount?: string;
    goal_quantity?: string;
    end_date?: string;
    campaign_image?: string;
    non_field_errors?: string;
    general?: string;
    [key: string]: string | undefined;
}

export interface Campaign {
    id: number;
    ngo: NGOListItem;
    title: string;
    description: string;
    category: string;
    donation_type: CampaignDonationType;
    goal_amount: string | null;
    collected_amount: string;
    collected_quantity: number;
    goal_quantity: number | null;
    goal_item_name: string;
    currency: string;
    start_date: string;
    end_date: string;
    status: CampaignStatus;
    campaign_image: string | null;
    created_by: User;
    reviewed_by: User | null;
    created_at: string;
}

export interface PendingCampaignChange {
    id: number;
    campaign: Campaign;
    title: string;
    description: string;
    goal_amount: string | null;
    goal_quantity: number | null;
    end_date: string | null;
    campaign_image: string | null;
    submitted_by: User;
    submitted_at: string;
}

export type CampaignListResponse = Campaign[];

export type PendingCampaignChangeListResponse = PendingCampaignChange[];