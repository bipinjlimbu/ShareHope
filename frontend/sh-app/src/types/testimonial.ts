import type { User } from "@/types/user";

export interface Testimonial {
    id: number;
    user: User | null;
    rating: number;
    comment: string;
    created_at: string;
}

export type TestimonialListResponse = Testimonial[];

export interface CreateTestimonialRequest {
    rating: number;
    comment: string;
}

export interface CreateTestimonialResponse {
    message: string;
}

export interface CreateTestimonialErrors {
    authentication?: string;
    rating?: string;
    comment?: string;
    [key: string]: string | undefined;
}

export interface UpdateTestimonialRequest {
    rating: number;
    comment: string;
}

export interface UpdateTestimonialResponse {
    message: string;
}

export interface UpdateTestimonialErrors {
    error?: string;
    authentication?: string;
    rating?: string;
    comment?: string;
    [key: string]: string | undefined;
}