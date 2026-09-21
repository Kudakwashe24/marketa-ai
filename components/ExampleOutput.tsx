export default function ExampleOutput() {
  return (
    <section id="example-output" className="border-b border-white/5 bg-[#090a10] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="inline-block rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
            Example output
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            One idea becomes a full campaign
          </h2>

          <p className="mt-4 max-w-2xl text-slate-400">
            Marketa AI turns one simple request into content you can actually
            use across different channels.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#10121a] p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 ml-auto max-w-2xl rounded-2xl rounded-br-md bg-violet-600 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-violet-200">Your prompt</p>
            <p className="mt-2 text-white">
              Business Type: Salon / Barber
              <br />
              Promotion: Promote my weekend braids special.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">
                📱 Social Media Caption
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Weekend braids special now available ✨ Book your slot today and
                refresh your look before Saturday and Sunday fill up.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">
                💬 WhatsApp Promotion
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Hi ladies 💜 We are running a weekend braids special. Limited
                spaces available. Message us now to secure your booking.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">🚀 Ad Copy</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Book your weekend braids special today. Fresh styles, limited
                spaces, and beautiful results for your next look.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h3 className="font-semibold text-white">💡 Marketing Tip</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Share the campaign on your social feed and WhatsApp Status,
                then follow up quickly with anyone who asks about availability.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/[0.07] p-5 md:col-span-2">
              <h3 className="font-semibold text-white">
                🎨 Optional Branded Poster
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                Turn the approved campaign into a static poster using your logo,
                brand colours and selected business image.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
