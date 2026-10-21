export interface NGORegistrationPayload {
    name: string;
    registration_number: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    ngo_logo: File | null;
    ngo_document_type: string;
    ngo_document_file: File | null;
}

export type NGORegistrationErrors = Record<
    string,
    string | string[] | undefined
>;

export interface NGORegistrationResponse {
    message: string;
}

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