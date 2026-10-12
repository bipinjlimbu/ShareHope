"use client";

import { useState } from "react";
import { logoutUser } from "@/services/authService";

interface LogoutButtonProps {
    className?: string;
    onLoggedOut?: () => void;
}

export default function LogoutButton({
    className = "",
    onLoggedOut,
}: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            await logoutUser();

            localStorage.removeItem("user");
            window.dispatchEvent(new Event("auth-change"));
            onLoggedOut?.();
            window.location.assign("/");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to log out. Please try again.";

            window.alert(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
        >
            {loading ? "Logging out..." : "Log out"}
        </button>
    );
}