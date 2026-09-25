import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-[#090a10] px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-r from-[#0b111b] via-blue-950 to-[#09131b] px-5 py-12 text-white shadow-2xl shadow-black/40 sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="relative inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
            Ready to grow?
          </p>

          <h2 className="relative mt-4 text-3xl font-semibold md:text-5xl">
            Your next campaign starts with one sentence
          </h2>

          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Build brand-aware copy, reuse your best prompts and create optional
            static posters from the same AI conversation.
          </p>

          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Start Free
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
