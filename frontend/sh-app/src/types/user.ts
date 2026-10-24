export type UserRole = "ADMIN" | "DONOR" | "NGO_ADMIN" | "NGO_STAFF" | string;

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    profile_picture: string | null;
    role: UserRole;
    is_active: boolean;
    is_verified: boolean;
    date_joined: string;
    last_login: string | null;
}
