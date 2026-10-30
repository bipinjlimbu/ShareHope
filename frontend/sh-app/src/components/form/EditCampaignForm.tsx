"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
    CalendarDays,
    ImagePlus,
    LoaderCircle,
    X,
} from "lucide-react";
import { updateCampaign } from "@/services/campaignService";
import type {
    Campaign,
    CampaignUpdatePayload,
    CampaignUpdateFormErrors,
} from "@/types/campaign";
import { useToast } from "@/components/toast/ToastProvider";

interface EditCampaignFormProps {
    campaign: Campaign;
    onClose: () => void;
    onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const inputClassName =
    "mt-1.5 w-full rounded-xl border border-[#DDE7D9] bg-white px-3.5 py-3 text-sm text-[#183B2A] outline-none transition placeholder:text-[#9AA79A] focus:border-[#35A45C] focus:ring-4 focus:ring-[#35A45C]/10";

const labelClassName = "block text-sm font-semibold text-[#35543B]";

function getCampaignImageUrl(path: string | null): string | null {
    if (!path) return null;

    if (/^https?:\/\//i.test(path)) return path;

    const baseUrl = API_URL.replace(/\/+$/, "").replace(/\/api$/i, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function getErrorMessage(value: unknown): string | undefined {
    if (typeof value === "string") return value;

    if (Array.isArray(value)) {
        return value
            .filter((item): item is string => typeof item === "string")
            .join(" ");
    }

    return undefined;
}

function getBackendErrors(error: unknown): {
    fieldErrors: CampaignUpdateFormErrors;
    generalError: string;
} {
    const fallback = "Unable to submit campaign changes. Please try again.";

    if (!error || typeof error !== "object") {
        return { fieldErrors: {}, generalError: fallback };
    }

    const source = error as Record<string, unknown>;
    const nestedErrors =
        source.errors && typeof source.errors === "object"
            ? (source.errors as Record<string, unknown>)
            : source;

    const fieldErrors: CampaignUpdateFormErrors = {};

    for (const [key, value] of Object.entries(nestedErrors)) {
        const message = getErrorMessage(value);

        if (message) fieldErrors[key] = message;
    }

    const generalError =
        getErrorMessage(source.message) ??
        getErrorMessage(source.detail) ??
        getErrorMessage(source.general) ??
        getErrorMessage(source.non_field_errors) ??
        fallback;

    return { fieldErrors, generalError };
}

export default function EditCampaignForm({
    campaign,
    onClose,
    onSuccess,
}: EditCampaignFormProps) {
    const { showToast } = useToast();

    const [form, setForm] = useState<CampaignUpdatePayload>({
        title: campaign.title,
        description: campaign.description,
        goal_amount: campaign.goal_amount ?? "",
        goal_quantity:
            campaign.goal_quantity === null
                ? ""
                : String(campaign.goal_quantity),
        end_date: campaign.end_date,
        campaign_image: null,
    });

    const [errors, setErrors] = useState<CampaignUpdateFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(
        getCampaignImageUrl(campaign.campaign_image)
    );

    useEffect(() => {
        if (!form.campaign_image) return;

        const objectUrl = URL.createObjectURL(form.campaign_image);
        setImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.campaign_image]);

    const updateField = <K extends keyof CampaignUpdatePayload>(
        field: K,
        value: CampaignUpdatePayload[K]
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

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        updateField("campaign_image", file);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await updateCampaign(campaign.id, form);

            showToast(
                "Campaign changes submitted for admin approval.",
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

    const fieldError = (field: keyof CampaignUpdateFormErrors) =>
        errors[field];

    const showFundFields =
        campaign.donation_type === "FUND" ||
        campaign.donation_type === "BOTH";

    const showItemFields =
        campaign.donation_type === "ITEM" ||
        campaign.donation_type === "BOTH";

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
                aria-labelledby="edit-campaign-title"
                className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div>
                        <h2
                            id="edit-campaign-title"
                            className="text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            Edit Campaign
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-[#647568]">
                            Submit changes to this campaign for admin approval.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close edit campaign form"
                        className="rounded-lg p-2 text-[#647568] transition hover:bg-[#E5F2E1] hover:text-[#14532D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="max-h-[calc(100dvh-130px)] space-y-6 overflow-y-auto p-5 sm:p-7"
                >
                    <div className="rounded-xl border border-[#DDE8D7] bg-[#F4F8F0] p-4">
                        <p className="text-sm font-semibold text-[#183B2A]">
                            Changes require admin approval
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[#647568]">
                            Your current campaign information will remain
                            unchanged until an administrator reviews and
                            approves these changes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="edit-campaign-title"
                                className={labelClassName}
                            >
                                Campaign title
                            </label>
                            <input
                                id="edit-campaign-title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={(event) =>
                                    updateField("title", event.target.value)
                                }
                                className={inputClassName}
                                placeholder="Enter campaign title"
                                aria-invalid={Boolean(fieldError("title"))}
                            />
                            {fieldError("title") && (
                                <p className="mt-1.5 text-xs leading-5 text-red-600">
                                    {fieldError("title")}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="edit-campaign-description"
                                className={labelClassName}
                            >
                                Description
                            </label>
                            <textarea
                                id="edit-campaign-description"
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={(event) =>
                                    updateField(
                                        "description",
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                                placeholder="Describe the campaign and its purpose"
                                aria-invalid={Boolean(
                                    fieldError("description")
                                )}
                            />
                            {fieldError("description") && (
                                <p className="mt-1.5 text-xs leading-5 text-red-600">
                                    {fieldError("description")}
                                </p>
                            )}
                        </div>
                    </div>

                    <section className="rounded-xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                        <div className="mb-4">
                            <h3 className="font-bold text-[#183B2A]">
                                Campaign goals
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-[#647568]">
                                Donation type and item details cannot be changed
                                through this form.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {showFundFields && (
                                <div>
                                    <label
                                        htmlFor="edit-campaign-goal-amount"
                                        className={labelClassName}
                                    >
                                        Goal amount ({campaign.currency})
                                    </label>
                                    <input
                                        id="edit-campaign-goal-amount"
                                        name="goal_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.goal_amount}
                                        onChange={(event) =>
                                            updateField(
                                                "goal_amount",
                                                event.target.value
                                            )
                                        }
                                        className={inputClassName}
                                        placeholder="Enter target amount"
                                        aria-invalid={Boolean(
                                            fieldError("goal_amount")
                                        )}
                                    />
                                    {fieldError("goal_amount") && (
                                        <p className="mt-1.5 text-xs leading-5 text-red-600">
                                            {fieldError("goal_amount")}
                                        </p>
                                    )}
                                </div>
                            )}

                            {showItemFields && (
                                <div>
                                    <label
                                        htmlFor="edit-campaign-goal-quantity"
                                        className={labelClassName}
                                    >
                                        Goal quantity
                                        {campaign.goal_item_name
                                            ? ` (${campaign.goal_item_name})`
                                            : ""}
                                    </label>
                                    <input
                                        id="edit-campaign-goal-quantity"
                                        name="goal_quantity"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.goal_quantity}
                                        onChange={(event) =>
                                            updateField(
                                                "goal_quantity",
                                                event.target.value
                                            )
                                        }
                                        className={inputClassName}
                                        placeholder="Enter target quantity"
                                        aria-invalid={Boolean(
                                            fieldError("goal_quantity")
                                        )}
                                    />
                                    {fieldError("goal_quantity") && (
                                        <p className="mt-1.5 text-xs leading-5 text-red-600">
                                            {fieldError("goal_quantity")}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-4 font-bold text-[#183B2A]">
                            Campaign schedule
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="edit-campaign-start-date"
                                    className={labelClassName}
                                >
                                    Start date
                                </label>
                                <input
                                    id="edit-campaign-start-date"
                                    type="date"
                                    value={campaign.start_date}
                                    disabled
                                    className={`${inputClassName} cursor-not-allowed bg-[#F1F4EF] text-[#829184]`}
                                />
                                <p className="mt-1.5 text-xs text-[#829184]">
                                    Start date cannot be changed.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="edit-campaign-end-date"
                                    className={labelClassName}
                                >
                                    End date
                                </label>
                                <div className="relative">
                                    <CalendarDays
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />
                                    <input
                                        id="edit-campaign-end-date"
                                        name="end_date"
                                        type="date"
                                        value={form.end_date}
                                        onChange={(event) =>
                                            updateField(
                                                "end_date",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        aria-invalid={Boolean(
                                            fieldError("end_date")
                                        )}
                                    />
                                </div>
                                {fieldError("end_date") && (
                                    <p className="mt-1.5 text-xs leading-5 text-red-600">
                                        {fieldError("end_date")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <label
                            htmlFor="edit-campaign-image"
                            className={labelClassName}
                        >
                            Campaign image
                        </label>

                        {imagePreview && (
                            <div className="mt-2 aspect-video w-full max-w-md overflow-hidden rounded-xl border border-[#DDE7D9] bg-[#E5F2E1]">
                                <img
                                    src={imagePreview}
                                    alt="Campaign preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        <label
                            htmlFor="edit-campaign-image"
                            className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C9DCC4] bg-white p-4 transition hover:border-[#35A45C] hover:bg-[#F5F9F2]"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <ImagePlus size={21} />
                            </span>

                            <span className="min-w-0">
                                <span className="block break-words text-sm font-semibold text-[#35543B]">
                                    {form.campaign_image?.name ??
                                        "Choose a new campaign image"}
                                </span>
                                <span className="mt-1 block text-xs text-[#829184]">
                                    Leave unchanged to keep the current image.
                                </span>
                            </span>
                        </label>

                        <input
                            id="edit-campaign-image"
                            name="campaign_image"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleImageChange}
                            className="sr-only"
                            aria-invalid={Boolean(
                                fieldError("campaign_image")
                            )}
                        />

                        {fieldError("campaign_image") && (
                            <p className="mt-1.5 text-xs leading-5 text-red-600">
                                {fieldError("campaign_image")}
                            </p>
                        )}
                    </section>

                    <section className="rounded-xl border border-[#E5EDE3] bg-white p-4">
                        <h3 className="font-bold text-[#183B2A]">
                            Locked campaign information
                        </h3>

                        <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-xs text-[#829184]">
                                    Category
                                </p>
                                <p className="mt-1 font-semibold text-[#35543B]">
                                    {campaign.category}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#829184]">
                                    Donation type
                                </p>
                                <p className="mt-1 font-semibold text-[#35543B]">
                                    {campaign.donation_type}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#829184]">
                                    Currency
                                </p>
                                <p className="mt-1 font-semibold text-[#35543B]">
                                    {campaign.currency}
                                </p>
                            </div>
                            {campaign.goal_item_name && (
                                <div>
                                    <p className="text-xs text-[#829184]">
                                        Item name
                                    </p>
                                    <p className="mt-1 font-semibold text-[#35543B]">
                                        {campaign.goal_item_name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {(fieldError("general") ||
                        fieldError("non_field_errors")) && (
                            <p className="text-xs leading-5 text-red-600">
                                {fieldError("general") ??
                                    fieldError("non_field_errors")}
                            </p>
                        )}

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
                                    Submitting changes...
                                </>
                            ) : (
                                "Submit for Approval"
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}