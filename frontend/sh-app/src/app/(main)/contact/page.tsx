"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Clock3,
    Mail,
    MapPin,
    MessageCircle,
    Send,
    ShieldCheck,
    LayoutDashboard,
} from "lucide-react";
import { getAuthStatus } from "@/lib/authStatus";
import { getProfile } from "@/services/profileService";
import { sendContactMessage } from "@/services/mainService";
import type { ContactErrors } from "@/types/main";
import ContactSkeleton from "@/components/skeleton/main/ContactSkeleton";

const contactDetails = [
    {
        icon: Mail,
        label: "Email",
        value: "support@sharehope.org",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Nepal",
    },
    {
        icon: Clock3,
        label: "Response time",
        value: "Usually within 1–2 business days",
    },
];

const faqs = [
    {
        question: "I have a question about a donation. Who should I contact?",
        answer:
            "Contact our support team with your donation details so we can help you find the relevant information.",
    },
    {
        question: "How can my organization join ShareHope?",
        answer:
            "Organizations can register through the NGO registration process. Once submitted, the application is reviewed by the ShareHope administration team.",
    },
    {
        question: "I found an issue on the platform. What should I do?",
        answer:
            "Send us a message describing the issue and where you encountered it. Including relevant details helps us investigate it.",
    },
];

