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
      className="bg-gradient-to-br from-slate-50 to-violet-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="inline-block rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
            Who it&apos;s for
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Built for businesses that do their own marketing
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Marketa AI is for business owners who need fast, professional
            marketing content without hiring a full marketing team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {audiences.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/70 bg-white/80 p-5 text-center font-medium text-slate-800 shadow-sm backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}