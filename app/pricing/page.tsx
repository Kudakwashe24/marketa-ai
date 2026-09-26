import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare Marketa AI plans for campaigns, brand-aware copy, history, and static branded posters.",
  alternates: { canonical: "/pricing" },
};

const answers = [
  {
    question: "What does Marketa generate today?",
    answer:
      "Ready-to-use social captions, WhatsApp promotions, ad copy, marketing guidance, and downloadable static branded posters.",
  },
  {
    question: "Does Marketa create photorealistic AI images?",
    answer:
      "Not yet. Posters currently use reliable templates with your logo, colours, contact details, and uploaded business photos.",
  },
  {
    question: "Will I be charged when I select a paid plan?",
    answer:
      "No—not during founder beta. Your choice follows you through signup, but your account remains on Free until secure checkout is activated.",
  },
  {
    question: "What does unlimited mean on Pro?",
    answer:
      "Pro has no monthly in-app campaign or poster counter during beta. Reasonable abuse and infrastructure protections still apply.",
  },
];

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-30" />
      <Navbar />
      <div className="relative">
        <Pricing />

        <section className="border-b border-white/5 bg-[#090a10] px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8">
            <p className="text-sm font-medium text-cyan-300">Know before you choose</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Straight answers about plans and output
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
              {answers.map((item) => (
                <article key={item.question} className="bg-[#0b1019] p-5 sm:p-6">
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>

            <Link
              href="/signup?plan=free"
              className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400"
            >
              Start with Free →
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
