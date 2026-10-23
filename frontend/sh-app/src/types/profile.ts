import type { AuthUser } from "@/types/auth";
import { ReactNode } from "react";

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

export type ProfileGetResponse = {
    user: ProfileUser;
};

export type ProfileUpdatePayload = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_picture?: File | null;
};

export type ProfileUpdateResponse = {
    message: string;
    user: ProfileUser;
};

export type ProfileDeleteResponse = {
    message: string;
};

export type EmailVerificationRequestResponse = {
    message: string;
};

export type EmailVerificationResponse = {
    message: string;
};

export type ResendOTPResponse = {
    message: string;
};

export type ProfileFormErrors = Record<string, string | string[]>;

export interface ProfileFieldProps {
    label: string;
    value?: string | null;
    icon: ReactNode;
}