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

export interface ForgotPasswordSuccessProps {
    email: string;
    onContinue: () => void;
}

export interface ForgotPasswordFailedProps {
    message: string;
    onRetry: () => void;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    message: string;
}

export interface VerifyOtpSuccessProps {
    email: string;
    onContinue: () => void;
}

export interface VerifyOtpFailedProps {
    message: string;
    onRetry: () => void;
}

export interface ResetPasswordPayload {
    new_password: string;
    confirm_password: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface ResetPasswordSuccessProps {
    onContinue: () => void;
}

export interface ResetPasswordFailedProps {
    message: string;
    onRetry: () => void;
}

export type PageStatus = "form" | "success" | "failed";