import Link from "next/link";

import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    Database,
    Eye,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

const privacySections = [
    {
        number: "01",
        icon: Database,
        title: "Information We Collect",
        description:
            "ShareHope collects information needed to provide and maintain the platform.",
        details: [
            {
                heading: "Account information",
                text: "When you register, we may collect information such as your username, name, email address, phone number, password, and profile picture.",
            },
            {
                heading: "Organization information",
                text: "Organizations may provide their name, contact information, address, registration details, and supporting documents when applying to join ShareHope.",
            },
            {
                heading: "Donation and campaign information",
                text: "We maintain information related to campaigns, donation contributions, donation items, payment records, and donation verification activities.",
            },
            {
                heading: "Platform activity",
                text: "We may maintain records of actions performed on the platform, such as campaign submissions, administrative decisions, donation updates, and account-related activities.",
            },
        ],
    },
    {
        number: "02",
        icon: Eye,
        title: "How We Use Your Information",
        description:
            "Information is used to operate ShareHope and support its donation-management workflow.",
        details: [
            {
                heading: "Account management",
                text: "To create and manage user accounts, authenticate users, and provide features according to their assigned roles.",
            },
            {
                heading: "Campaign management",
                text: "To allow organizations to submit campaigns and administrators to review and manage campaign information.",
            },
            {
                heading: "Donation records",
                text: "To record contributions, maintain donation histories, and support the verification of donations received by organizations.",
            },
            {
                heading: "Communication",
                text: "To send relevant account notifications, platform updates, and service-related messages where applicable.",
            },
            {
                heading: "Platform improvement",
                text: "To understand platform activity, maintain records, troubleshoot issues, and improve the reliability of ShareHope.",
            },
        ],
    },
    {
        number: "03",
        icon: UsersIcon,
        title: "Information Visibility and Sharing",
        description:
            "Information visibility depends on the purpose of the feature and the user's role.",
        details: [
            {
                heading: "Public campaign information",
                text: "Campaign details and approved organization information may be displayed publicly so donors can discover causes and decide whether to contribute.",
            },
            {
                heading: "Organization access",
                text: "Authorized members of an organization may access relevant campaign, donation, and verification records associated with that organization.",
            },
            {
                heading: "Administrative access",
                text: "Authorized administrators may access information necessary to review organizations, manage campaigns, oversee donation records, and maintain platform operations.",
            },
            {
                heading: "Service providers",
                text: "Information may be processed by third-party services used to operate platform features, such as hosting, email delivery, or payment processing, where those services are integrated.",
            },
        ],
    },
    {
        number: "04",
        icon: LockKeyhole,
        title: "Data Security",
        description:
            "We aim to protect account information and platform records through appropriate safeguards.",
        details: [
            {
                heading: "Account protection",
                text: "ShareHope uses authentication mechanisms and role-based access controls to help prevent unauthorized access to protected areas.",
            },
            {
                heading: "Password protection",
                text: "Passwords are handled through the platform's authentication system and should never be shared with other users or support personnel.",
            },
            {
                heading: "Access management",
                text: "Access to sensitive platform information is intended to be limited according to user permissions and organizational responsibilities.",
            },
        ],
    },
    {
        number: "05",
        icon: FileText,
        title: "Data Retention",
        description:
            "Information may be retained for as long as it is needed for platform operations.",
        details: [
            {
                heading: "Account records",
                text: "Account information may be retained while an account remains active and for a reasonable period afterward when needed for operational or record-keeping purposes.",
            },
            {
                heading: "Donation and audit records",
                text: "Donation, verification, and activity records may be retained to preserve transaction histories, support accountability, and maintain platform records.",
            },
            {
                heading: "Legal and operational requirements",
                text: "Certain information may need to be retained to meet applicable legal obligations or resolve disputes and security issues.",
            },
        ],
    },
    {
        number: "06",
        icon: UserRound,
        title: "Your Choices and Rights",
        description:
            "You should have reasonable control over your account information.",
        details: [
            {
                heading: "Review your information",
                text: "You can access the profile information made available through your account and review its accuracy.",
            },
            {
                heading: "Request corrections",
                text: "If your personal or organization information is incorrect, contact the platform team to request an appropriate correction.",
            },
            {
                heading: "Account-related requests",
                text: "You may contact us regarding account access, personal information, or other privacy-related concerns. Some records may need to be retained for legitimate operational or legal reasons.",
            },
        ],
    },
];

function UsersIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
            aria-hidden="true"
        >
            <path
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m16 0v-2a4 4 0 0 0-3-3.87M14 3.13a4 4 0 0 1 0 7.75M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function PrivacyPage() {
    return (
        <main className="overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            {/* Hero */}
            <section className="relative border-b border-[#E6EDE2]">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                        <span className="h-px w-8 bg-[#32804A]" />
                        Legal
                        <span className="text-[#A0AD9D]">/</span>
                        Privacy Policy
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.65fr] lg:items-end lg:gap-20">
                        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
                            Your trust
                            <br />
                            deserves
                            <br />
                            <span className="font-serif font-normal italic text-[#29904C]">
                                protection.
                            </span>
                        </h1>

                        <div className="max-w-md pb-2 lg:pb-3">
                            <p className="text-base leading-8 text-[#647568] sm:text-lg">
                                Your information matters. This policy explains
                                what information ShareHope handles, how it is
                                used, and the choices available to you when
                                using our platform.
                            </p>

                            <a
                                href="#privacy-details"
                                className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#166534] transition hover:gap-5"
                            >
                                Read our policy
                                <ArrowDown size={17} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-3 sm:grid-cols-[1.4fr_0.6fr] sm:gap-5 lg:mt-20">
                        <div className="relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#E5F0E1] p-7 sm:min-h-[350px] sm:p-10">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#166534]">
                                <ShieldCheck size={26} />
                            </div>

                            <div className="relative z-10 max-w-lg">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52815B]">
                                    Our commitment
                                </p>

                                <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-4xl">
                                    Responsible information handling starts
                                    with transparency.
                                </h2>

                                <p className="mt-4 max-w-md text-sm leading-7 text-[#617662]">
                                    We aim to handle platform information
                                    responsibly and make our data practices
                                    understandable.
                                </p>
                            </div>

                            <ShieldCheck
                                size={190}
                                strokeWidth={0.7}
                                className="pointer-events-none absolute -right-8 -top-8 text-[#166534]/[0.06]"
                            />
                        </div>

                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#14532D] p-7 text-white sm:min-h-[350px] sm:p-9">
                            <div>
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                    <LockKeyhole size={25} />
                                </span>

                                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#B9DDBA]">
                                    Your information
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-extrabold leading-tight sm:text-3xl">
                                    Respect.

                                    <br />
                                    Responsibility.
                                    <br />
                                    Transparency.
                                </p>

                                <div className="mt-6 h-px w-full bg-white/20" />

                                <p className="mt-4 text-sm leading-6 text-white/70">
                                    Clear information practices help build
                                    confidence between donors and
                                    organizations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Policy Introduction */}
            <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            About this policy
                        </p>

                        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                            Understanding how your information is handled.
                        </h2>
                    </div>

                    <div className="max-w-3xl">
                        <p className="text-lg font-medium leading-9 text-[#315B3D] sm:text-xl">
                            ShareHope is designed to connect donors and
                            nonprofit organizations through campaign-based
                            giving. Operating this platform involves
                            collecting and maintaining certain information.
                        </p>

                        <p className="mt-6 text-sm leading-8 text-[#718071] sm:text-base">
                            This Privacy Policy describes the general
                            information practices associated with ShareHope,
                            including account registration, organization
                            management, campaign activities, donation
                            records, and platform security.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <span className="rounded-full border border-[#DCE8D8] bg-[#F5F9F2] px-4 py-2 text-xs font-semibold text-[#52745A]">
                                Account information
                            </span>
                            <span className="rounded-full border border-[#DCE8D8] bg-[#F5F9F2] px-4 py-2 text-xs font-semibold text-[#52745A]">
                                Donation records
                            </span>
                            <span className="rounded-full border border-[#DCE8D8] bg-[#F5F9F2] px-4 py-2 text-xs font-semibold text-[#52745A]">
                                Data security
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Policy Details */}
            <section
                id="privacy-details"
                className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            01 / Privacy Details
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Our privacy practices.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#718071] sm:text-base">
                            The following sections explain how information
                            is collected, used, protected, and maintained
                            across the ShareHope platform.
                        </p>
                    </div>

                    <div className="mt-14 divide-y divide-[#E3EAE0] border-y border-[#E3EAE0]">
                        {privacySections.map((section) => {
                            const Icon = section.icon;

                            return (
                                <article
                                    key={section.number}
                                    className="grid gap-6 py-9 sm:grid-cols-[65px_1fr] sm:gap-8 sm:py-11"
                                >
                                    <div className="flex items-start justify-between sm:block">
                                        <span className="text-sm font-bold tracking-widest text-[#A1B19D]">
                                            {section.number}
                                        </span>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#287747] sm:mt-7">
                                            <Icon size={21} />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-extrabold text-[#183B2A] sm:text-2xl">
                                            {section.title}
                                        </h3>

                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#718071]">
                                            {section.description}
                                        </p>

                                        <div className="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2">
                                            {section.details.map((detail) => (
                                                <div key={detail.heading}>
                                                    <h4 className="text-sm font-bold text-[#315B3D]">
                                                        {detail.heading}
                                                    </h4>

                                                    <p className="mt-2 text-sm leading-7 text-[#718071]">
                                                        {detail.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Policy Updates */}
            <section className="border-y border-[#E5EDE3] bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            02 / Policy Updates
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            Keeping this policy current.
                        </h2>
                    </div>

                    <div className="max-w-3xl">
                        <p className="text-base leading-8 text-[#718071]">
                            This Privacy Policy may be updated as ShareHope
                            develops new features, changes its information
                            practices, or needs to reflect applicable
                            requirements.
                        </p>

                        <p className="mt-5 text-base leading-8 text-[#718071]">
                            When an updated version is published, the revised
                            policy will be made available on this page. We
                            encourage users to review it periodically to
                            understand how their information is handled.
                        </p>

                        <div className="mt-8 rounded-2xl border border-[#E3EAE0] bg-[#FFFCF6] p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#287747]">
                                    <FileText size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#183B2A]">
                                        Policy version
                                    </p>
                                    <p className="mt-1 text-xs text-[#718071]">
                                        Privacy Policy — ShareHope
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-6 text-[#829082]">
                                Effective date: To be confirmed before
                                publication.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#14532D] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
                        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9DDBA]">
                                    03 / Privacy Questions
                                </p>

                                <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                    Your privacy matters to us.
                                </h2>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                                    If you have questions about this policy
                                    or how your information is handled,
                                    please reach out through our contact
                                    page.
                                </p>
                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#166534] transition hover:bg-[#EAF3E6]"
                            >
                                Contact us
                                <ArrowRight size={17} />
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>

                        <ShieldCheck
                            size={250}
                            strokeWidth={0.6}
                            className="pointer-events-none absolute -bottom-20 -right-12 text-white/[0.045]"
                        />
                    </div>

                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#E3EAE0] pt-6 sm:flex-row sm:items-center">
                        <p className="text-xs font-semibold tracking-wide text-[#66806A]">
                            SHAREHOPE — YOUR TRUST MATTERS.
                        </p>

                        <p className="text-xs text-[#829082]">
                            Giving with care. Handling information responsibly.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
