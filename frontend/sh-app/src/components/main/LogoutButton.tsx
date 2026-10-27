"use client";

import { useState } from "react";
import { logoutUser } from "@/services/authService";
import ConfirmationModal from "@/components/common/ConfirmationModal";

interface LogoutButtonProps {
    className?: string;
    onLoggedOut?: () => void;
}

export default function LogoutButton({
    className = "",
    onLoggedOut,
}: LogoutButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
            setIsConfirmOpen(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                disabled={loading}
                className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
            >
                {loading ? "Logging out..." : "Log out"}
            </button>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Log out of ShareHope?"
                description="Are you sure you want to log out of your account?"
                confirmText="Log out"
                isDeleting={loading}
                buttonColor="bg-[#166534]"
                buttonHoverColor="hover:bg-[#14532D]"
                iconBackgroundColor="bg-[#E5F2E1]"
                iconColor="text-[#166534]"
                onConfirm={() => void handleLogout()}
                onCancel={() => {
                    if (!loading) {
                        setIsConfirmOpen(false);
                    }
                }}
            />
        </>
    );
}