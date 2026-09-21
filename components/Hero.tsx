import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="pointer-events-none absolute left-1/2 top-[-24rem] h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-14rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
            <span className="ai-pulse h-2 w-2 rounded-full bg-violet-400" />
            Your AI marketing brain
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl md:text-7xl">
            Turn one thought into a{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              complete campaign.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Tell Marketa what you want to promote. Get a social caption,
            WhatsApp message, ad copy, marketing guidance and an optional
            branded poster—built around your business and uploaded images.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-3.5 text-center font-semibold text-slate-950 shadow-xl shadow-violet-950/30 transition hover:bg-violet-100"
            >
              Enter Marketa AI →
            </Link>
            <a
              href="#example-output"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-center font-medium text-slate-300 transition hover:border-violet-400/30 hover:text-white"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>✦ Brand-aware</span>
            <span>✦ Image context</span>
            <span>✦ Ready-to-use copy</span>
          </div>
        </div>

        <div className="ai-float relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-violet-500/15 to-cyan-400/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#10121a]/90 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">✦</span>
                <div>
                  <p className="text-sm font-medium text-white">Marketa AI</p>
                  <p className="text-xs text-emerald-400">● Ready</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-500 sm:px-3 sm:text-xs">Brand mode</span>
            </div>

            <div className="space-y-5 py-6">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-violet-600 px-4 py-3 text-sm leading-6 text-white">
                Promote our weekend burger combo with a free drink.
              </div>
              <div className="flex gap-2 sm:gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-sm text-violet-300">✦</span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.035] p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Campaign ready ✨</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 p-3">
                      <p className="text-xs font-medium text-white">📱 Social caption</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">Weekend plans sorted 🍔 Grab the combo and enjoy a free drink...</p>
                    </div>
                    <div className="rounded-xl border border-white/10 p-3">
                      <p className="text-xs font-medium text-white">💬 WhatsApp promo</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">Hi 👋 Our weekend burger combo is ready...</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full rounded-xl bg-white/5 px-3 py-2 text-center text-xs font-medium text-violet-200">
                    Create branded poster
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="px-2 pb-4 text-sm text-slate-600">Ask Marketa to build your campaign...</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400">+</span>
                <span className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white">Generate ↑</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
