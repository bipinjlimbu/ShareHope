"use client";

export default function NGOStaffInvitationUsersListModalSkeleton() {
    return (
        <div className="space-y-3" aria-label="Loading donor accounts">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex animate-pulse items-center gap-3 rounded-2xl border border-[#E5EDE3] bg-white p-4 sm:gap-4"
                >
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-[#E8EFE4]" />

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-2/5 rounded-md bg-[#E8EFE4]" />

                        <div className="h-3 w-1/4 rounded-md bg-[#EDF2E9]" />

                        <div className="h-3 w-3/5 rounded-md bg-[#EDF2E9]" />

                        <div className="h-5 w-16 rounded-full bg-[#E8EFE4]" />
                    </div>

                    <div className="h-9 w-20 shrink-0 rounded-xl bg-[#EDF2E9]" />
                </div>
            ))}
        </div>
    );
}
