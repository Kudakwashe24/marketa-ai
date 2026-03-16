export default function ExampleOutput() {
  return (
    <section id="example-output" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          What Marketa AI creates for you
        </h2>
        <p className="mt-4 text-slate-600">
          One promotion request turns into a complete mini marketing system.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Prompt</p>
          <p className="mt-2 text-slate-800">
            Business Type: Salon / Barber
            <br />
            Promotion: Promote my weekend braids special.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">
              Social Media Caption
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Weekend braids special now available ✨ Book your slot today and
              refresh your look before Saturday and Sunday fill up.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">
              WhatsApp Promotion
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Hi ladies 💜 We are running a weekend braids special. Limited
              spaces available. Message us now to secure your booking.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Ad Copy</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Book your weekend braids special today. Fresh styles, limited
              spaces, and beautiful results for your next look.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Marketing Tip</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Post a before-and-after client transformation to increase trust
              and drive weekend bookings.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 md:col-span-2">
            <h3 className="font-semibold text-slate-900">
              Daily Marketing Idea
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Share a quick client reaction video after their hairstyle is done
              and invite followers to book this weekend.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}