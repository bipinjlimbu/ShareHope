import type { ResetPasswordFailedProps } from "@/types/auth";

export default function ResetPasswordFailed({
    message,
    onRetry,
}: ResetPasswordFailedProps) {
    return (
        <section className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 text-center shadow-xl shadow-slate-950/5 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                >
                    <path
                        d="M12 8v5m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Password reset failed
            </h1>

            <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                className="mt-8 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
                Try again
            </button>

            <p className="mt-4 text-sm text-slate-500">
                If your reset link or verification session has expired, request a new OTP.
            </p>
        </section>
    );
}