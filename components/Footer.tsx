import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#07080d] py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm text-slate-500 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex items-center gap-3 text-left">
          <BrandLogo />
          <div>
            <p className="font-medium text-white">Marketa AI</p>
            <p className="mt-1">AI marketing for growing businesses.</p>
          </div>
        </div>

        <div className="md:text-right">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"
          >
            <Link href="/pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="/support" className="transition hover:text-white">
              Support
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link
              href="/acceptable-use"
              className="transition hover:text-white"
            >
              Acceptable use
            </Link>
          </nav>
          <p className="mt-4">© {year} Marketa AI. All rights reserved.</p>
          <p className="mt-1">Campaign copy and static branded posters, faster.</p>
        </div>
      </div>
    </footer>
  );
}
