import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    campaigns: "5 campaigns/month",
    description: "Perfect for trying Marketa AI.",
    featured: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    campaigns: "30 campaigns/month",
    description: "Great for small businesses posting regularly.",
    featured: false,
  },
  {
    name: "Growth",
    price: "$19",
    period: "/mo",
    campaigns: "200 campaigns/month",
    description: "Best for businesses running lots of promotions.",
    featured: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/mo",
    campaigns: "Unlimited campaigns",
    description: "Built for agencies and power users.",
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-4 text-slate-600">
            Start free, upgrade when your business needs more campaigns.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 shadow-sm ${
                plan.featured
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <div className="mt-4 flex items-end gap-1">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span
                  className={`pb-1 text-sm ${
                    plan.featured ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className={`mt-4 ${
                  plan.featured ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {plan.description}
              </p>

              <div
                className={`mt-8 rounded-2xl px-4 py-3 text-center font-medium ${
                  plan.featured
                    ? "bg-white text-slate-900"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {plan.campaigns}
              </div>

              <ul
                className={`mt-8 space-y-3 text-sm ${
                  plan.featured ? "text-slate-200" : "text-slate-600"
                }`}
              >
                <li>AI social media captions</li>
                <li>WhatsApp promotions</li>
                <li>Ad copy generation</li>
                <li>Daily marketing ideas</li>
                <li>Campaign history</li>
                <li>Poster generation</li>
              </ul>

              <Link
                href="/signup"
                className={`mt-8 inline-block w-full rounded-xl px-6 py-3 text-center font-medium ${
                  plan.featured
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}