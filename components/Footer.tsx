import Link from "next/link";

export default function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#07080d] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 text-sm text-slate-400 sm:px-6 md:flex-row">
        <p className="shrink-0 text-center md:text-left">
          © {year} Marketa AI. All rights reserved.
        </p>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-end"
        >
          <Link
            href="/pricing"
            className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Pricing
          </Link>
          <Link
            href="/support"
            className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Support
          </Link>
          <Link
            href="/privacy"
            className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Terms
          </Link>
          <Link
            href="/acceptable-use"
            className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Acceptable use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
