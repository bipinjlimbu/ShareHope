export type UserRole = "ADMIN" | "DONOR" | "NGO_ADMIN" | "NGO_STAFF";

export type RoleFilter = "ALL" | "DONOR" | "NGO_ADMIN" | "NGO_STAFF";

export type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    phone: string | null;
    profile_picture: string | null;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    is_verified: boolean;
    date_joined: string;
    last_login: string | null;
}

export interface UpdateUserStatusPayload {
    is_active: "true" | "false";
}

export interface UpdateUserStatusResponse {
    message: string;
}

export interface DeleteUserResponse {
    message: string;
}