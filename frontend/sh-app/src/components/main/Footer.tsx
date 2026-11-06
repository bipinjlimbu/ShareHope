"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { AuthUser } from "@/types/auth";

import { getProfile } from "@/services/profileService";
import { getAuthStatus } from "@/lib/authStatus";

import FooterDataFetchSkeleton from "@/components/skeleton/main/FooterDataFetchSkeleton";

import FooterLogo from "@/images/FooterLogo.png";

const footerLinks = {
    Platform: [
        { label: "Explore campaigns", href: "/campaigns" },
        { label: "Find NGOs", href: "/ngos" },
        { label: "How it works", href: "/about" },
    ],
    Community: [
        { label: "Contact us", href: "/contact" },
        { label: "About us", href: "/about" },
    ],
};

function getDashboardHref(role: string): string {
    switch (role) {
        case "ADMIN":
            return "/dashboard/admin";

        case "DONOR":
            return "/dashboard/donor";

        case "NGO_ADMIN":
        case "NGO_STAFF":
            return "/dashboard/ngo";

        default:
            return "/profile";
    }
}

export default function Footer() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        let active = true;
        let requestId = 0;

        async function syncUser() {
            if (!getAuthStatus()) {
                requestId++;
                setUser(null);
                setIsCheckingAuth(false);
                return;
            }

            const currentRequestId = ++requestId;

            try {
                const response = await getProfile();

                if (active && currentRequestId === requestId) {
                    setUser(response.user);
                }
            } catch {
                if (active && currentRequestId === requestId) {
                    setUser(null);
                }
            } finally {
                if (active && currentRequestId === requestId) {
                    setIsCheckingAuth(false);
                }
            }
        }

        function handleAuthChange(event: Event) {
            const customEvent = event as CustomEvent<{
                authenticated?: boolean;
            }>;

            if (customEvent.detail?.authenticated === false) {
                requestId++;
                setUser(null);
                setIsCheckingAuth(false);
                return;
            }

            if (
                customEvent.detail?.authenticated === true ||
                getAuthStatus()
            ) {
                setIsCheckingAuth(true);
                void syncUser();
            } else {
                requestId++;
                setUser(null);
                setIsCheckingAuth(false);
            }
        }

        function handleStorageChange() {
            setIsCheckingAuth(true);
            void syncUser();
        }

        void syncUser();

        window.addEventListener("auth-change", handleAuthChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            active = false;
            requestId++;

            window.removeEventListener("auth-change", handleAuthChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "");

    const accountLinks = user
        ? [
            { label: "My profile", href: "/profile" },
            {
                label: "Dashboard",
                href: getDashboardHref(user.role),
            },
        ]
        : [
            { label: "Log in", href: "/login" },
            { label: "Create account", href: "/register" },
            { label: "Help center", href: "/help" },
        ];

    return (
        <footer className="bg-[#103B25] text-white">
            <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:px-12">
                <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <Link
                            href="/"
                            aria-label="ShareHope home"
                            className="inline-flex items-center"
                        >
                            <Image
                                src={FooterLogo}
                                alt="ShareHope"
                                priority
                                className="h-auto w-[180px] object-contain"
                            />
                        </Link>

                        <p className="mt-5 text-sm leading-7 text-emerald-50/75">
                            Bringing generous people and trusted
                            organizations together to create meaningful
                            change, one act of kindness at a time.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-emerald-50/80">
                            <span className="h-2 w-2 rounded-full bg-[#86D69A]" />
                            Made for a more caring community
                        </div>
                    </div>

                    {/* Platform and Community */}
                    {Object.entries(footerLinks).map(([heading, items]) => (
                        <div key={heading}>
                            <h2 className="text-sm font-bold text-white">
                                {heading}
                            </h2>

                            <ul className="mt-5 space-y-4">
                                {items.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-emerald-50/70 transition hover:text-white"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Dynamic Account section */}
                    <div>
                        <h2 className="text-sm font-bold text-white">
                            Account
                        </h2>

                        {isCheckingAuth ? (
                            <FooterDataFetchSkeleton />
                        ) : (
                            <>
                                {user && (
                                    <div className="mt-5 flex items-center gap-3">
                                        {user.profile_picture ? (
                                            <img
                                                src={
                                                    user.profile_picture.startsWith(
                                                        "http://"
                                                    ) ||
                                                        user.profile_picture.startsWith(
                                                            "https://"
                                                        )
                                                        ? user.profile_picture
                                                        : `${API_URL ?? ""}${user.profile_picture.startsWith(
                                                            "/"
                                                        )
                                                            ? ""
                                                            : "/"
                                                        }${user.profile_picture}`
                                                }
                                                alt=""
                                                className="h-10 w-10 rounded-full border border-white/20 object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E4F1E4] text-sm font-bold uppercase text-[#166534]">
                                                {user.username.charAt(0) || "U"}
                                            </span>
                                        )}

                                        <div className="min-w-0">
                                            <p className="text-xs text-emerald-50/60">
                                                Signed in as
                                            </p>
                                            <p className="truncate text-sm font-semibold text-white">
                                                {user.username}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <ul className="mt-5 space-y-4">
                                    {accountLinks.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="text-sm text-emerald-50/70 transition hover:text-white"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col gap-4 pt-6 text-xs text-emerald-50/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 ShareHope. All rights reserved.</p>

                    <div className="flex flex-wrap gap-5">
                        <Link
                            href="/privacy"
                            className="transition hover:text-white"
                        >
                            Privacy policy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition hover:text-white"
                        >
                            Terms of use
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
