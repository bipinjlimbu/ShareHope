import { authFetch } from "@/lib/api";
import type {
    TestimonialListResponse,
    CreateTestimonialRequest,
    CreateTestimonialResponse,
    CreateTestimonialErrors,
    UpdateTestimonialRequest,
    UpdateTestimonialResponse,
    UpdateTestimonialErrors,
} from "@/types/testimonial";

// Get all testimonials
export const getTestimonials = async (): Promise<TestimonialListResponse> => {
    return (await authFetch("/testimonial/", {
        method: "GET",
    })) as TestimonialListResponse;
};

// Create a testimonial
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

// Update a testimonial
export const updateTestimonial = async (
    id: number,
    data: UpdateTestimonialRequest
): Promise<UpdateTestimonialResponse> => {
    try {
        return (await authFetch(`/testimonial/${id}/`, {
            method: "PUT",
            body: JSON.stringify(data),
        })) as UpdateTestimonialResponse;
    } catch (error) {
        throw error as UpdateTestimonialErrors;
    }
};