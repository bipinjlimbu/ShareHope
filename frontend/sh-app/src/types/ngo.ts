export interface NGORegistrationPayload {
    name: string;
    registration_number: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    ngo_logo: File;
    ngo_document_type: string;
    ngo_document_file: File;
}

export interface NGORegistrationResponse {
    message: string;
}

export interface NGORegistrationErrors {
    [field: string]: string | string[] | undefined;
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
    general?: string;
}