import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 px-8 py-16 text-white shadow-2xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
            Ready to grow?
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Start free, then unlock more as your business grows
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Create campaigns, use templates, generate posters, save your
            history, and upgrade when you’re ready for more marketing power.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
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