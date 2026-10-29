import { authFetch } from "@/lib/api";
import type { CampaignListResponse } from "@/types/campaign";

export async function getCampaigns(): Promise<CampaignListResponse> {
    return (await authFetch("/campaign/", {
        method: "GET",
    })) as CampaignListResponse;
}