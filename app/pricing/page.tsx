import Link from "next/link";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-30" />
      <Navbar />
      <div className="relative">
        <Pricing />

        <section className="border-b border-white/5 bg-[#090a10] px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8">
            <p className="text-sm font-medium text-cyan-300">Choose confidently</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Every plan is built around features that exist today
            </h2>
            <div className="mt-7 grid gap-6 text-sm leading-6 text-slate-400 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <h3 className="font-semibold text-white">Free</h3>
                <p className="mt-2">
                  Test campaign generation, image context and three watermarked
                  branded posters each month.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Starter</h3>
                <p className="mt-2">
                  For weekly marketing with 30 campaigns, 20 posters, templates
                  and searchable history.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Growth</h3>
                <p className="mt-2">
                  For active businesses needing 200 campaigns, 100 posters and
                  personalized ideas.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Pro</h3>
                <p className="mt-2">
                  For agencies and heavy users needing unlimited campaign and
                  poster generation.
                </p>
              </div>
            </div>

            <Link
              href="/signup"
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
