import { authFetch } from "@/lib/api";
import type { TestimonialListResponse } from "@/types/testimonial";

export const getTestimonials = async (): Promise<TestimonialListResponse> => {
    return (await authFetch("/testimonial/", {
        method: "GET",
    })) as TestimonialListResponse;
};