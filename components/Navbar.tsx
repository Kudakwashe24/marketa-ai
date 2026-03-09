import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-xl font-bold text-slate-900">
                    Marketa AI
                </Link>

                <nav className="hidden gap-6 md:flex text-sm text-slate-600">
                    <a href="#how-it-works" className="hover:text-slate-900">
                        How it works
                    </a>
                    <a href="#who-its-for" className="hover:text-slate-900">
                        Who it’s for
                    </a>
                    <a href="#pricing" className="hover:text-slate-900">
                        Pricing
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}