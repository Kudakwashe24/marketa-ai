import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type AuthFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthFrame({
  eyebrow,
  title,
  description,
  children,
}: AuthFrameProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07080d] px-3 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute inset-0 ai-grid opacity-40" />
      <div className="pointer-events-none absolute top-[-18rem] h-[36rem] w-[36rem] rounded-full bg-cyan-600/20 blur-[130px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-xl px-2 py-1 text-white transition hover:bg-white/5"
          >
            <BrandLogo size="medium" />
            <span className="text-lg font-semibold">Marketa AI</span>
          </Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-slate-300 hover:text-cyan-200">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-300 hover:text-cyan-200">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
