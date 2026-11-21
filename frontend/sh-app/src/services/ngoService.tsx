import { authFetch } from "@/lib/api";
import type {
    NGORegistrationPayload,
    NGORegistrationResponse,
    NGORegistrationErrors,
    NGOUserResponse,
    NGOListResponse,
    NGOListItem,
    UpdateNGOStatusPayload,
    UpdateNGOStatusResponse,
    DeleteNGOResponse,
    RejectNGOResponse,
    ApproveNGOResponse,
    NGOChangeRequestPayload,
    NGOChangeRequestResponse,
    NGOChangeRequestErrors,
    PendingNGOChangeResponse,
    PendingNGOChangeDetailResponse,
    UpdateNGOChangeStatusPayload,
    UpdateNGOChangeStatusResponse,
    UpdateNGOChangeStatusErrors,
    NGOStaffResponse,
    NGOStaffRegistrationPayload,
    NGOStaffRegistrationResponse,
    NGOStaffRegistrationErrors,
    NGOStaffDetailResponse,
    UpdateNGOStaffStatusPayload,
    UpdateNGOStaffStatusResponse,
    UpdateNGOStaffStatusErrors,
    NGOStaffInvitationResponse,
    NGOStaffInvitationPayload,
    NGOStaffInvitationCreateResponse,
    NGOStaffInvitationErrors,
    NGOStaffInvitationDetailResponse,
    NGOStaffInvitationActionPayload,
    NGOStaffInvitationActionResponse,
    NGOStaffInvitationActionErrors,
} from "@/types/ngo";

export async function registerNGO(
    payload: NGORegistrationPayload
): Promise<NGORegistrationResponse> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("registration_number", payload.registration_number);
    formData.append("description", payload.description);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);
    formData.append("ngo_document_type", payload.ngo_document_type);

    if (payload.ngo_logo) {
        formData.append("ngo_logo", payload.ngo_logo);
    }

    if (payload.ngo_document_file) {
        formData.append("ngo_document_file", payload.ngo_document_file);
    }

    try {
        return (await authFetch("/ngo/", {
            method: "POST",
            body: formData,
        })) as NGORegistrationResponse;
    } catch (error: unknown) {
        throw error as NGORegistrationErrors;
    }
}

export async function getNGOs(): Promise<NGOListResponse> {
    return (await authFetch("/ngo/", {
        method: "GET",
    })) as NGOListResponse;
}

export async function getNGOById(
    ngoId: number
): Promise<NGOListItem> {
    return (await authFetch(`/ngo/${ngoId}/`, {
        method: "GET",
    })) as NGOListItem;
}

export async function getNGOByUser(): Promise<NGOUserResponse> {
    return (await authFetch("/ngo/user/", {
        method: "GET",
    })) as NGOUserResponse;
}

export async function deleteNGOByUser(): Promise<DeleteNGOResponse> {
    return (await authFetch("/ngo/user/", {
        method: "DELETE",
    })) as DeleteNGOResponse;
}

export async function updateNGO(
    ngoId: number,
    payload: NGOChangeRequestPayload
): Promise<NGOChangeRequestResponse> {
    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("registration_number", payload.registration_number);
    formData.append("description", payload.description);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);

    if (payload.ngo_logo) {
        formData.append("ngo_logo", payload.ngo_logo);
    }

    try {
        return (await authFetch(`/ngo/${ngoId}/`, {
            method: "PUT",
            body: formData,
        })) as NGOChangeRequestResponse;
    } catch (error: unknown) {
        throw error as NGOChangeRequestErrors;
    }
}

export async function getPendingNGOChanges(): Promise<PendingNGOChangeResponse> {
    return (await authFetch("/ngo/pending-change/", {
        method: "GET",
    })) as PendingNGOChangeResponse;
}

export async function getPendingNGOChangeById(
    pendingChangeId: number
): Promise<PendingNGOChangeDetailResponse> {
    return (await authFetch(`/ngo/pending-change/${pendingChangeId}/`, {
        method: "GET",
    })) as PendingNGOChangeDetailResponse;
}

export async function updateNGOChangeStatus(
    pendingChangeId: number,
    payload: UpdateNGOChangeStatusPayload
): Promise<UpdateNGOChangeStatusResponse> {
    try {
        return (await authFetch(
            `/ngo/pending-change/${pendingChangeId}/`,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            }
        )) as UpdateNGOChangeStatusResponse;
    } catch (error: unknown) {
        throw error as UpdateNGOChangeStatusErrors;
    }
}

export async function approveNGOChange(
    pendingChangeId: number
): Promise<UpdateNGOChangeStatusResponse> {
    return updateNGOChangeStatus(pendingChangeId, {
        status: "APPROVED",
    });
}

export async function rejectNGOChange(
    pendingChangeId: number
): Promise<UpdateNGOChangeStatusResponse> {
    return updateNGOChangeStatus(pendingChangeId, {
        status: "REJECTED",
    });
}

