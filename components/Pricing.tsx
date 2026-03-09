import Link from "next/link";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-4 text-slate-600">
          Start simple. Upgrade later as the product grows.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900">Starter Plan</h3>
          <p className="mt-3 text-5xl font-bold text-slate-900">
            $10<span className="text-lg font-medium text-slate-500">/month</span>
          </p>
          <div className="mt-8 space-y-3 text-slate-600">
            <p>Generate AI marketing campaigns</p>
            <p>Social captions, ad copy, and WhatsApp promos</p>
            <p>Marketing tips for every campaign</p>
          </div>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}