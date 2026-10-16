export default function VerifyEmailSkeleton() {
    return (
        <main className="flex min-h-[75vh] animate-pulse items-center justify-center bg-[#FFFCF6] px-5 py-12">
            <div className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-7 shadow-sm sm:p-9">
                <div className="mx-auto h-16 w-16 rounded-2xl bg-[#E4F1E4]" />

                <div className="mx-auto mt-6 h-7 w-56 max-w-full rounded-lg bg-[#DDE7DC]" />
                <div className="mx-auto mt-3 h-4 w-72 max-w-full rounded bg-[#EDF2E9]" />
                <div className="mx-auto mt-2 h-4 w-60 max-w-full rounded bg-[#EDF2E9]" />

                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 w-10 rounded-xl border border-[#E6EDE4] bg-[#F7F9F4] sm:h-14 sm:w-12"
                        />
                    ))}
                </div>

                <div className="mt-7 h-12 rounded-xl bg-[#DDE7DC]" />
                <div className="mx-auto mt-6 h-4 w-56 max-w-full rounded bg-[#EDF2E9]" />
                <div className="mx-auto mt-8 h-4 w-32 rounded bg-[#EDF2E9]" />
            </div>
        </main>
    );
}