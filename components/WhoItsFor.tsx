export default function WhoItsFor() {
  const audiences = [
    "Salons and barbers",
    "Restaurants and food businesses",
    "Clothing boutiques",
    "Car dealers",
    "Freelancers",
    "Local service businesses",
  ];

  return (
    <section id="who-its-for" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Built for businesses that do their own marketing
          </h2>
          <p className="mt-4 text-slate-600">
            Marketa AI is made for business owners who need fast, professional
            content without hiring a marketing team.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {audiences.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center font-medium text-slate-800 shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}