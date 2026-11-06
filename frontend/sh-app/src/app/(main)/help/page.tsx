import Link from "next/link";

import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    CircleHelp,
    FileCheck,
    HandHeart,
    HeartHandshake,
    LifeBuoy,
    Mail,
    MessageCircle,
    ShieldCheck,
    Users,
} from "lucide-react";

const helpCategories = [
    {
        icon: HandHeart,
        number: "01",
        title: "For Donors",
        description:
            "Learn how to discover campaigns, contribute donations, and follow your donation history.",
        link: "/campaigns",
        linkLabel: "Explore campaigns",
    },
    {
        icon: Users,
        number: "02",
        title: "For NGOs",
        description:
            "Understand how organizations can register, manage campaigns, and review received donations.",
        link: "/register",
        linkLabel: "Get started",
    },
    {
        icon: ShieldCheck,
        number: "03",
        title: "Trust and Verification",
        description:
            "Learn about campaign reviews, donation verification, and the records maintained on ShareHope.",
        link: "/about",
        linkLabel: "Learn about us",
    },
];

const faqs = [
    {
        category: "Getting started",
        questions: [
            {
                question: "What is ShareHope?",
                answer:
                    "ShareHope is a campaign-based donation platform that connects donors with nonprofit organizations. It provides a shared space for organizations to create campaigns and for donors to discover causes and contribute funds or items.",
            },
            {
                question: "How do I create an account?",
                answer:
                    "Visit the registration page and complete the required information. Select the appropriate account type during registration. You can then log in using your account credentials.",
            },
            {
                question: "Which account types are available?",
                answer:
                    "ShareHope supports donors, NGO administrators, NGO staff, and system administrators. Public registration is available for the roles offered on the registration page.",
            },
        ],
    },
    {
        category: "Donations and campaigns",
        questions: [
            {
                question: "How can I find a campaign?",
                answer:
                    "Visit the campaigns page to explore available campaigns. Open a campaign to learn about its purpose, goals, and the support it needs before deciding whether to contribute.",
            },
            {
                question: "What types of donations can I make?",
                answer:
                    "ShareHope supports fund donations and item donations. The available contribution options depend on the campaign and its requirements.",
            },
            {
                question: "Can I donate to any campaign?",
                answer:
                    "You can contribute to campaigns that have been approved and made active on the platform. Campaign availability may change over time.",
            },
            {
                question: "Where can I see my donation records?",
                answer:
                    "After logging in, visit your donor dashboard to access your donation information and available donation history.",
            },
        ],
    },
    {
        category: "NGO accounts and verification",
        questions: [
            {
                question: "How can an NGO join ShareHope?",
                answer:
                    "An organization can begin by registering an NGO account and submitting the required organization information and documents. The organization must go through the platform's review process before receiving approval.",
            },
            {
                question: "How do campaigns become available?",
                answer:
                    "NGOs submit campaigns for review. Administrators review submitted campaigns, and approved campaigns can become active and available for donors.",
            },
            {
                question: "What does donation verification mean?",
                answer:
                    "Donation verification is the process through which an organization reviews a donation after it has been received. Verification records help maintain a history of received contributions.",
            },
        ],
    },
    {
        category: "Account and security",
        questions: [
            {
                question: "How do I access my dashboard?",
                answer:
                    "Log in to your account and use the Dashboard link to access the area associated with your account role.",
            },
            {
                question: "What should I do if I cannot log in?",
                answer:
                    "Check that you are using the correct login credentials. If the issue continues, contact the ShareHope support team and explain the problem without sharing your password.",
            },
            {
                question: "How can I get help with an account issue?",
                answer:
                    "Use the contact page to reach out with your issue. Include relevant details such as the page you were using and the error message you encountered. Never share your password.",
            },
        ],
    },
];

