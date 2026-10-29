"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import {
    CalendarDays,
    ImagePlus,
    LoaderCircle,
    Package,
    X,
} from "lucide-react";
import { createCampaign } from "@/services/campaignService";
import type {
    CampaignCreateErrors,
    CampaignCreateFormErrors,
    CampaignCreatePayload,
    CampaignDonationType,
    CampaignStatus,
} from "@/types/campaign";
import { useToast } from "@/components/toast/ToastProvider";

interface CreateCampaignFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

const initialForm: CampaignCreatePayload = {
    title: "",
    description: "",
    category: "",
    donation_type: "FUND",
    goal_amount: "",
    goal_quantity: "",
    goal_item_name: "",
    currency: "NPR",
    start_date: "",
    end_date: "",
    status: "",
    campaign_image: null,
};

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
    fieldErrors: CampaignCreateFormErrors;
    generalError: string;
} {
    const fallback = "Unable to create the campaign. Please try again.";

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

    const fieldErrors: CampaignCreateFormErrors = {};

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
        getErrorMessage(source.non_field_errors) ??
        fallback;

    return {
        fieldErrors,
        generalError,
    };
}

export default function CreateCampaignForm({
    onClose,
    onSuccess,
}: CreateCampaignFormProps) {
    const { showToast } = useToast();

    const [form, setForm] =
        useState<CampaignCreatePayload>(initialForm);
    const [errors, setErrors] =
        useState<CampaignCreateFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = <K extends keyof CampaignCreatePayload>(
        field: K,
        value: CampaignCreatePayload[K]
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

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;
        updateField("campaign_image", file);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            await createCampaign(form);

            showToast("Campaign created successfully.", "success");
            onSuccess();
        } catch (error: unknown) {
            const result = getBackendErrors(error);

            setErrors(result.fieldErrors);
            showToast(result.generalError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldError = (field: keyof CampaignCreateFormErrors) =>
        errors[field];

    const showFundFields =
        form.donation_type === "FUND" ||
        form.donation_type === "BOTH";

    const showItemFields =
        form.donation_type === "ITEM" ||
        form.donation_type === "BOTH";

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-[#183B2A]/45 px-3 py-5 backdrop-blur-sm sm:items-center sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !isSubmitting) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-campaign-title"
                className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E5EDE3] bg-[#FFFCF6] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE3] bg-white px-5 py-5 sm:px-7">
                    <div>
                        <h2
                            id="create-campaign-title"
                            className="text-xl font-bold text-[#183B2A] sm:text-2xl"
                        >
                            Create Campaign
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-[#647568]">
                            Enter the campaign details and donation goals.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        aria-label="Close create campaign form"
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
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="campaign-title"
                                className={labelClassName}
                            >
                                Campaign title
                            </label>
                            <input
                                id="campaign-title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={(event) =>
                                    updateField("title", event.target.value)
                                }
                                className={inputClassName}
                                placeholder="Enter campaign title"
                                aria-invalid={Boolean(fieldError("title"))}
                                aria-describedby={
                                    fieldError("title")
                                        ? "campaign-title-error"
                                        : undefined
                                }
                            />
                            {fieldError("title") && (
                                <p
                                    id="campaign-title-error"
                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                >
                                    {fieldError("title")}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="campaign-description"
                                className={labelClassName}
                            >
                                Description
                            </label>
                            <textarea
                                id="campaign-description"
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
                                aria-describedby={
                                    fieldError("description")
                                        ? "campaign-description-error"
                                        : undefined
                                }
                            />
                            {fieldError("description") && (
                                <p
                                    id="campaign-description-error"
                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                >
                                    {fieldError("description")}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="campaign-category"
                                className={labelClassName}
                            >
                                Category
                            </label>
                            <input
                                id="campaign-category"
                                name="category"
                                type="text"
                                value={form.category}
                                onChange={(event) =>
                                    updateField(
                                        "category",
                                        event.target.value
                                    )
                                }
                                className={inputClassName}
                                placeholder="e.g. Education"
                                aria-invalid={Boolean(
                                    fieldError("category")
                                )}
                                aria-describedby={
                                    fieldError("category")
                                        ? "campaign-category-error"
                                        : undefined
                                }
                            />
                            {fieldError("category") && (
                                <p
                                    id="campaign-category-error"
                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                >
                                    {fieldError("category")}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="campaign-donation-type"
                                className={labelClassName}
                            >
                                Donation type
                            </label>
                            <select
                                id="campaign-donation-type"
                                name="donation_type"
                                value={form.donation_type}
                                onChange={(event) =>
                                    updateField(
                                        "donation_type",
                                        event.target
                                            .value as CampaignDonationType
                                    )
                                }
                                className={inputClassName}
                                aria-invalid={Boolean(
                                    fieldError("donation_type")
                                )}
                                aria-describedby={
                                    fieldError("donation_type")
                                        ? "campaign-donation-type-error"
                                        : undefined
                                }
                            >
                                <option value="FUND">Funds</option>
                                <option value="ITEM">Physical items</option>
                                <option value="BOTH">Funds and items</option>
                            </select>
                            {fieldError("donation_type") && (
                                <p
                                    id="campaign-donation-type-error"
                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                >
                                    {fieldError("donation_type")}
                                </p>
                            )}
                        </div>
                    </div>

                    {(showFundFields || showItemFields) && (
                        <section className="rounded-xl border border-[#E5EDE3] bg-white p-4 sm:p-5">
                            <div className="mb-4">
                                <h3 className="font-bold text-[#183B2A]">
                                    Donation goals
                                </h3>
                                <p className="mt-1 text-xs leading-5 text-[#647568]">
                                    Enter the goals relevant to the selected
                                    donation type.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {showFundFields && (
                                    <>
                                        <div>
                                            <label
                                                htmlFor="campaign-goal-amount"
                                                className={labelClassName}
                                            >
                                                Goal amount
                                            </label>
                                            <input
                                                id="campaign-goal-amount"
                                                name="goal_amount"
                                                type="number"
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
                                                aria-describedby={
                                                    fieldError("goal_amount")
                                                        ? "campaign-goal-amount-error"
                                                        : undefined
                                                }
                                            />
                                            {fieldError("goal_amount") && (
                                                <p
                                                    id="campaign-goal-amount-error"
                                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                                >
                                                    {fieldError("goal_amount")}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="campaign-currency"
                                                className={labelClassName}
                                            >
                                                Currency
                                            </label>
                                            <input
                                                id="campaign-currency"
                                                name="currency"
                                                type="text"
                                                value={form.currency}
                                                onChange={(event) =>
                                                    updateField(
                                                        "currency",
                                                        event.target.value
                                                    )
                                                }
                                                className={inputClassName}
                                                placeholder="NPR"
                                                aria-invalid={Boolean(
                                                    fieldError("currency")
                                                )}
                                                aria-describedby={
                                                    fieldError("currency")
                                                        ? "campaign-currency-error"
                                                        : undefined
                                                }
                                            />
                                            {fieldError("currency") && (
                                                <p
                                                    id="campaign-currency-error"
                                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                                >
                                                    {fieldError("currency")}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {showItemFields && (
                                    <>
                                        <div>
                                            <label
                                                htmlFor="campaign-goal-quantity"
                                                className={labelClassName}
                                            >
                                                Goal quantity
                                            </label>
                                            <input
                                                id="campaign-goal-quantity"
                                                name="goal_quantity"
                                                type="number"
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
                                                aria-describedby={
                                                    fieldError("goal_quantity")
                                                        ? "campaign-goal-quantity-error"
                                                        : undefined
                                                }
                                            />
                                            {fieldError("goal_quantity") && (
                                                <p
                                                    id="campaign-goal-quantity-error"
                                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                                >
                                                    {fieldError("goal_quantity")}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="campaign-goal-item-name"
                                                className={labelClassName}
                                            >
                                                Item name
                                            </label>
                                            <div className="relative">
                                                <Package
                                                    size={17}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                                />
                                                <input
                                                    id="campaign-goal-item-name"
                                                    name="goal_item_name"
                                                    type="text"
                                                    value={form.goal_item_name}
                                                    onChange={(event) =>
                                                        updateField(
                                                            "goal_item_name",
                                                            event.target.value
                                                        )
                                                    }
                                                    className={`${inputClassName} pl-10`}
                                                    placeholder="e.g. School bags"
                                                    aria-invalid={Boolean(
                                                        fieldError(
                                                            "goal_item_name"
                                                        )
                                                    )}
                                                    aria-describedby={
                                                        fieldError(
                                                            "goal_item_name"
                                                        )
                                                            ? "campaign-goal-item-name-error"
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                            {fieldError("goal_item_name") && (
                                                <p
                                                    id="campaign-goal-item-name-error"
                                                    className="mt-1.5 text-xs leading-5 text-red-600"
                                                >
                                                    {fieldError("goal_item_name")}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    )}

                    <section>
                        <h3 className="mb-4 font-bold text-[#183B2A]">
                            Campaign schedule
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="campaign-start-date"
                                    className={labelClassName}
                                >
                                    Start date
                                </label>
                                <div className="relative">
                                    <CalendarDays
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829184]"
                                    />
                                    <input
                                        id="campaign-start-date"
                                        name="start_date"
                                        type="date"
                                        value={form.start_date}
                                        onChange={(event) =>
                                            updateField(
                                                "start_date",
                                                event.target.value
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                        aria-invalid={Boolean(
                                            fieldError("start_date")
                                        )}
                                        aria-describedby={
                                            fieldError("start_date")
                                                ? "campaign-start-date-error"
                                                : undefined
                                        }
                                    />
                                </div>
                                {fieldError("start_date") && (
                                    <p
                                        id="campaign-start-date-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("start_date")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="campaign-end-date"
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
                                        id="campaign-end-date"
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
                                        aria-describedby={
                                            fieldError("end_date")
                                                ? "campaign-end-date-error"
                                                : undefined
                                        }
                                    />
                                </div>
                                {fieldError("end_date") && (
                                    <p
                                        id="campaign-end-date-error"
                                        className="mt-1.5 text-xs leading-5 text-red-600"
                                    >
                                        {fieldError("end_date")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <label
                            htmlFor="campaign-image"
                            className={labelClassName}
                        >
                            Campaign image
                        </label>

                        <label
                            htmlFor="campaign-image"
                            className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C9DCC4] bg-white p-4 transition hover:border-[#35A45C] hover:bg-[#F5F9F2]"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F2E1] text-[#166534]">
                                <ImagePlus size={21} />
                            </span>

                            <span className="min-w-0">
                                <span className="block break-words text-sm font-semibold text-[#35543B]">
                                    {form.campaign_image?.name ??
                                        "Choose campaign image"}
                                </span>
                                <span className="mt-1 block text-xs text-[#829184]">
                                    Select an image from your device
                                </span>
                            </span>
                        </label>

                        <input
                            id="campaign-image"
                            name="campaign_image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                            aria-invalid={Boolean(
                                fieldError("campaign_image")
                            )}
                            aria-describedby={
                                fieldError("campaign_image")
                                    ? "campaign-image-error"
                                    : undefined
                            }
                        />

                        {fieldError("campaign_image") && (
                            <p
                                id="campaign-image-error"
                                className="mt-1.5 text-xs leading-5 text-red-600"
                            >
                                {fieldError("campaign_image")}
                            </p>
                        )}
                    </section>

                    <section>
                        <label
                            htmlFor="campaign-status"
                            className={labelClassName}
                        >
                            Initial status
                        </label>
                        <select
                            id="campaign-status"
                            name="status"
                            value={form.status ?? ""}
                            onChange={(event) =>
                                updateField(
                                    "status",
                                    event.target.value as CampaignStatus | ""
                                )
                            }
                            className={inputClassName}
                            aria-invalid={Boolean(fieldError("status"))}
                            aria-describedby={
                                fieldError("status")
                                    ? "campaign-status-error"
                                    : undefined
                            }
                        >
                            <option value="">
                                Use the server default (Pending)
                            </option>
                            <option value="DRAFT">Draft</option>
                            <option value="PENDING">Pending Approval</option>
                        </select>
                        {fieldError("status") && (
                            <p
                                id="campaign-status-error"
                                className="mt-1.5 text-xs leading-5 text-red-600"
                            >
                                {fieldError("status")}
                            </p>
                        )}
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
                                    Creating campaign...
                                </>
                            ) : (
                                "Create Campaign"
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}