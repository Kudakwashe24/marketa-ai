export default function ExampleOutput() {
  return (
    <section id="example-output" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
          Example campaign output
        </h2>
        <p className="mt-4 text-slate-600">
          One prompt turns into a full campaign.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-500">Prompt</p>
          <p className="mt-2 text-slate-800">
            Promote my restaurant weekend burger special.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Social Media Caption</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Make your weekend delicious with our burger special. Bring your
              friends and enjoy great taste at a great price.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">WhatsApp Promotion</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Weekend burger special now available. Come through with friends or
              family and enjoy an amazing meal. Visit us today.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Ad Copy</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Craving a great burger this weekend? Visit us for our special
              offer and enjoy bold flavor at a great price.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">Marketing Tip</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Post a short burger preparation video on Instagram Stories to
              create urgency and increase foot traffic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}