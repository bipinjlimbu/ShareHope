import type { ForgotPasswordSuccessProps } from "@/types/auth";

export default function ForgotPasswordSuccess({
    email,
    onContinue,
}: ForgotPasswordSuccessProps) {
    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8 text-green-700"
                    aria-hidden="true"
                >
                    <path
                        d="M5 12.5L9.5 17L19 7.5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Check your email
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                If the request was accepted, your password-reset OTP has
                been sent to:
            </p>

            <p className="mt-2 break-all font-semibold text-green-800">
                {email}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
                The OTP expires in 10 minutes. Check your inbox and spam
                folder before continuing.
            </p>

            <button
                type="button"
                onClick={handleContinue}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
                Continue to reset password
            </button>
        </div>
    );
}