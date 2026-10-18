export interface RegisterPayload {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: "DONOR" | "NGO_ADMIN";
    phone?: string;
    profile_picture?: File | null;
}

export interface RegisterResponse {
    message: string;
}

export interface RegisterErrors {
    [field: string]: string | string[] | undefined;
}

export interface LoginPayload {
    login_credential: string;
    password: string;
}

export interface AuthUser {
    id: number | string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    profile_picture?: string | null;
    [key: string]: unknown;
}

export interface LoginResponse {
    message: string;
    user: AuthUser;
}

export interface LogoutResponse {
    message: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}