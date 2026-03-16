export default function ExampleOutput() {
  return (
    <section id="example-output" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="inline-block rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
            Example output
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            One idea becomes a full campaign
          </h2>

          <p className="mt-4 max-w-2xl text-slate-600">
            Marketa AI turns one simple request into content you can actually
            use across different channels.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
          <div className="mb-8 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">Prompt</p>
            <p className="mt-2 text-slate-800">
              Business Type: Salon / Barber
              <br />
              Promotion: Promote my weekend braids special.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5">
              <h3 className="font-semibold text-slate-900">
                Social Media Caption
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Weekend braids special now available ✨ Book your slot today and
                refresh your look before Saturday and Sunday fill up.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5">
              <h3 className="font-semibold text-slate-900">
                WhatsApp Promotion
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Hi ladies 💜 We are running a weekend braids special. Limited
                spaces available. Message us now to secure your booking.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">Ad Copy</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Book your weekend braids special today. Fresh styles, limited
                spaces, and beautiful results for your next look.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">Marketing Tip</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Post a before-and-after client transformation to increase trust
                and drive weekend bookings.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 md:col-span-2">
              <h3 className="font-semibold text-slate-900">
                Daily Marketing Idea
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Share a quick client reaction video after their hairstyle is
                done and invite followers to book this weekend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}