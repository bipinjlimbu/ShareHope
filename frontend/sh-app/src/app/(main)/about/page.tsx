
import Link from "next/link";
import {
    ArrowDown,
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    BookOpen,
    CheckCircle2,
    HandHeart,
    HeartHandshake,
    Leaf,
    ShieldCheck,
    Users,
} from "lucide-react";

const principles = [
    {
        number: "01",
        icon: ShieldCheck,
        title: "Transparency",
        description:
            "Donation information is organized and recorded so contributions can be followed through the platform.",
    },
    {
        number: "02",
        icon: HeartHandshake,
        title: "Accountability",
        description:
            "Organizations review received donations and maintain verification records for better accountability.",
    },
    {
        number: "03",
        icon: Users,
        title: "Community",
        description:
            "We connect people and organizations around shared causes and the needs of their communities.",
    },
    {
        number: "04",
        icon: HandHeart,
        title: "Compassion",
        description:
            "Every contribution matters. We want to make it easier for people to turn their willingness to help into action.",
    },
];

const process = [
    {
        number: "01",
        title: "Create a campaign",
        description:
            "NGOs submit campaigns explaining their purpose, goals, and required support.",
    },
    {
        number: "02",
        title: "Review and approval",
        description:
            "Administrators review submitted campaigns before they become publicly available.",
    },
    {
        number: "03",
        title: "Make a contribution",
        description:
            "Donors choose an active campaign and contribute funds, items, or both.",
    },
    {
        number: "04",
        title: "Verify and record",
        description:
            "The organization reviews received donations and maintains their verification history.",
    },
];

