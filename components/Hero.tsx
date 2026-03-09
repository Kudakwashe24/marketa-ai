import Link from "next/link";

export default function Hero() {
    return (
        <section className="bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
                <div>
                    <p className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        AI marketing made simple
                    </p>

                    <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
                        Create ready-to-post marketing campaigns in seconds
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                        Marketa AI helps businesses generate social media captions,
                        WhatsApp promos, ad copy, and useful marketing tips from one simple
                        prompt.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/signup"
                            className="rounded-xl bg-slate-900 px-6 py-3 text-center font-medium text-white hover:bg-slate-700"
                            >
                            Start Free
                        </Link>
                        <a
                            href="#example-output"
                            className="rounded-xl border border-slate-300 px-6 py-3 text-center font-medium text-slate-800 hover:bg-slate-50"
                            >
                            See Example
                        </a>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="mb-3 text-sm font-medium text-slate-500">Example prompt</p>
                        <div className="rounded-xl bg-slate-50 p-4 text-slate-800">
                            Promote my salon weekend braids special.
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="rounded-xl border border-slate-200 p-4">
                                <h3 className="font-semibold">Instagram Caption</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Weekend braids special now available. Book your spot today and
                                    look amazing this weekend.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <h3 className="font-semibold">WhatsApp Promo</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Hi ladies, we have a weekend braids special running now. Limited
                                    spaces available. Message us to book.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <h3 className="font-semibold">Marketing Tip</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Add before-and-after photos to increase trust and bookings.
                                </p>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    );
}