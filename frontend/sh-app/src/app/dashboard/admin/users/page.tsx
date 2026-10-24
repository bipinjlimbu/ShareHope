"use client";

import { useEffect } from "react";
import { getUsers } from "@/services/userService";

export default function AdminUsersTestPage() {
    useEffect(() => {
        async function testGetUsers() {
            try {
                const users = await getUsers();

                console.log("Users API response:", users);
                console.table(users);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }

        void testGetUsers();
    }, []);

    return (
        <main className="min-h-screen bg-[#FFFCF6] px-6 py-12">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold text-[#183B2A]">
                    Users API Test
                </h1>

                <p className="mt-2 text-sm text-[#647568]">
                    Open your browser developer tools and select the Console
                    tab to inspect the users returned by the API.
                </p>
            </div>
        </main>
    );
}