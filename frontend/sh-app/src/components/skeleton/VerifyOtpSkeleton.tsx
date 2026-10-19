import FooterLogo from "@/images/FooterLogo.png";
import Image from "next/image";

export default function VerifyOtpSkeleton() {
    return (
        <main className="flex min-h-screen animate-pulse items-center justify-center bg-white px-4 py-12 text-slate-900">
            <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
                <section className="flex flex-col justify-between bg-green-700 p-8 sm:p-12">
                    <div>
                        <Image
                            src={FooterLogo}
                            alt="ShareHope"
                            priority
                            className="h-auto w-[150px] object-contain sm:w-[170px]"
                        />
                    </div>

                    <div className="my-12">
                        <div className="h-9 w-4/5 rounded-lg bg-green-600 sm:h-11" />
                        <div className="mt-5 h-4 w-full max-w-sm rounded bg-green-600" />
                        <div className="mt-3 h-4 w-5/6 max-w-sm rounded bg-green-600" />
                    </div>

                    <div className="h-4 w-4/5 rounded bg-green-600" />
                </section>

                <section className="p-6 sm:p-10 md:p-12">
                    <div className="h-4 w-36 rounded bg-green-100" />
                    <div className="mt-3 h-9 w-3/4 rounded-lg bg-slate-200" />
                    <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-green-100" />

                    <div className="mt-8">
                        <div className="mb-2 h-4 w-36 rounded bg-slate-200" />
                        <div className="h-14 w-full rounded-xl bg-slate-100" />
                        <div className="mt-2 h-3 w-44 rounded bg-slate-100" />
                    </div>

                    <div className="mt-5 h-12 w-full rounded-xl bg-green-100" />

                    <div className="mx-auto mt-6 h-4 w-56 max-w-full rounded bg-slate-100" />
                    <div className="mx-auto mt-5 h-4 w-40 max-w-full rounded bg-slate-100" />
                    <div className="mt-8 flex justify-center">
                        <div className="h-4 w-64 max-w-full rounded bg-slate-100" />
                    </div>
                </section>
            </div>
        </main>
    );
}