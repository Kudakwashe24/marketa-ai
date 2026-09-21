export default function WhoItsFor() {
  const audiences = [
    "Salons and barbers",
    "Restaurants and food businesses",
    "Clothing boutiques",
    "Freelancers and creators",
    "Car dealerships",
    "Home and local services",
    "Massage and wellness brands",
    "Small businesses doing their own marketing",
  ];

  return (
    <section
      id="who-its-for"
      className="border-b border-white/5 bg-[#07080d] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-12">
          <p className="inline-block rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
            Who it&apos;s for
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            Built for businesses that do their own marketing
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-400">
            Marketa AI is for business owners who need fast, professional
            marketing content without hiring a full marketing team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {audiences.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center font-medium text-slate-300 backdrop-blur transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.05] hover:text-white"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
