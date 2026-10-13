import type { AuthUser } from "@/types/auth";

export type ProfileUser = AuthUser & {
    username: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
    profile_picture?: string | null;
};
