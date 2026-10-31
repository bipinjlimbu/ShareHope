import { authFetch } from "@/lib/api";
import type {
    Campaign,
    CampaignCreatePayload,
    CampaignCreateResponse,
    CampaignCreateErrors,
    CampaignListResponse,
    CampaignUpdatePayload,
    CampaignUpdateResponse,
    CampaignUpdateErrors,
    CampaignDeleteResponse,
    CampaignDeleteErrors,
    CampaignStatusUpdatePayload,
    CampaignStatusUpdateResponse,
    CampaignStatusUpdateErrors,
    CampaignApproveResponse,
    CampaignApproveErrors,
    CampaignRejectResponse,
    CampaignRejectErrors,
    PendingCampaignChange,
    PendingCampaignChangeListResponse,
    PendingCampaignChangeStatus,
    PendingCampaignChangeStatusResponse,
    PendingCampaignChangeStatusErrors,
} from "@/types/campaign";

export async function getCampaigns(): Promise<CampaignListResponse> {
    return (await authFetch("/campaign/", {
        method: "GET",
    })) as CampaignListResponse;
}

export async function getCampaignById(id: number): Promise<Campaign> {
    return (await authFetch(`/campaign/${id}/`, {
        method: "GET",
    })) as Campaign;
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

export async function updateCampaign(
    id: number,
    payload: CampaignUpdatePayload
): Promise<CampaignUpdateResponse> {
    const formData = new FormData();

    if (payload.title !== undefined) {
        formData.append("title", payload.title);
    }

    if (payload.description !== undefined) {
        formData.append("description", payload.description);
    }

    if (payload.goal_amount !== undefined) {
        formData.append("goal_amount", payload.goal_amount);
    }

    if (payload.goal_quantity !== undefined) {
        formData.append("goal_quantity", payload.goal_quantity);
    }

    if (payload.end_date !== undefined) {
        formData.append("end_date", payload.end_date);
    }

    if (payload.campaign_image) {
        formData.append("campaign_image", payload.campaign_image);
    }

    try {
        return (await authFetch(`/campaign/${id}/`, {
            method: "PUT",
            body: formData,
        })) as CampaignUpdateResponse;
    } catch (error: unknown) {
        throw error as CampaignUpdateErrors;
    }
}

export async function updateCampaignStatus(
    id: number,
    payload: CampaignStatusUpdatePayload
): Promise<CampaignStatusUpdateResponse> {
    try {
        return (await authFetch(`/campaign/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })) as CampaignStatusUpdateResponse;
    } catch (error: unknown) {
        throw error as CampaignStatusUpdateErrors;
    }
}

export async function deleteCampaign(
    id: number
): Promise<CampaignDeleteResponse> {
    try {
        return (await authFetch(`/campaign/${id}/`, {
            method: "DELETE",
        })) as CampaignDeleteResponse;
    } catch (error: unknown) {
        throw error as CampaignDeleteErrors;
    }
}

export async function approveCampaign(
    id: number
): Promise<CampaignApproveResponse> {
    try {
        return await updateCampaignStatus(id, {
            status: "APPROVED",
        });
    } catch (error: unknown) {
        throw error as CampaignApproveErrors;
    }
}

export async function rejectCampaign(
    id: number
): Promise<CampaignRejectResponse> {
    try {
        return await updateCampaignStatus(id, {
            status: "REJECTED",
        });
    } catch (error: unknown) {
        throw error as CampaignRejectErrors;
    }
}

export async function getPendingCampaignChanges(): Promise<PendingCampaignChangeListResponse> {
    return (await authFetch("/campaign/pending-change/", {
        method: "GET",
    })) as PendingCampaignChangeListResponse;
}

export async function getPendingCampaignChangeById(
    id: number
): Promise<PendingCampaignChange> {
    return (await authFetch(`/campaign/pending-change/${id}/`, {
        method: "GET",
    })) as PendingCampaignChange;
}

export async function updatePendingCampaignChangeStatus(
    id: number,
    status: PendingCampaignChangeStatus
): Promise<PendingCampaignChangeStatusResponse> {
    try {
        return (await authFetch(`/campaign/pending-change/${id}/`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        })) as PendingCampaignChangeStatusResponse;
    } catch (error: unknown) {
        throw error as PendingCampaignChangeStatusErrors;
    }
}

export async function approvePendingCampaignChange(
    id: number
): Promise<PendingCampaignChangeStatusResponse> {
    try {
        return await updatePendingCampaignChangeStatus(id, "APPROVED");
    } catch (error: unknown) {
        throw error as PendingCampaignChangeStatusErrors;
    }
}

export async function rejectPendingCampaignChange(
    id: number
): Promise<PendingCampaignChangeStatusResponse> {
    try {
        return await updatePendingCampaignChangeStatus(id, "REJECTED");
    } catch (error: unknown) {
        throw error as PendingCampaignChangeStatusErrors;
    }
}