export type NGODocumentType = "REGISTRATION" | "TAX_EXEMPTION" | "OTHER";

export type NGOStatus = "PENDING" | "APPROVED" | "REJECTED";

export type NGOMembershipStatus = "ACTIVE" | "INACTIVE";

export interface NGORegistrationPayload {
    name: string;
    registration_number: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    ngo_logo: File | null;
    ngo_document_type: NGODocumentType | "";
    ngo_document_file: File | null;
}

export interface NGORegistrationResponse {
    message: string;
}

export type NGORegistrationErrors = Record<
    string,
    string | string[] | undefined
>;

export interface NGORegistrationFormErrors {
    name?: string;
    registration_number?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
    ngo_logo?: string;
    ngo_document_type?: string;
    ngo_document_file?: string;
    non_field_errors?: string;
    general?: string;
    [key: string]: string | undefined;
}

export interface NGOUserResponse {
    id?: number;
    name?: string;
    status?: NGOStatus | string;
    verification_status?: NGOStatus | string;
    rejection_reason?: string | null;
}

export interface NGOListUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    phone: string | null;
    profile_picture: string | null;
    is_verified: boolean;
    is_active: boolean;
}

export interface NGODocument {
    id: number;
    document_type: NGODocumentType | string;
    document_file: string;
    uploaded_at: string;
    ngo: number;
}

export interface NGOMembership {
    id: number;
    user: NGOListUser;
    status: NGOMembershipStatus | string;
    joined_at: string;
    ngo: number;
}

export interface NGOListItem {
    id: number;
    name: string;
    registration_number: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    status: NGOStatus | string;
    ngo_logo: string | null;
    created_at: string;
    documents: NGODocument[];
    members: NGOMembership[];
    document_count: number;
    membership_count: number;
    created_by: NGOListUser;
    reviewed_by: NGOListUser | null;
}

export type NGOListResponse = NGOListItem[];

export interface NGOPendingProps {
    onBackToProfile: () => void;
}

export interface NGORejectedProps {
    rejectionReason?: string;
    onBackToProfile: () => void;
}
