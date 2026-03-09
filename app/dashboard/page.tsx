"use client";

import { FormEvent, useState } from "react";

type CampaignResult = {
  socialCaption: string;
  whatsappPromo: string;
  adCopy: string;
  marketingTip: string;
};

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerateCampaign = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      setResult({
        socialCaption: `🔥 ${prompt} Don’t miss out. Visit us today and take advantage of this amazing offer while it lasts.`,
        whatsappPromo: `Hi everyone 👋 ${prompt} We’re running this promotion for a limited time. Message us now to book or place your order.`,
        adCopy: `${prompt} Get quality service and great value today. Limited-time offer available now.`,
        marketingTip:
          "Use a real customer photo or product photo with this campaign to increase trust and improve engagement.",
      });

      setIsGenerating(false);
      setCopiedField(null);
    }, 1200);
  };

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);

      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Marketa AI Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Generate ready-to-use marketing campaigns for your business.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            What do you want to promote?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Example: Promote my restaurant weekend burger special.
          </p>

          <form onSubmit={handleGenerateCampaign} className="mt-6 space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type what you want to promote here..."
              className="min-h-[160px] w-full rounded-2xl border border-slate-300 px-4 py-4 outline-none focus:border-slate-900"
            />

            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate Campaign"}
            </button>
          </form>
        </div>

        {result && (
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <ResultCard
              title="Social Media Caption"
              content={result.socialCaption}
              onCopy={() => handleCopy("socialCaption", result.socialCaption)}
              copied={copiedField === "socialCaption"}
            />

            <ResultCard
              title="WhatsApp Promotion"
              content={result.whatsappPromo}
              onCopy={() => handleCopy("whatsappPromo", result.whatsappPromo)}
              copied={copiedField === "whatsappPromo"}
            />

            <ResultCard
              title="Ad Copy"
              content={result.adCopy}
              onCopy={() => handleCopy("adCopy", result.adCopy)}
              copied={copiedField === "adCopy"}
            />

            <ResultCard
              title="Marketing Tip"
              content={result.marketingTip}
              onCopy={() => handleCopy("marketingTip", result.marketingTip)}
              copied={copiedField === "marketingTip"}
            />
          </section>
        )}
      </div>
    </main>
  );
}

type ResultCardProps = {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
};

function ResultCard({ title, content, onCopy, copied }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <button
          onClick={onCopy}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-slate-600">{content}</p>
    </div>
  );
}