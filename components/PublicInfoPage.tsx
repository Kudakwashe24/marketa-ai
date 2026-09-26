import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PublicInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  children: React.ReactNode;
};

export default function PublicInfoPage({
  eyebrow,
  title,
  description,
  updated,
  children,
}: PublicInfoPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-30" />
      <Navbar />

      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <header className="border-b border-white/10 pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
            {description}
          </p>
          {updated ? (
            <p className="mt-4 text-xs text-slate-600">Last updated: {updated}</p>
          ) : null}
        </header>

        <article className="public-info-content py-10">{children}</article>
      </div>

      <Footer />
    </main>
  );
}

type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
