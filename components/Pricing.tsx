import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Explore Marketa and create your first branded campaigns.",
    usage: "5 campaigns · 3 posters",
    features: ["Core campaign copy", "Image context", "Basic history", "Watermarked posters"],
    buttonText: "Start free",
  },
  {
    name: "Starter",
    price: "$9",
    description: "For small businesses marketing consistently each week.",
    usage: "30 campaigns · 20 posters",
    features: ["Everything in Free", "Campaign templates", "Searchable history", "No poster watermark"],
    buttonText: "Choose Starter",
  },
  {
    name: "Growth",
    price: "$19",
    description: "For active businesses running frequent promotions.",
    usage: "200 campaigns · 100 posters",
    features: ["Everything in Starter", "Personalized daily ideas", "Advanced history tools", "Priority creative capacity"],
    buttonText: "Choose Growth",
    featured: true,
  },
  {
    name: "Pro",
    price: "$39",
    description: "For agencies and teams producing at high volume.",
    usage: "Unlimited campaigns & posters",
    features: ["Everything in Growth", "Unlimited generation", "Full brand toolkit", "Built for heavy usage"],
    buttonText: "Choose Pro",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-white/5 bg-[#070a10] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-block rounded-full border border-cyan-300/15 bg-cyan-400/5 px-3 py-1 text-sm font-medium text-cyan-200">
            Plans
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Start free. Scale when your marketing does.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Every plan includes brand-aware campaign copy. Upgrade for more
            creative capacity, posters and history tools.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`group relative flex min-h-[32rem] flex-col p-6 transition duration-300 hover:bg-[#111a26] sm:p-7 ${
                plan.featured
                  ? "bg-gradient-to-b from-[#102b46] via-[#0c1a28] to-[#0b1019]"
                  : "bg-[#0b1019]"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-3 py-1 text-[11px] font-semibold text-white">
                  Most popular
                </span>
              ) : null}

              <p className="text-lg font-semibold text-white">{plan.name}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-semibold tracking-tight text-white">{plan.price}</span>
                <span className="pb-1.5 text-sm text-slate-500">/ month</span>
              </div>
              <p className="mt-5 min-h-12 text-sm leading-6 text-slate-400">{plan.description}</p>

              <div className="mt-6 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] px-3 py-3 text-sm font-medium text-cyan-100">
                {plan.usage}
              </div>

              <ul className="mt-7 flex-1 space-y-3 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <span className="text-cyan-300">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition group-hover:scale-[1.015] ${
                  plan.featured
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-950/40 hover:from-blue-500 hover:to-cyan-400"
                    : "border border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/25 hover:bg-cyan-300/[0.06]"
                }`}
              >
                {plan.buttonText}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          Monthly usage resets automatically. Start free and upgrade when you need more capacity.
        </p>
      </div>
    </section>
  );
}
