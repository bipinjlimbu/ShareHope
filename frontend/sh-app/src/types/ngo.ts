export type NGODocumentType = "REGISTRATION" | "TAX_EXEMPTION" | "OTHER";

export type NGOStatus = "PENDING" | "APPROVED" | "REJECTED";

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

export interface NGOListItem {
    id: number;
    name: string;
    [key: string]: unknown;
}

export type NGOListResponse = NGOListItem[];

export interface NGOPendingProps {
    onBackToProfile: () => void;
}

export interface NGORejectedProps {
    rejectionReason?: string;
    onBackToProfile: () => void;
}