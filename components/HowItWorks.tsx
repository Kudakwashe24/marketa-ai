export default function HowItWorks() {
    const steps = [
        {
            title: "Describe your offer",
            text: "Type what you want to promote in simple words.",
        },
        {
            title: "Generate campaign",
            text: "Marketa AI creates your marketing content instantly.",
        },
        {
            title: "Copy and post",
            text: "Use the results on Instagram, Facebook, WhatsApp, or ads.",
        },
    ];

    return (
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    How it works
                </h2>
                <p className="mt-4 text-slate-600">
                    Simple enough for any business owner to use.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step, index) => (
                    <div
                        key={step.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                            {index + 1}
                        </div>
                            <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                            <p className="mt-3 text-slate-600">{step.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}