export async function updateNGOStatus(
    ngoId: number,
    payload: UpdateNGOStatusPayload
): Promise<UpdateNGOStatusResponse> {
    return (await authFetch(`/ngo/${ngoId}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    })) as UpdateNGOStatusResponse;
}

export async function approveNGO(
    ngoId: number
): Promise<ApproveNGOResponse> {
    return (await updateNGOStatus(ngoId, {
        status: "ACTIVE",
    })) as ApproveNGOResponse;
}

export async function rejectNGO(
    ngoId: number
): Promise<RejectNGOResponse> {
    return (await updateNGOStatus(ngoId, {
        status: "REJECTED",
    })) as RejectNGOResponse;
}

export async function activateNGO(
    ngoId: number
): Promise<UpdateNGOStatusResponse> {
    return updateNGOStatus(ngoId, {
        status: "ACTIVE",
    });
}

export async function deactivateNGO(
    ngoId: number
): Promise<UpdateNGOStatusResponse> {
    return updateNGOStatus(ngoId, {
        status: "INACTIVE",
    });
}

export async function deleteNGO(
    ngoId: number
): Promise<DeleteNGOResponse> {
    return (await authFetch(`/ngo/${ngoId}/`, {
        method: "DELETE",
    })) as DeleteNGOResponse;
}

export async function getNGOStaff(): Promise<NGOStaffResponse> {
    return (await authFetch("/ngo/staff/", {
        method: "GET",
    })) as NGOStaffResponse;
}

export async function registerNGOStaff(
    payload: NGOStaffRegistrationPayload
): Promise<NGOStaffRegistrationResponse> {
    const formData = new FormData();

    formData.append("username", payload.username);
    formData.append("first_name", payload.first_name);
    formData.append("last_name", payload.last_name);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("confirm_password", payload.confirm_password);
    formData.append("phone", payload.phone);

    if (payload.profile_picture) {
        formData.append("profile_picture", payload.profile_picture);
    }

    try {
        return (await authFetch("/ngo/staff/", {
            method: "POST",
            body: formData,
        })) as NGOStaffRegistrationResponse;
    } catch (error: unknown) {
        throw error as NGOStaffRegistrationErrors;
    }
}

export async function getNGOStaffById(
    membershipId: number
): Promise<NGOStaffDetailResponse> {
    return (await authFetch(`/ngo/staff/${membershipId}/`, {
        method: "GET",
    })) as NGOStaffDetailResponse;
}

export async function updateNGOStaffStatus(
    membershipId: number,
    payload: UpdateNGOStaffStatusPayload
): Promise<UpdateNGOStaffStatusResponse> {
    try {
        return (await authFetch(`/ngo/staff/${membershipId}/`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })) as UpdateNGOStaffStatusResponse;
    } catch (error: unknown) {
        throw error as UpdateNGOStaffStatusErrors;
    }
}

export async function deleteNGOStaff(
    membershipId: number
): Promise<void> {
    await authFetch(`/ngo/staff/${membershipId}/`, {
        method: "DELETE",
    });
}

export async function getNGOStaffInvitations(): Promise<NGOStaffInvitationResponse> {
    return (await authFetch("/ngo/staff/invitation/", {
        method: "GET",
    })) as NGOStaffInvitationResponse;
}

export async function sendNGOStaffInvitation(
    payload: NGOStaffInvitationPayload
): Promise<NGOStaffInvitationCreateResponse> {
    try {
        return (await authFetch("/ngo/staff/invitation/", {
            method: "POST",
            body: JSON.stringify(payload),
        })) as NGOStaffInvitationCreateResponse;
    } catch (error: unknown) {
        throw error as NGOStaffInvitationErrors;
    }
}

export async function getNGOStaffInvitationById(
    invitationId: number
): Promise<NGOStaffInvitationDetailResponse> {
    return (await authFetch(`/ngo/staff/invitation/${invitationId}/`, {
        method: "GET",
    })) as NGOStaffInvitationDetailResponse;
}

export async function respondToNGOStaffInvitation(
    invitationId: number,
    payload: NGOStaffInvitationActionPayload
): Promise<NGOStaffInvitationActionResponse> {
    try {
        return (await authFetch(
            `/ngo/staff/invitation/${invitationId}/`,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            }
        )) as NGOStaffInvitationActionResponse;
    } catch (error: unknown) {
        throw error as NGOStaffInvitationActionErrors;
    }
}

export async function acceptNGOStaffInvitation(
    invitationId: number
): Promise<NGOStaffInvitationActionResponse> {
    return respondToNGOStaffInvitation(invitationId, {
        action: "accept",
    });
}

export async function declineNGOStaffInvitation(
    invitationId: number
): Promise<NGOStaffInvitationActionResponse> {
    return respondToNGOStaffInvitation(invitationId, {
        action: "decline",
    });
}