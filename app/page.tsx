import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhoItsFor from "@/components/WhoItsFor";
import ExampleOutput from "@/components/ExampleOutput";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-40" />
      <Navbar />
      <div className="relative">
        <Hero />
        <HowItWorks />
        <WhoItsFor />
        <ExampleOutput />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
