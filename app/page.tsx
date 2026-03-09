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
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhoItsFor />
      <ExampleOutput />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}