export default function HowItWorks() {
  const steps = [
    {
      title: "Build your Brand Kit",
      text: "Tell Marketa about your business once, then add your logo, colours and reusable business images.",
    },
    {
      title: "Chat with Marketa",
      text: "Describe what you want to promote and optionally attach the exact product or service image you want to use.",
    },
    {
      title: "Choose what to publish",
      text: "Copy the channel-ready content, then create a branded static poster only when you need one.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-b border-white/5 bg-[#090a10] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="inline-block rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-5xl">
            From thought to campaign in one flow
          </h2>
          <p className="mt-4 text-slate-400">
            Built for business owners who want fast, useful marketing content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 transition hover:-translate-y-1 hover:border-violet-400/30"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 font-bold text-white shadow-lg shadow-violet-950/40">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-400">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
