export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Marketa AI Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Generate ready-to-use marketing campaigns for your business.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            What do you want to promote?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Example: Promote my restaurant weekend burger special.
          </p>

          <form className="mt-6 space-y-4">
            <textarea
              placeholder="Type what you want to promote here..."
              className="min-h-[160px] w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-slate-900"
            />

            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700"
            >
              Generate Campaign
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}