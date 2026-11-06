import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    FileText,
    HandHeart,
    Scale,
    ShieldCheck,
} from "lucide-react";

const sections = [
    {
        id: "acceptance",
        number: "01",
        title: "Acceptance of Terms",
        content: [
            "By accessing or using ShareHope, you agree to these Terms and Conditions. If you do not agree with any part of these terms, please discontinue using the platform.",
            "These terms apply to all users, including donors, NGO administrators, NGO staff, and platform administrators.",
        ],
    },
    {
        id: "eligibility",
        number: "02",
        title: "Account Registration and Eligibility",
        content: [
            "You must provide accurate and complete information when creating an account. You are responsible for keeping your login credentials confidential and for activities performed through your account.",
            "You must not impersonate another person, provide misleading information, or create an account for fraudulent purposes.",
            "ShareHope may restrict or suspend accounts when information appears inaccurate, misleading, or inconsistent with these terms.",
        ],
    },
    {
        id: "roles",
        number: "03",
        title: "User Roles and Responsibilities",
        content: [
            "Donors are responsible for reviewing campaign information before making a donation and ensuring that the details they submit are accurate.",
            "NGO administrators and staff must provide truthful organizational information, maintain accurate campaign details, and handle received donations responsibly.",
            "Platform administrators are responsible for reviewing platform activity and managing administrative processes within their assigned permissions.",
        ],
    },
    {
        id: "campaigns",
        number: "04",
        title: "Campaigns and Approvals",
        content: [
            "NGOs may submit campaigns for review through ShareHope. Submission does not guarantee publication or approval.",
            "A campaign may become publicly available only after the required platform approval. ShareHope may reject, suspend, or remove campaigns that contain misleading information, violate these terms, or raise legitimate concerns.",
            "Campaign descriptions, objectives, targets, and updates should be accurate and kept up to date by the responsible NGO.",
        ],
    },
    {
        id: "donations",
        number: "05",
        title: "Donations and Verification",
        content: [
            "Donations are associated with the campaigns selected by donors. Depending on the available campaign options, donations may involve monetary contributions or physical items.",
            "Donors should provide accurate donation details. NGOs are responsible for reviewing and confirming the receipt of donations through the platform's verification process.",
            "A donation record or submission confirmation does not, by itself, guarantee that money or physical items have been received or verified.",
            "Any payment-related process is subject to the payment method and instructions presented at the time of donation.",
        ],
    },
    {
        id: "prohibited",
        number: "06",
        title: "Prohibited Activities",
        content: [
            "You must not use ShareHope to engage in fraud, deception, harassment, unlawful activities, or any activity that could harm other users or the platform.",
            "You must not submit false campaign information, manipulate donation records, attempt unauthorized access, interfere with platform operations, or misuse another user's account.",
            "You must not upload malicious files, distribute harmful content, or exploit platform features for purposes unrelated to their intended use.",
        ],
    },
    {
        id: "content",
        number: "07",
        title: "User-Submitted Information",
        content: [
            "You are responsible for the information, documents, images, and other content you submit to ShareHope.",
            "You must have the necessary rights or permission to submit and use that content. Submitted information must not infringe another person's rights or contain unlawful or misleading material.",
            "By submitting content, you authorize ShareHope to display and process it as necessary to operate the platform and provide its features.",
        ],
    },
    {
        id: "suspension",
        number: "08",
        title: "Account Suspension and Termination",
        content: [
            "ShareHope may restrict, suspend, or terminate access to an account when there is a suspected violation of these terms, misuse of the platform, or a security concern.",
            "Where appropriate, users may be asked to provide clarification or correct inaccurate information before access is restored.",
            "Users may stop using the platform at any time. Any outstanding responsibilities relating to donations or submitted information should still be addressed.",
        ],
    },
    {
        id: "availability",
        number: "09",
        title: "Platform Availability",
        content: [
            "ShareHope aims to provide a reliable platform, but uninterrupted access cannot be guaranteed.",
            "Features may occasionally be unavailable due to maintenance, technical issues, updates, or circumstances beyond the platform's control.",
            "ShareHope may modify, improve, or discontinue platform features when necessary.",
        ],
    },
    {
        id: "liability",
        number: "10",
        title: "Limitation of Responsibility",
        content: [
            "ShareHope provides tools for campaign management, donation records, and verification workflows. The platform does not independently guarantee the accuracy of every statement made by users or NGOs.",
            "Users should exercise their own judgment when reviewing campaigns and deciding whether to contribute.",
            "To the extent permitted by applicable law, ShareHope is not responsible for losses arising from inaccurate information submitted by users, unauthorized account access caused by compromised credentials, or temporary service interruptions.",
        ],
    },
    {
        id: "changes",
        number: "11",
        title: "Changes to These Terms",
        content: [
            "These Terms and Conditions may be updated as ShareHope develops or as operational and legal requirements change.",
            "Updated terms will be published on this page. Continued use of the platform after an update means you accept the revised terms.",
        ],
    },
    {
        id: "contact",
        number: "12",
        title: "Contact and Questions",
        content: [
            "If you have questions about these terms or need clarification about platform usage, please contact the ShareHope team through the Contact page.",
        ],
    },
];

