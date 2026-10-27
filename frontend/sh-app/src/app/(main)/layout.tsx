"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";
import { ToastProvider } from "@/components/toast/ToastProvider";

export default function MainLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen flex-col bg-[#FFFCF6]">
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
            </div>
        </ToastProvider>
    );
}
