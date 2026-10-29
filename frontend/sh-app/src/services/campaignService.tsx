import { authFetch } from "@/lib/api";
import type {
    CampaignCreatePayload,
    CampaignCreateResponse,
    CampaignCreateErrors,
    CampaignListResponse,
} from "@/types/campaign";

export async function getCampaigns(): Promise<CampaignListResponse> {
    return (await authFetch("/campaign/", {
        method: "GET",
    })) as CampaignListResponse;
}

export async function createCampaign(
    payload: CampaignCreatePayload
): Promise<CampaignCreateResponse> {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);
    formData.append("donation_type", payload.donation_type);
    formData.append("currency", payload.currency);
    formData.append("start_date", payload.start_date);
    formData.append("end_date", payload.end_date);

    if (payload.goal_amount !== "") {
        formData.append("goal_amount", payload.goal_amount);
    }

    if (payload.goal_quantity !== "") {
        formData.append("goal_quantity", payload.goal_quantity);
    }

    if (payload.goal_item_name !== "") {
        formData.append("goal_item_name", payload.goal_item_name);
    }

    if (payload.status) {
        formData.append("status", payload.status);
    }

    if (payload.campaign_image) {
        formData.append("campaign_image", payload.campaign_image);
    }

    try {
        return (await authFetch("/campaign/", {
            method: "POST",
            body: formData,
        })) as CampaignCreateResponse;
    } catch (error: unknown) {
        throw error as CampaignCreateErrors;
    }
}