const highlights = [
    {
        icon: HandHeart,
        title: "Responsible Giving",
        description:
            "Review campaign details and make informed donation decisions.",
    },
    {
        icon: BadgeCheck,
        title: "Honest Information",
        description:
            "Keep account, organization, and campaign information accurate.",
    },
    {
        icon: ShieldCheck,
        title: "Platform Integrity",
        description:
            "Use ShareHope responsibly and respect other users.",
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#FFFCF6] text-[#183B2A]">
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b border-[#E5EDE3]">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#EAF2E5] blur-3xl opacity-70" />
                <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#E5F2E1] blur-3xl opacity-60" />

                <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                    <Link
                        href="/"
                        className="mb-12 inline-flex items-center gap-2 text-sm font-semibold text-[#718071] transition hover:text-[#166534]"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>

                    <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE9D8] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                                <Scale size={15} />
                                Legal Information
                            </div>

                            <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-[#183B2A] sm:text-5xl lg:text-6xl">
                                Terms that guide our{" "}
                                <span className="text-[#29904C]">community.</span>
                            </h1>

                            <p className="mt-7 max-w-2xl text-base leading-8 text-[#718071] sm:text-lg">
                                These terms explain the responsibilities and expectations
                                that help donors, NGOs, and platform users participate in
                                ShareHope with clarity and trust.
                            </p>

                            <div className="mt-9 flex flex-wrap items-center gap-4">
                                <a
                                    href="#terms-content"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#166534] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#166534]/15 transition hover:bg-[#14532D]"
                                >
                                    Read the terms
                                    <ArrowRight size={17} />
                                </a>

                                <Link
                                    href="/privacy"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#DCE9D8] bg-white px-6 py-3.5 text-sm font-semibold text-[#183B2A] transition hover:border-[#29904C] hover:text-[#166534]"
                                >
                                    Privacy policy
                                    <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 rounded-[2rem] bg-[#E5F2E1] rotate-3" />

                            <div className="relative overflow-hidden rounded-[1.75rem] bg-[#183B2A] p-8 text-white shadow-xl sm:p-10">
                                <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                                    <FileText size={28} />
                                </div>

                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8D5A8]">
                                    ShareHope Guidelines
                                </p>

                                <h2 className="mt-4 text-3xl font-bold leading-tight">
                                    A shared commitment to responsible giving.
                                </h2>

                                <p className="mt-5 text-sm leading-7 text-white/70">
                                    Every user has a role in maintaining a transparent,
                                    respectful, and accountable donation environment.
                                </p>

                                <div className="mt-9 border-t border-white/15 pt-6">
                                    <div className="flex items-center gap-3 text-sm font-medium text-[#D8EBD6]">
                                        <ShieldCheck size={19} className="text-[#A8D5A8]" />
                                        Transparency starts with responsibility.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
                <div className="grid gap-5 md:grid-cols-3">
                    {highlights.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-7"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2E5] text-[#166534]">
                                    <Icon size={23} />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-[#183B2A]">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-[#718071]">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Terms Content */}
            <section
                id="terms-content"
                className="mx-auto max-w-7xl scroll-mt-8 px-5 pb-20 sm:px-8 lg:px-12"
            >
                <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
                    {/* Table of Contents */}
                    <aside className="lg:sticky lg:top-8">
                        <div className="rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                                On this page
                            </p>

                            <nav className="mt-5 space-y-1">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm text-[#718071] transition hover:bg-[#F2F7EF] hover:text-[#166534]"
                                    >
                                        <span className="mt-0.5 text-xs font-bold text-[#A2B5A0] group-hover:text-[#29904C]">
                                            {section.number}
                                        </span>
                                        <span className="font-medium">{section.title}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] bg-[#EAF2E5] p-6">
                            <div className="flex items-center gap-2 text-[#166534]">
                                <HandHeart size={19} />
                                <p className="text-sm font-bold">Need clarification?</p>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-[#718071]">
                                If something is unclear, our team is available to help.
                            </p>

                            <Link
                                href="/contact"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition hover:text-[#29904C]"
                            >
                                Contact us
                                <ArrowUpRight size={15} />
                            </Link>
                        </div>
                    </aside>

                    {/* Policy Sections */}
                    <div className="min-w-0">
                        <div className="mb-9 rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#29904C]">
                                Please read carefully
                            </p>

                            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#183B2A] sm:text-3xl">
                                Terms and Conditions
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-[#718071]">
                                By using ShareHope, you agree to follow the conditions
                                described below. These guidelines are intended to support
                                responsible participation and protect the integrity of the
                                platform.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {sections.map((section) => (
                                <article
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-8 rounded-[1.5rem] border border-[#E5EDE3] bg-white p-6 sm:p-8"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF2E5] text-sm font-bold text-[#166534]">
                                            {section.number}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-[#183B2A] sm:text-xl">
                                                {section.title}
                                            </h3>

                                            <div className="mt-4 space-y-4">
                                                {section.content.map((paragraph, index) => (
                                                    <p
                                                        key={index}
                                                        className="text-sm leading-7 text-[#718071]"
                                                    >
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className="mt-8 rounded-[1.5rem] border border-[#DCE9D8] bg-[#F2F7EF] p-6 sm:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#166534]">
                                    <Scale size={22} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-[#183B2A]">
                                        A note about these terms
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-[#718071]">
                                        These terms describe the intended rules for using the
                                        ShareHope platform. They should be reviewed and finalized
                                        against the applicable laws and the actual features and
                                        operating practices of the deployed platform before
                                        publication as a binding legal document.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="px-5 pb-16 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#183B2A] px-7 py-12 text-center sm:px-12 sm:py-16">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A8D5A8]">
                        ShareHope Community
                    </p>

                    <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                        Together, we make giving more meaningful.
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                        Be part of a community built around responsible contributions,
                        transparency, and positive impact.
                    </p>

                    <Link
                        href="/campaigns"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#166534] transition hover:bg-[#EAF2E5]"
                    >
                        Explore campaigns
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>
        </main>
    );
}