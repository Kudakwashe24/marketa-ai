import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-violet-200 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[280px] w-[280px] rounded-full bg-cyan-200 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
            AI marketing for real businesses
          </p>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Create campaigns and marketing posters in{" "}
            <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              seconds
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Marketa AI helps businesses generate social media captions,
            WhatsApp promotions, ad copy, daily marketing ideas, campaign
            templates, and promotional posters from one simple prompt.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-slate-900 px-6 py-3 text-center font-medium text-white shadow-lg shadow-slate-300 transition hover:bg-slate-700"
            >
              Start Free
            </Link>

            <a
              href="#pricing"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-medium text-slate-800 transition hover:bg-slate-50"
            >
              View Pricing
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
              Social captions
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
              WhatsApp promos
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
              Ad copy
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
              Daily ideas
            </span>
            <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-700 shadow-sm">
              Posters
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Example campaign
            </p>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Growth Plan
            </span>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-slate-800">
            <p className="text-sm font-medium text-slate-500">Business Type</p>
            <p className="mt-1 font-medium">Restaurant / Food Business</p>

            <p className="mt-4 text-sm font-medium text-slate-500">
              Promotion Request
            </p>
            <p className="mt-1 font-medium">
              Promote my weekend burger special and free drink combo.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
              <h3 className="font-semibold text-slate-900">
                Social Media Caption
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Weekend burger deal is here 🍔 Grab our special combo with a
                FREE drink and enjoy bold flavour this weekend.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4">
              <h3 className="font-semibold text-slate-900">
                Daily Marketing Idea
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Post a short behind-the-scenes burger prep video and end with a
                limited-time weekend call to action.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-900">
                Promo Poster Ready
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Turn the campaign into a ready-to-post square social media
                poster in one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}