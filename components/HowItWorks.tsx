export default function HowItWorks() {
  const steps = [
    {
      title: "Choose your business type",
      text: "Select the kind of business you run so Marketa AI can tailor the campaign properly.",
    },
    {
      title: "Describe your promotion",
      text: "Type what you want to promote in simple words, just like you would explain it to a person.",
    },
    {
      title: "Generate and post",
      text: "Get captions, WhatsApp promos, ad copy, ideas, and even a poster depending on your plan.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="inline-block rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Marketing help in 3 simple steps
          </h2>
          <p className="mt-4 text-slate-600">
            Built for business owners who want fast, useful marketing content.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 font-bold text-white shadow-md">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}