export default function ContactPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState<ContactErrors>({});
    const [successMessage, setSuccessMessage] = useState("");
    const [generalError, setGeneralError] = useState("");

    const loadProfile = useCallback(async () => {
        if (!getAuthStatus()) {
            setIsAuthenticated(false);
            setIsAdmin(false);
            setFormData({
                name: "",
                email: "",
                message: "",
            });
            setIsProfileLoading(false);
            return;
        }

        setIsAuthenticated(true);
        setIsProfileLoading(true);

        try {
            const response = await getProfile();
            const user = response.user;

            setIsAdmin(user.role === "ADMIN");

            const fullName = [user.first_name, user.last_name]
                .filter(Boolean)
                .join(" ")
                .trim();

            setFormData((previous) => ({
                ...previous,
                name: fullName || user.username || "",
                email: user.email || "",
            }));
        } catch {
            setIsAdmin(false);
        } finally {
            setIsProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();

        const handleAuthChange = () => {
            loadProfile();
        };

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [loadProfile]);

    const handleChange = (
        field: keyof typeof formData,
        value: string
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));

        setSuccessMessage("");
        setGeneralError("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSubmitting(true);
        setErrors({});
        setSuccessMessage("");
        setGeneralError("");

        try {
            const response = await sendContactMessage(formData);

            setSuccessMessage(
                response.message || "Your message has been sent successfully."
            );

            setFormData((previous) => ({
                ...previous,
                message: "",
            }));
        } catch (error: unknown) {
            const response = error as ContactErrors;
            const fieldErrors: ContactErrors = {};

            if (response && typeof response === "object") {
                if (typeof response.name === "string") {
                    fieldErrors.name = response.name;
                }

                if (typeof response.email === "string") {
                    fieldErrors.email = response.email;
                }

                if (typeof response.message === "string") {
                    fieldErrors.message = response.message;
                }

                const otherErrors = Object.entries(response).filter(
                    ([key]) =>
                        !["name", "email", "message", "general"].includes(key)
                );

                if (otherErrors.length > 0) {
                    fieldErrors.general = otherErrors
                        .map(([, value]) =>
                            Array.isArray(value) ? value.join(" ") : String(value)
                        )
                        .join(" ");
                }

                if (response.general) {
                    fieldErrors.general = response.general;
                }
            }

            setErrors(fieldErrors);

            if (fieldErrors.general) {
                setGeneralError(fieldErrors.general);
            } else if (Object.keys(fieldErrors).length === 0) {
                setGeneralError(
                    "Something went wrong while sending your message. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            <section className="relative border-b border-[#E5EBDD]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                        <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#29904C]">
                            <span className="h-px w-8 bg-[#29904C]" />
                            Contact ShareHope
                        </p>

                        <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                            Let's start a
                            <span className="block font-serif font-normal italic text-[#29904C]">
                                conversation.
                            </span>
                        </h1>

                        <p className="mt-8 max-w-md text-base leading-8 text-[#647567]">
                            Have a question, need assistance, or want to work with us?
                            We would love to hear from you.
                        </p>

                        <div className="mt-12 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F2E1] text-[#166534]">
                                <MessageCircle size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    We are here to help.
                                </p>
                                <p className="mt-1 text-sm text-[#7B897E]">
                                    Every message matters to us.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex min-h-[420px] items-end overflow-hidden bg-[#164B2D] px-8 py-10 sm:px-12 lg:min-h-[620px] lg:px-16 lg:py-16">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-45"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1400&q=85')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C2E1B] via-[#0C2E1B]/25 to-transparent" />

                        <div className="relative z-10 max-w-lg text-white">
                            <span className="mb-5 block text-xs font-bold uppercase tracking-[0.2em] text-[#B9D9B9]">
                                Together, we can make a difference
                            </span>
                            <p className="font-serif text-3xl leading-snug sm:text-4xl">
                                "Behind every meaningful change is a conversation that starts
                                somewhere."
                            </p>
                            <div className="mt-7 h-px w-16 bg-[#9BC79F]" />
                            <p className="mt-5 text-sm tracking-wide text-white/70">
                                The ShareHope Team
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
                    <aside>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#29904C]">
                            Get in touch
                        </p>

                        <h2 className="mt-5 max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            We'd like to hear from you.
                        </h2>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#718075]">
                            Whether you are a donor, an organization, or simply someone who
                            believes in helping others, you can reach out to us.
                        </p>

                        <div className="mt-12 space-y-8">
                            {contactDetails.map((detail) => {
                                const Icon = detail.icon;

                                return (
                                    <div key={detail.label} className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3E7] text-[#166534]">
                                            <Icon size={19} />
                                        </div>

                                        <div className="min-w-0 pt-0.5">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-[#8A968B]">
                                                {detail.label}
                                            </p>
                                            <p className="mt-1 break-all text-sm font-semibold leading-6 text-[#183B2A]">
                                                {detail.value}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-14 border-l-2 border-[#29904C] pl-5">
                            <p className="text-sm font-semibold">
                                Prefer exploring first?
                            </p>
                            <Link
                                href="/campaigns/"
                                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#29904C] transition hover:gap-3"
                            >
                                Explore our campaigns
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </aside>

                    {isProfileLoading ? (
                        <ContactSkeleton />
                    ) : isAdmin ? (
                        <div className="relative flex min-h-[480px] flex-col justify-between overflow-hidden bg-[#164B2D] p-8 text-white sm:p-12">
                            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
                            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
                            <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#29904C]/20 blur-3xl" />

                            <div className="relative">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#C5E5C3]">
                                    <ShieldCheck size={26} />
                                </div>

                                <p className="mt-10 text-xs font-bold uppercase tracking-[0.2em] text-[#B9D9B9]">
                                    Administrator workspace
                                </p>

                                <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
                                    Your work makes ShareHope possible.
                                </h2>

                                <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
                                    Manage the platform, oversee activities, and help ensure
                                    every contribution reaches its intended purpose. Your
                                    administrator workspace brings the essential tools
                                    together in one place.
                                </p>
                            </div>

                            <div className="relative mt-12 border-t border-white/15 pt-8">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9D9B9]">
                                    Your workspace
                                </p>

                                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                                    Continue managing users, NGOs, campaigns, donations,
                                    and platform activities from your dashboard.
                                </p>

                                <Link
                                    href="/dashboard/admin/"
                                    className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-white px-6 py-4 text-sm font-semibold text-[#164B2D] transition hover:bg-[#E5F2E1]"
                                >
                                    <LayoutDashboard size={17} />
                                    Go to Admin Dashboard
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-[#E4E9DF] bg-white p-6 shadow-[0_12px_50px_rgba(24,59,42,0.04)] sm:p-10 lg:p-12">
                            <div className="mb-9">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#29904C]">
                                    Send a message
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                    How can we help?
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-[#7B897E]">
                                    {isAuthenticated
                                        ? "Your profile details have been filled in. You can edit them before sending."
                                        : "Fill in the details below and our team will get back to you."}
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Full name
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(event) =>
                                                handleChange("name", event.target.value)
                                            }
                                            placeholder="Your full name"
                                            aria-invalid={!!errors.name}
                                            aria-describedby={
                                                errors.name ? "name-error" : undefined
                                            }
                                            className="w-full border border-[#E2E8DE] bg-[#FFFCF6] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A4AEA5] focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10"
                                        />
                                        {errors.name && (
                                            <p
                                                id="name-error"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-semibold"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(event) =>
                                                handleChange("email", event.target.value)
                                            }
                                            placeholder="you@example.com"
                                            aria-invalid={!!errors.email}
                                            aria-describedby={
                                                errors.email ? "email-error" : undefined
                                            }
                                            className="w-full border border-[#E2E8DE] bg-[#FFFCF6] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A4AEA5] focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10"
                                        />
                                        {errors.email && (
                                            <p
                                                id="email-error"
                                                className="mt-2 text-xs text-red-600"
                                            >
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-semibold"
                                    >
                                        Your message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={(event) =>
                                            handleChange("message", event.target.value)
                                        }
                                        placeholder="Write your message here..."
                                        aria-invalid={!!errors.message}
                                        aria-describedby={
                                            errors.message ? "message-error" : undefined
                                        }
                                        className="w-full resize-y border border-[#E2E8DE] bg-[#FFFCF6] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#A4AEA5] focus:border-[#29904C] focus:ring-2 focus:ring-[#29904C]/10"
                                    />
                                    {errors.message && (
                                        <p
                                            id="message-error"
                                            className="mt-2 text-xs text-red-600"
                                        >
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                {generalError && (
                                    <div
                                        role="alert"
                                        className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                    >
                                        {generalError}
                                    </div>
                                )}

                                {successMessage && (
                                    <div
                                        role="status"
                                        className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                                    >
                                        {successMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex w-full items-center justify-center gap-3 bg-[#166534] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#14532D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {isSubmitting ? "Sending..." : "Send message"}
                                    <Send size={16} />
                                </button>

                                <p className="text-xs leading-6 text-[#929D93]">
                                    Your message will be sent to the ShareHope support team.
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <section className="border-t border-[#E5EBDD] bg-[#F3F6EE]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.65fr_1.35fr] lg:px-16 lg:py-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#29904C]">
                            Common questions
                        </p>
                        <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            Before you reach out.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#718075]">
                            You might find the answer to your question here.
                        </p>
                    </div>

                    <div className="divide-y divide-[#DCE5D8] border-y border-[#DCE5D8]">
                        {faqs.map((faq, index) => (
                            <details key={faq.question} className="group py-6">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                                    <span className="flex gap-5 text-sm font-semibold leading-6 sm:text-base">
                                        <span className="font-serif text-lg italic text-[#29904C]">
                                            0{index + 1}
                                        </span>
                                        {faq.question}
                                    </span>
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C9D9C7] text-[#166534] transition group-open:rotate-45">
                                        <span className="text-xl font-light">+</span>
                                    </span>
                                </summary>
                                <p className="ml-10 mt-5 max-w-2xl text-sm leading-7 text-[#718075]">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#164B2D] px-6 py-16 text-center text-white sm:px-10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9D9B9]">
                    Make a difference
                </p>
                <h2 className="mx-auto mt-5 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                    Good things happen when people come together.
                </h2>
                <Link
                    href="/campaigns/"
                    className="mt-8 inline-flex items-center gap-3 border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-[#164B2D]"
                >
                    Explore campaigns
                    <ArrowRight size={16} />
                </Link>
            </section>
        </main>
    );
}