export default function AboutPage() {
    return (
        <main className="overflow-hidden bg-[#FFFCF6] text-[#183B2A]">
            {/* Editorial Introduction */}
            <section className="relative border-b border-[#E6EDE2]">
                <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pt-24">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                        <span className="h-px w-8 bg-[#32804A]" />
                        Who We Are
                        <span className="text-[#A0AD9D]">/</span>
                        About ShareHope
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.65fr] lg:items-end lg:gap-20">
                        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-[5.5rem]">
                            Giving should
                            <br />
                            mean more than
                            <br />
                            <span className="font-serif font-normal italic text-[#29904C]">
                                just giving.
                            </span>
                        </h1>

                        <div className="max-w-md pb-2 lg:pb-3">
                            <p className="text-base leading-8 text-[#647568] sm:text-lg">
                                We believe generosity deserves a system that
                                brings people together, connects meaningful
                                causes with willing donors, and makes every
                                contribution count.
                            </p>

                            <a
                                href="#our-story"
                                className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#166534] transition hover:gap-5"
                            >
                                Discover our story
                                <ArrowDown size={17} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-14 grid gap-3 sm:grid-cols-[1.4fr_0.6fr] sm:gap-5 lg:mt-20">
                        <div className="relative min-h-[270px] overflow-hidden rounded-[1.75rem] bg-[#DCEBDD] sm:min-h-[390px]">
                            <img
                                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1400&q=85"
                                alt="People working together to support their community"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#173D28]/65 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 max-w-sm text-white sm:bottom-9 sm:left-9">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                                    Our belief
                                </p>
                                <p className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
                                    Better things happen when we help each
                                    other.
                                </p>
                            </div>
                        </div>

                        <div className="flex min-h-[270px] flex-col justify-between rounded-[1.75rem] bg-[#14532D] p-7 text-white sm:min-h-[390px] sm:p-9">
                            <div>
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                                    <HandHeart size={25} />
                                </span>

                                <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#B9DDBA]">
                                    The idea behind ShareHope
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-extrabold leading-tight sm:text-3xl">
                                    One platform.
                                    <br />
                                    Many causes.
                                    <br />
                                    Shared hope.
                                </p>
                                <div className="mt-6 h-px w-full bg-white/20" />
                                <p className="mt-4 text-sm leading-6 text-white/70">
                                    Connecting donors and nonprofit
                                    organizations through campaign-based
                                    giving.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section
                id="our-story"
                className="scroll-mt-20 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
            >
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            01 / Our Story
                        </p>

                        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                            A simpler way to make giving meaningful.
                        </h2>
                    </div>

                    <div className="max-w-3xl">
                        <p className="text-xl font-medium leading-9 text-[#315B3D] sm:text-2xl sm:leading-10">
                            There are people who want to help, organizations
                            working to make a difference, and communities that
                            need support. Bringing them together should not be
                            complicated.
                        </p>

                        <p className="mt-7 text-base leading-8 text-[#718071]">
                            Traditional donation processes can involve
                            scattered information, disconnected records, and
                            difficulties following contributions. ShareHope
                            was designed around a simple idea: create a
                            centralized platform where organizations can
                            manage campaigns and donors can discover causes
                            that matter to them.
                        </p>

                        <p className="mt-5 text-base leading-8 text-[#718071]">
                            Through campaign management, donation tracking,
                            and verification records, ShareHope aims to bring
                            more structure to the giving process. It provides
                            a common space where organizations and donors can
                            participate in meaningful community initiatives.
                        </p>

                        <div className="mt-10 flex items-center gap-4 border-t border-[#E8EEE5] pt-7">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5F2E1] text-[#166534]">
                                <Leaf size={23} />
                            </div>
                            <p className="max-w-md text-sm font-semibold leading-6 text-[#315B3D]">
                                We are building a more organized way for
                                generosity to reach the people who need it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission and Vision */}
            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                                02 / Our Direction
                            </p>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                What we are working towards.
                            </h2>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-[#718071]">
                            Our mission defines what we want to accomplish
                            today. Our vision describes the future we hope to
                            help create.
                        </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <article className="relative overflow-hidden rounded-[1.75rem] bg-[#E8F2E4] p-8 sm:p-11">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#52815B]">
                                Our Mission
                            </span>

                            <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#166534]">
                                <TargetIcon />
                            </div>

                            <h3 className="mt-8 max-w-lg text-3xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-4xl">
                                Make giving more organized, accessible, and
                                accountable.
                            </h3>

                            <p className="mt-5 max-w-lg text-sm leading-7 text-[#617662]">
                                We aim to connect donors and nonprofit
                                organizations through a structured platform
                                for creating campaigns, contributing
                                donations, and maintaining reliable records.
                            </p>

                            <span className="pointer-events-none absolute -bottom-16 -right-8 text-[13rem] font-black leading-none text-[#166534]/[0.045]">
                                M
                            </span>
                        </article>

                        <article className="relative overflow-hidden rounded-[1.75rem] bg-[#14532D] p-8 text-white sm:p-11">
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#B9DDBA]">
                                Our Vision
                            </span>

                            <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <BookOpen size={27} />
                            </div>

                            <h3 className="mt-8 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                A connected community where generosity creates
                                lasting impact.
                            </h3>

                            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
                                We envision a giving community where people
                                can discover meaningful causes, organizations
                                can manage their initiatives, and contributions
                                are handled with greater transparency.
                            </p>

                            <span className="pointer-events-none absolute -bottom-16 -right-8 text-[13rem] font-black leading-none text-white/[0.055]">
                                V
                            </span>
                        </article>
                    </div>
                </div>
            </section>

            {/* Platform Process */}
            <section className="border-y border-[#E5EDE3] bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                            03 / The Process
                        </p>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            How ShareHope brings people together.
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#718071] sm:text-base">
                            A structured journey from campaign creation to
                            donation verification.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-0 md:grid-cols-2 lg:grid-cols-4">
                        {process.map((step, index) => (
                            <article
                                key={step.number}
                                className={`relative border-t-2 border-[#DCE9D7] py-7 md:px-6 lg:border-l lg:border-t-0 lg:first:border-l-0 lg:py-4 ${index === 0 ? "lg:pl-0" : ""
                                    }`}
                            >
                                <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full bg-[#29904C] ring-4 ring-white lg:left-6 lg:top-0 lg:first:left-0" />

                                <p className="text-sm font-extrabold tracking-widest text-[#29904C]">
                                    {step.number}
                                </p>

                                <h3 className="mt-7 text-xl font-bold leading-snug text-[#183B2A]">
                                    {step.title}
                                </h3>

                                <p className="mt-4 max-w-xs text-sm leading-7 text-[#718071]">
                                    {step.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                                04 / Our Principles
                            </p>

                            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                                The values that shape our work.
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-[#718071]">
                                We believe that meaningful giving needs more
                                than good intentions. It needs trust,
                                responsibility, and people who care about
                                making a difference.
                            </p>

                            <div className="mt-8">
                                <Link
                                    href="/campaigns/"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#166534] transition hover:gap-4"
                                >
                                    Explore campaigns
                                    <ArrowUpRight size={17} />
                                </Link>
                            </div>
                        </div>

                        <div className="divide-y divide-[#E3EAE0] border-y border-[#E3EAE0]">
                            {principles.map((principle) => {
                                const Icon = principle.icon;

                                return (
                                    <article
                                        key={principle.number}
                                        className="group grid gap-4 py-7 sm:grid-cols-[65px_1fr] sm:gap-6"
                                    >
                                        <span className="text-sm font-bold text-[#A1B19D]">
                                            {principle.number}
                                        </span>

                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3E6] text-[#287747] transition group-hover:bg-[#166534] group-hover:text-white">
                                                <Icon size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-[#183B2A]">
                                                    {principle.title}
                                                </h3>

                                                <p className="mt-2 max-w-xl text-sm leading-7 text-[#718071]">
                                                    {principle.description}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="bg-[#EAF2E5] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#32804A]">
                                The next step starts with you
                            </p>

                            <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#183B2A] sm:text-5xl lg:text-6xl">
                                Hope grows when we share it.
                            </h2>

                            <p className="mt-5 max-w-xl text-sm leading-7 text-[#657966] sm:text-base">
                                Whether you want to support a cause or bring
                                your organization to ShareHope, there is a
                                place for you in this community.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                            <Link
                                href="/campaigns/"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#166534] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#14532D]"
                            >
                                Find a campaign
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                href="/ngos/"
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-[#BFD5B9] bg-white px-6 py-3 text-sm font-bold text-[#166534] transition hover:border-[#166534] hover:bg-[#F8FCF5]"
                            >
                                Our NGOs
                                <ArrowUpRight size={17} />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#D4E2D0] pt-6 sm:flex-row sm:items-center">
                        <p className="text-xs font-semibold tracking-wide text-[#66806A]">
                            SHAREHOPE — GIVING WITH PURPOSE.
                        </p>
                        <p className="text-xs text-[#829082]">
                            Together, every contribution counts.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

function TargetIcon() {
    return <BadgeCheck size={27} />;
}
