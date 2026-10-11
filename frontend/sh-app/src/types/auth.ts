export interface RegisterPayload {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: "ADMIN" | "DONOR" | "NGO_ADMIN";
    phone?: string;
    profile_picture?: File | null;
}

export interface RegisterResponse {
    message: string;
}

export interface RegisterErrors {
    [field: string]: string | string[] | undefined;
}