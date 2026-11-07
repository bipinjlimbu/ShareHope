import { authFetch } from "@/lib/api";
import type {
    TestimonialListResponse,
    CreateTestimonialRequest,
    CreateTestimonialResponse,
    CreateTestimonialErrors,
    UpdateTestimonialRequest,
    UpdateTestimonialResponse,
    UpdateTestimonialErrors,
    DeleteTestimonialResponse,
    DeleteTestimonialErrors,
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

export const deleteTestimonial = async (
    id: number
): Promise<DeleteTestimonialResponse> => {
    try {
        return (await authFetch(`/testimonial/${id}/`, {
            method: "DELETE",
        })) as DeleteTestimonialResponse;
    } catch (error) {
        throw error as DeleteTestimonialErrors;
    }
};