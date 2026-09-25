import Link from "next/link";
import AnimatedCampaignDemo from "@/components/AnimatedCampaignDemo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="pointer-events-none absolute left-1/2 top-[-24rem] h-[52rem] w-[52rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-14rem] right-[-8rem] h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-14 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
            <span className="ai-pulse h-2 w-2 rounded-full bg-cyan-400" />
            Your AI marketing brain
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl md:text-7xl">
            Turn one thought into a{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
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
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-center font-semibold text-white shadow-xl shadow-blue-950/40 transition hover:scale-[1.02] hover:from-blue-500 hover:to-cyan-400"
            >
              Enter Marketa AI →
            </Link>
            <a
              href="#pricing"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-center font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
            >
              View plans
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>✦ Brand-aware</span>
            <span>✦ Image context</span>
            <span>✦ Ready-to-use copy</span>
          </div>
        </div>

        <AnimatedCampaignDemo />
      </div>
    </section>
  );
}
