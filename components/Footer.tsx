export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080d] py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
        <div>
          <p className="font-medium text-white">Marketa AI</p>
          <p className="mt-1">AI marketing for growing businesses.</p>
        </div>

        <div className="text-center md:text-right">
          <p>©️ 2026 Marketa AI. All rights reserved.</p>
          <p className="mt-1">Campaign copy and static branded posters, faster.</p>
        </div>
      </div>
    </footer>
  );
}
