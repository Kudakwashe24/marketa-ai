import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Best for trying Marketa AI and testing the core experience.",
    highlight: "5 campaigns / month",
    featured: false,
    features: [
      "Social media captions",
      "WhatsApp promotions",
      "Ad copy",
      "Marketing tips",
      "Daily marketing ideas",
      "Basic campaign history",
    ],
    limitations: [
      "No poster generation",
      "No templates",
      "No advanced history tools",
    ],
    buttonText: "Start Free",
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "Great for small businesses posting regularly every week.",
    highlight: "30 campaigns / month",
    featured: false,
    features: [
      "10 posters / month",
      "Business-type templates",
      "Search campaign history",
      "Delete campaign history",
      "Poster generation",
      "Daily marketing ideas",
    ],
    limitations: [],
    buttonText: "Choose Starter",
  },
  {
    name: "Growth",
    price: "$19",
    period: "/mo",
    description: "Perfect for businesses actively running promotions.",
    highlight: "200 campaigns / month",
    featured: true,
    badge: "Best Value",
    features: [
      "100 posters / month",
      "Business-type templates",
      "Advanced history tools",
      "Search and delete history",
      "Poster generation",
      "Personalized daily ideas",
    ],
    limitations: [],
    buttonText: "Choose Growth",
  },
  {
    name: "Pro",
    price: "$39",
    period: "/mo",
    description: "Best for agencies, power users, and heavy marketing usage.",
    highlight: "Unlimited campaigns",
    featured: false,
    features: [
      "Unlimited posters",
      "Business-type templates",
      "Advanced history tools",
      "Search and delete history",
      "Poster generation",
      "Personalized daily ideas",
    ],
    limitations: [],
    buttonText: "Choose Pro",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="inline-block rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
            Pricing
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Simple plans for different stages of growth
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Start free, then unlock more campaigns, posters, templates, and
            advanced tools as your business grows.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col rounded-3xl border p-8 shadow-sm ${
                plan.featured
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
                  {plan.badge}
                </div>
              )}

              <div>
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
                  className={`mt-4 text-sm leading-6 ${
                    plan.featured ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <div
                  className={`mt-6 rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
                    plan.featured
                      ? "bg-white text-slate-900"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {plan.highlight}
                </div>
              </div>

              <div className="mt-8 flex-1">
                <p
                  className={`text-sm font-semibold ${
                    plan.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  Included
                </p>

                <ul
                  className={`mt-4 space-y-3 text-sm ${
                    plan.featured ? "text-slate-200" : "text-slate-600"
                  }`}
                >
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <>
                    <p
                      className={`mt-8 text-sm font-semibold ${
                        plan.featured ? "text-white" : "text-slate-900"
                      }`}
                    >
                      Not included
                    </p>

                    <ul
                      className={`mt-4 space-y-3 text-sm ${
                        plan.featured ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {plan.limitations.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span>—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <Link
                href="/signup"
                className={`mt-8 inline-block w-full rounded-xl px-6 py-3 text-center font-medium ${
                  plan.featured
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}