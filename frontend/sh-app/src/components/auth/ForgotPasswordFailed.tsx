import type { ForgotPasswordFailedProps } from "@/types/auth";

export default function ForgotPasswordFailed({
    message,
    onRetry,
}: ForgotPasswordFailedProps) {
    return (
        <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8"
        >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8 text-red-700"
                    aria-hidden="true"
                >
                    <path
                        d="M8 8L16 16M16 8L8 16"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Unable to send OTP
            </h2>

            <p className="mt-3 text-sm leading-6 text-red-800">
                {message}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
                Check the email address and your connection, then try again.
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
                Try again
            </button>
        </div>
    );
}