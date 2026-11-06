import { authFetch } from "@/lib/api";
import type {
    TestimonialListResponse,
    CreateTestimonialRequest,
    CreateTestimonialResponse,
    CreateTestimonialErrors,
} from "@/types/testimonial";

export const getTestimonials = async (): Promise<TestimonialListResponse> => {
    return (await authFetch("/testimonial/", {
        method: "GET",
    })) as TestimonialListResponse;
};

export const createTestimonial = async (
    data: CreateTestimonialRequest
): Promise<CreateTestimonialResponse> => {
    try {
        return (await authFetch("/testimonial/", {
            method: "POST",
            body: JSON.stringify(data),
        })) as CreateTestimonialResponse;
    } catch (error) {
        throw error as CreateTestimonialErrors;
    }
};