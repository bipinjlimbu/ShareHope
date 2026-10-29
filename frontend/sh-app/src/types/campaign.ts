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

export interface Campaign {
    id: number;
    ngo: NGOListItem;
    title: string;
    description: string;
    category: string;
    donation_type: CampaignDonationType;
    goal_amount: string | null;
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

export type CampaignListResponse = Campaign[];