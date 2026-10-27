"use client";

type EmailVerificationSuccessProps = {
    message?: string;
};

export default function EmailVerificationSuccess({
    message = "Your email has been verified successfully.",
}: EmailVerificationSuccessProps) {
    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-[#FFFCF6] px-5 py-12 sm:px-8">
            <section
                role="status"
                className="w-full max-w-md rounded-3xl border border-[#E6EDE4] bg-white p-8 text-center shadow-sm sm:p-10"
            >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#E4F1E4]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-11 w-11 text-[#166534]"
                        aria-hidden="true"
                    >
                        <path
                            d="m5 12.5 4.5 4.5L19 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className="mt-6 text-sm font-semibold text-[#35A45C]">
                    Email verification
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#14532D] sm:text-3xl">
                    Email verified!
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#718174]">
                    {message}
                </p>

                <div className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-[#31523C]">
                    <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-25"
                        />
                        <path
                            d="M21 12a9 9 0 0 0-9-9"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                    Redirecting to your profile...
                </div>
            </section>
        </main>
    );
}