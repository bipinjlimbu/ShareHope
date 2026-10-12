"use client";

import { useCallback, useEffect, useState } from "react";
import type { AuthUser } from "@/types/auth";
import LogoutButton from "@/components/LogoutButton";
import NavbarSkeleton from "@/components/skeleton/NavbarSkeleton";

const links = [
    { label: "Home", href: "/" },
    { label: "Campaigns", href: "/campaigns" },
    { label: "NGOs", href: "/ngos" },
    { label: "About", href: "/about" },
];

function getStoredUser(): AuthUser | null {
    try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            return null;
        }

        const parsedUser: unknown = JSON.parse(storedUser);

        if (
            typeof parsedUser === "object" &&
            parsedUser !== null &&
            "username" in parsedUser &&
            typeof parsedUser.username === "string"
        ) {
            return parsedUser as AuthUser;
        }

        return null;
    } catch {
        return null;
    }
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const syncUser = useCallback(() => {
        setUser(getStoredUser());
        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        syncUser();

        window.addEventListener("auth-change", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth-change", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, [syncUser]);

    if (isCheckingAuth) {
        return <NavbarSkeleton />;
    }

    const profilePicture =
        typeof user?.profile_picture === "string"
            ? user.profile_picture
            : null;

    const username = user?.username ?? "";

    const profileLinkClass =
        "flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-[#EDF5EC]";

    const logoutClass =
        "rounded-xl border border-[#DDE7DC] px-4 py-2.5 text-sm font-semibold text-[#31523C] transition hover:border-red-200 hover:bg-red-50 hover:text-red-700";

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-[#E6EDE4] bg-[#FFFCF6]/95 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
                <a
                    href="/"
                    className="flex shrink-0 items-center gap-2.5"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#166534] text-white shadow-sm">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.3 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>

                    <span className="text-xl font-extrabold tracking-tight text-[#14532D]">
                        Share<span className="text-[#35A45C]">Hope</span>
                    </span>
                </a>

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[#536458] transition hover:text-[#166534]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    {user ? (
                        <>
                            <a
                                href="/profile"
                                className={profileLinkClass}
                                aria-label={`View ${username}'s profile`}
                            >
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt=""
                                        className="h-10 w-10 rounded-full border border-[#DDE7DC] object-cover"
                                    />
                                ) : (
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F1E4] text-sm font-bold uppercase text-[#166534]">
                                        {username.charAt(0) || "U"}
                                    </span>
                                )}

                                <span className="max-w-32 truncate text-sm font-semibold text-[#31523C]">
                                    {username}
                                </span>
                            </a>

                            <LogoutButton className={logoutClass} />
                        </>
                    ) : (
                        <>
                            <a
                                href="/login"
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#31523C] transition hover:bg-[#EDF5EC]"
                            >
                                Log in
                            </a>

                            <a
                                href="/register"
                                className="rounded-xl bg-[#166534] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#14532D]"
                            >
                                Get started
                            </a>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={
                        menuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE7DC] text-[#14532D] md:hidden"
                >
                    {menuOpen ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                d="m6 6 12 12M18 6 6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 7h16M4 12h16M4 17h16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {menuOpen && (
                <div className="border-t border-[#E6EDE4] bg-[#FFFCF6] px-5 py-5 md:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-1">
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-[#31523C] transition hover:bg-[#EDF5EC]"
                            >
                                {link.label}
                            </a>
                        ))}

                        {user ? (
                            <>
                                <a
                                    href="/profile"
                                    onClick={closeMenu}
                                    className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-[#EDF5EC]"
                                >
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt=""
                                            className="h-10 w-10 rounded-full border border-[#DDE7DC] object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F1E4] text-sm font-bold uppercase text-[#166534]">
                                            {username.charAt(0) || "U"}
                                        </span>
                                    )}

                                    <span className="min-w-0">
                                        <span className="block text-xs text-[#718174]">
                                            Signed in as
                                        </span>
                                        <span className="block truncate text-sm font-semibold text-[#31523C]">
                                            {username}
                                        </span>
                                    </span>
                                </a>

                                <div className="mt-3">
                                    <LogoutButton
                                        onLoggedOut={closeMenu}
                                        className={`${logoutClass} w-full`}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <a
                                    href="/login"
                                    onClick={closeMenu}
                                    className="rounded-xl border border-[#DDE7DC] px-4 py-3 text-center text-sm font-semibold text-[#14532D]"
                                >
                                    Log in
                                </a>

                                <a
                                    href="/register"
                                    onClick={closeMenu}
                                    className="rounded-xl bg-[#166534] px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    Get started
                                </a>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}