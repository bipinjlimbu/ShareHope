export interface ContactPayload {
    name: string;
    email: string;
    message: string;
}

export interface ContactResponse {
    message: string;
}

export interface ContactErrors {
    name?: string;
    email?: string;
    message?: string;
    general?: string;
    [key: string]: string | undefined;
}