export default function HelpPage() {
    return (
        <main className="overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            {/* Hero */}
            <section className="relative border-b border-[#E6EDE2]">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                        <span className="h-px w-8 bg-[#32804A]" />
                        Support
                        <span className="text-[#A0AD9D]">/</span>
                        Help Center
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.65fr] lg:items-end lg:gap-20">
                        <div>
                            <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
                                A little help
                                <br />
                                goes a long
                                <br />
                                <span className="font-serif font-normal italic text-[#29904C]">
                                    way.
                                </span>
                            </h1>
                        </div>

                        <div className="max-w-md pb-2 lg:pb-3">
                            <p className="text-base leading-8 text-[#647568] sm:text-lg">
                                Whether you are supporting a cause or
                                managing an organization, find the guidance
                                you need to make the most of ShareHope.
                            </p>

                            <a
                                href="#frequently-asked"
                                className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#166534] transition hover:gap-5"
                            >
                                Browse common questions
                                <ArrowDown size={17} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-3 sm:grid-cols-[1.4fr_0.6fr] sm:gap-5 lg:mt-20">
                        <div className="relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#E5F0E1] p-7 sm:min-h-[350px] sm:p-10">
                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#166534]">
                                <CircleHelp size={26} />
                            </div>

                            <div className="relative z-10 max-w-lg">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52815B]">
                                    Here to guide you
                                </p>

                                <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-4xl">
                                    Find answers and move forward with
                                    confidence.
                                </h2>

                                <p className="mt-4 max-w-md text-sm leading-7 text-[#617662]">
                                    Explore helpful information about
                                    accounts, campaigns, donations, and
                                    organization verification.
                                </p>
                            </div>

                            <BookOpen
                                size={190}
                                strokeWidth={0.7}
                                className="pointer-events-none absolute -right-8 -top-8 text-[#166534]/[0.06]"
                            />
                        </div>

                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#14532D] p-7 text-white sm:min-h-[350px] sm:p-9">
                            <div>
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                    <HeartHandshake size={25} />
                                </span>

                                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#B9DDBA]">
                                    Need more assistance?
                                </p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                                    We are here to help.
                                </h2>

                                <p className="mt-4 text-sm leading-6 text-white/70">
                                    Still have a question? Get in touch with
                                    our support team.
                                </p>

                                <Link
                                    href="/contact"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:gap-4"
                                >
                                    Contact us
                                    <ArrowUpRight size={17} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Categories */}
            <section className="bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            01 / Browse by topic
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            How can we help you?
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#718071] sm:text-base">
                            Start with the section that best matches what
                            you are trying to do.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {helpCategories.map((category) => {
                            const Icon = category.icon;

                            return (
                                <article
                                    key={category.number}
                                    className="group relative flex flex-col rounded-[1.5rem] border border-[#E5EDE2] bg-[#FFFCF6] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C8DCC3] hover:shadow-lg hover:shadow-[#183B2A]/[0.05] sm:p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold tracking-widest text-[#A1B19D]">
                                            {category.number}
                                        </span>

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3E6] text-[#287747] transition group-hover:bg-[#166534] group-hover:text-white">
                                            <Icon size={23} />
                                        </div>
                                    </div>

                                    <h3 className="mt-8 text-xl font-extrabold text-[#183B2A]">
                                        {category.title}
                                    </h3>

                                    <p className="mt-3 flex-1 text-sm leading-7 text-[#718071]">
                                        {category.description}
                                    </p>

                                    <Link
                                        href={category.link}
                                        className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition group-hover:gap-4"
                                    >
                                        {category.linkLabel}
                                        <ArrowRight size={17} />
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section
                id="frequently-asked"
                className="scroll-mt-20 border-y border-[#E5EDE3] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
            >
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div className="lg:sticky lg:top-28 lg:h-fit">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            02 / Frequently Asked
                        </p>

                        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                            Questions, answered.
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-[#718071]">
                            Find quick answers to common questions about
                            using ShareHope. Select a question to read more.
                        </p>

                        <div className="mt-8 rounded-2xl border border-[#E3EAE0] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#287747]">
                                    <MessageCircle size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-[#183B2A]">
                                        Still need help?
                                    </p>
                                    <p className="mt-1 text-xs text-[#718071]">
                                        We are happy to hear from you.
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/contact"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition hover:gap-4"
                            >
                                Contact support
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {faqs.map((group, groupIndex) => (
                            <div key={group.category}>
                                <div className="mb-5 flex items-center gap-3">
                                    <span className="text-xs font-bold tracking-widest text-[#29904C]">
                                        0{groupIndex + 1}
                                    </span>

                                    <h3 className="text-lg font-extrabold text-[#183B2A]">
                                        {group.category}
                                    </h3>
                                </div>

                                <div className="divide-y divide-[#E5EDE2] border-y border-[#E5EDE2]">
                                    {group.questions.map((item, index) => (
                                        <details
                                            key={item.question}
                                            className="group py-5"
                                        >
                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left marker:hidden">
                                                <span className="text-sm font-bold leading-6 text-[#315B3D] transition group-open:text-[#166534] sm:text-base">
                                                    {item.question}
                                                </span>

                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCE8D8] text-[#287747] transition group-open:rotate-180 group-open:bg-[#EAF3E6]">
                                                    <ArrowDown size={16} />
                                                </span>
                                            </summary>

                                            <p className="max-w-2xl pt-4 pr-10 text-sm leading-7 text-[#718071]">
                                                {item.answer}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="relative overflow-hidden rounded-[1.75rem] bg-[#14532D] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
                        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div className="max-w-2xl">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B9DDBA]">
                                    03 / Contact and Support
                                </p>

                                <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                    Couldn't find what you were looking for?
                                </h2>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                                    If you still have questions or need
                                    assistance with your account, donations,
                                    or organization, reach out through our
                                    contact page.
                                </p>
                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#166534] transition hover:bg-[#EAF3E6]"
                            >
                                <Mail size={17} />
                                Contact us
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>

                        <LifeBuoy
                            size={250}
                            strokeWidth={0.6}
                            className="pointer-events-none absolute -bottom-20 -right-12 text-white/[0.045]"
                        />
                    </div>

                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#E3EAE0] pt-6 sm:flex-row sm:items-center">
                        <p className="text-xs font-semibold tracking-wide text-[#66806A]">
                            SHAREHOPE — HERE WHEN YOU NEED US.
                        </p>

                        <p className="text-xs text-[#829082]">
                            Every question deserves an answer.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
