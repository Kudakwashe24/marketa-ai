"use client";

import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
import BrandLogo from "@/components/BrandLogo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07080d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-base font-semibold text-white sm:text-lg">
          <BrandLogo />
          Marketa AI
        </Link>

        <nav className="hidden gap-6 text-sm text-slate-400 md:flex">
          <a href="#who-its-for" className="hover:text-white">
            Built for business
          </a>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-3">
          <Show when="signed-out">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-xs font-medium text-white hover:from-blue-500 hover:to-cyan-400 sm:px-4 sm:text-sm"
            >
              Get Started
            </Link>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white sm:px-4 sm:text-sm"
            >
              Dashboard
            </Link>

            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
