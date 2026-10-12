const footerLinks = {
    Platform: [
        { label: "Explore campaigns", href: "/campaigns" },
        { label: "Find NGOs", href: "/ngos" },
        { label: "How it works", href: "/about" },
    ],
    Community: [
        { label: "Register as a donor", href: "/register" },
        { label: "Register an NGO", href: "/register/ngo" },
        { label: "Contact us", href: "/contact" },
    ],
    Account: [
        { label: "Log in", href: "/login" },
        { label: "Create account", href: "/register" },
        { label: "Help center", href: "/help" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[#103B25] text-white">
            <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:px-12">
                <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div className="max-w-sm">
                        <a href="/" className="inline-flex items-center gap-2.5">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                                    <path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span className="text-xl font-extrabold tracking-tight">
                                Share<span className="text-[#86D69A]">Hope</span>
                            </span>
                        </a>
                        <p className="mt-5 text-sm leading-7 text-emerald-50/75">
                            Bringing generous people and trusted organizations together to create meaningful change, one act of kindness at a time.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-emerald-50/80">
                            <span className="h-2 w-2 rounded-full bg-[#86D69A]" />
                            Made for a more caring community
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([heading, items]) => (
                        <div key={heading}>
                            <h2 className="text-sm font-bold text-white">{heading}</h2>
                            <ul className="mt-5 space-y-4">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <a href={item.href} className="text-sm text-emerald-50/70 transition hover:text-white">
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 pt-6 text-xs text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 ShareHope. All rights reserved.</p>
                    <div className="flex flex-wrap gap-5">
                        <a href="/privacy" className="transition hover:text-white">Privacy policy</a>
                        <a href="/terms" className="transition hover:text-white">Terms of use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
