import Link from "next/link";
import {
  normalizePlanKey,
  PLAN_CONFIGS,
  PLAN_MONTHLY_PRICES,
} from "@/lib/plans";

type BillingPageProps = {
  searchParams: Promise<{ plan?: string }>;
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const { plan: requestedPlan } = await searchParams;
  const plan = normalizePlanKey(requestedPlan);
  const selectedPlan = PLAN_CONFIGS[plan];
  const selectedPrice = PLAN_MONTHLY_PRICES[plan];
  const campaignLimit =
    selectedPlan.campaignLimit === -1
      ? "Unlimited campaigns"
      : `${selectedPlan.campaignLimit} campaigns / month`;
  const posterLimit =
    selectedPlan.posterLimit === -1
      ? "Unlimited posters"
      : `${selectedPlan.posterLimit} posters / month`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 ai-grid opacity-40" />
      <div className="pointer-events-none absolute top-[-18rem] h-[36rem] w-[36rem] rounded-full bg-cyan-600/20 blur-[130px]" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b1019]/95 p-6 shadow-2xl shadow-black/40 sm:p-10">
        <p className="text-sm font-semibold text-cyan-300">Plan selection</p>
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {selectedPlan.name}
            </h1>
            <p className="mt-2 text-slate-400">
              {campaignLimit} · {posterLimit}
            </p>
          </div>
          <p className="text-3xl font-semibold">
            ${selectedPrice}
            <span className="text-sm font-normal text-slate-500"> / month</span>
          </p>
        </div>

        {plan === "free" ? (
          <div className="mt-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.055] p-5 text-sm leading-6 text-slate-300">
            Free is active automatically. No card is required.
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.055] p-5">
            <h2 className="font-semibold text-amber-100">
              Secure checkout is not live yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Marketa is still in founder beta. No payment has been taken and
              your account remains on Free until subscription checkout and
              payment webhooks are connected.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-400"
          >
            Continue to workspace
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
          >
            Compare plans
          </Link>
        </div>
      </section>
    </main>
  );
}
