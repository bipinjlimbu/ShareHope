"use client";

import { useState, type FormEvent } from "react";
import {
    LoaderCircle,
    MessageSquareQuote,
    Star,
    X,
} from "lucide-react";

import { updateTestimonial } from "@/services/testimonialService";
import type {
    UpdateTestimonialErrors,
    UpdateTestimonialRequest,
} from "@/types/testimonial";
import { useToast } from "@/components/toast/ToastProvider";

interface EditTestimonialFormProps {
    testimonial: {
        id: number;
        rating: number;
        comment: string;
    };
    onClose: () => void;
    onSuccess: () => void;
}

const inputClassName =
    "mt-1.5 w-full rounded-xl border border-[#DDE7D9] bg-white px-3.5 py-3 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA79A] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10";

const labelClassName =
    "block text-sm font-semibold text-[#35543B]";

function getErrorMessage(value: unknown): string | undefined {
    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === "string")
            .join(" ");
    }

    return undefined;
}

function getBackendErrors(
    error: unknown
): {
    fieldErrors: UpdateTestimonialErrors;
    generalError: string;
} {
    const fallback =
        "Unable to update your testimonial. Please try again.";

    if (!error || typeof error !== "object") {
        return {
            fieldErrors: {},
            generalError: fallback,
        };
    }

    const source = error as Record<string, unknown>;

    const nestedErrors =
        source.errors && typeof source.errors === "object"
            ? (source.errors as Record<string, unknown>)
            : source;

    const fieldErrors: UpdateTestimonialErrors = {};

    for (const [key, value] of Object.entries(nestedErrors)) {
        const message = getErrorMessage(value);

        if (message) {
            fieldErrors[key] = message;
        }
    }

    const generalError =
        getErrorMessage(source.message) ??
        getErrorMessage(source.detail) ??
        getErrorMessage(source.general) ??
        getErrorMessage(source.error) ??
        getErrorMessage(source.non_field_errors) ??
        fallback;

    return {
        fieldErrors,
        generalError,
    };
}

export default function EditTestimonialForm({
    testimonial,
    onClose,
    onSuccess,
}: EditTestimonialFormProps) {
    const { showToast } = useToast();

    const [form, setForm] = useState<UpdateTestimonialRequest>({
        rating: testimonial.rating,
        comment: testimonial.comment,
    });

    const [errors, setErrors] =
        useState<UpdateTestimonialErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = <K extends keyof UpdateTestimonialRequest>(
        field: K,
        value: UpdateTestimonialRequest[K]
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
            general: undefined,
            non_field_errors: undefined,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await updateTestimonial(testimonial.id, form);

            showToast(
                "Your testimonial has been updated successfully.",
                "success"
            );

            onSuccess();
        } catch (error: unknown) {
            const result = getBackendErrors(error);

            setErrors(result.fieldErrors);

            showToast(result.generalError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldError = (field: keyof UpdateTestimonialErrors) =>
        errors[field];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#183B2A]/45 px-3 py-5 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isSubmitting
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-testimonial-title"
                className="my-auto w-full max-w-xl overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                            <MessageSquareQuote size={20} />
                        </div>

                        <h2
                            id="edit-testimonial-title"
                            className="text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            Edit Your Story
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-[#647568]">
                            Update your experience with the ShareHope
                            community.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close edit testimonial form"
                        className="rounded-lg p-2 text-[#647568] transition hover:bg-[#E5F2E1] hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6 p-5 sm:p-7"
                >
                    {/* Rating */}
                    <div>
                        <label className={labelClassName}>
                            Your rating
                        </label>

                        <p className="mt-1 text-xs leading-5 text-[#829184]">
                            How would you rate your experience?
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() =>
                                        updateField("rating", rating)
                                    }
                                    disabled={isSubmitting}
                                    aria-label={`Rate ${rating} out of 5 stars`}
                                    aria-pressed={form.rating === rating}
                                    className="rounded-lg p-1 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Star
                                        size={30}
                                        fill={
                                            rating <= form.rating
                                                ? "currentColor"
                                                : "none"
                                        }
                                        strokeWidth={1.5}
                                        className={
                                            rating <= form.rating
                                                ? "text-[#D5A64C]"
                                                : "text-[#C9D6C5]"
                                        }
                                    />
                                </button>
                            ))}

                            <span className="ml-2 text-sm font-bold text-[#35543B]">
                                {form.rating}/5
                            </span>
                        </div>

                        {fieldError("rating") && (
                            <p className="mt-2 text-xs leading-5 text-red-600">
                                {fieldError("rating")}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label
                            htmlFor="edit-testimonial-comment"
                            className={labelClassName}
                        >
                            Your experience
                        </label>

                        <p className="mt-1 text-xs leading-5 text-[#829184]">
                            Update your thoughts, feedback, or experience
                            with the ShareHope community.
                        </p>

                        <textarea
                            id="edit-testimonial-comment"
                            name="comment"
                            rows={6}
                            value={form.comment}
                            onChange={(event) =>
                                updateField("comment", event.target.value)
                            }
                            disabled={isSubmitting}
                            className={inputClassName}
                            placeholder="Write your testimonial here..."
                            aria-invalid={Boolean(fieldError("comment"))}
                            aria-describedby={
                                fieldError("comment")
                                    ? "edit-testimonial-comment-error"
                                    : undefined
                            }
                        />

                        {fieldError("comment") && (
                            <p
                                id="edit-testimonial-comment-error"
                                className="mt-1.5 text-xs leading-5 text-red-600"
                            >
                                {fieldError("comment")}
                            </p>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#E5EDE3] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-xl border border-[#DDE7D9] bg-white px-5 py-3 text-sm font-semibold text-[#526657] transition hover:bg-[#F1F7ED] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D] focus:outline-none focus:ring-4 focus:ring-[#35A45C]/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <MessageSquareQuote size={17} />
                                    Update Testimonial
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
