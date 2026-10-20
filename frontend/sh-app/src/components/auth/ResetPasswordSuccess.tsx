import type { ResetPasswordSuccessProps } from "@/types/auth";

export default function ResetPasswordSuccess({
    onContinue,
}: ResetPasswordSuccessProps) {
    return (
        <section className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-xl shadow-emerald-950/5 sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                >
                    <path
                        d="m5 12 4 4L19 6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Password reset successful
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
                Your password has been updated. You can now sign in using
                your new password.
            </p>

            <button
                type="button"
                onClick={onContinue}
                className="mt-8 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
                Continue to login
            </button>

            <p className="mt-4 text-xs text-slate-500">
                Your account security matters to us.
            </p>
        </section>
    );
}