"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";

type CampaignResult = {
  socialCaption: string;
  whatsappPromo: string;
  adCopy: string;
  marketingTip: string;
};

type UsageData = {
  plan: string;
  planName: string;
  campaignUsageCount: number;
  campaignLimit: number;
  posterUsageCount: number;
  posterLimit: number;
  templatesEnabled: boolean;
  advancedHistoryEnabled: boolean;
};

type CampaignHistoryItem = {
  id: number;
  prompt: string;
  social_caption: string;
  whatsapp_promo: string;
  ad_copy: string;
  marketing_tip: string;
  created_at: string;
};

type DailyIdea = {
  title: string;
  idea: string;
};

type ResultCardProps = {
  title: string;
  content: string;
  onCopy: () => void;
  copied: boolean;
};

const TEMPLATE_MAP: Record<string, string[]> = {
  "Salon / Barber": [
    "Promote my weekend braids special",
    "Promote a fresh haircut special for this Friday",
    "Invite clients to book appointments before weekend slots fill up",
  ],
  "Restaurant / Food Business": [
    "Promote my weekend burger special",
    "Promote our lunch combo deal",
    "Promote free delivery for orders above a certain amount",
  ],
  "Clothing Store / Boutique": [
    "Promote our new arrivals this week",
    "Promote a limited-time fashion sale",
    "Promote our weekend outfit collection",
  ],
  "Freelancer / Personal Brand": [
    "Promote my web design services",
    "Promote a limited-time personal branding offer",
    "Promote a free consultation for new clients",
  ],
  "Car Dealership": [
    "Promote a weekend car sale event",
    "Promote affordable monthly repayment options",
    "Promote a featured vehicle deal this week",
  ],
  "Home Services (Electrician, Plumber, etc.)": [
    "Promote discounted home repair services this week",
    "Promote same-day emergency callout services",
    "Promote a limited-time discount for new customers",
  ],
  "Health & Wellness (Massage, Spa, Fitness)": [
    "Promote a weekend massage special",
    "Promote a relaxing spa treatment package",
    "Promote a new client fitness offer",
  ],
  "Local Service Business": [
    "Promote our services to new local customers",
    "Promote a limited-time special offer this week",
    "Promote fast and reliable service for local clients",
  ],
};

function ResultCard({
  title,
  content,
  onCopy,
  copied,
}: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-slate-700">{content}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [businessType, setBusinessType] = useState("Local Service Business");
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [dailyIdea, setDailyIdea] = useState<DailyIdea | null>(null);
  const [isLoadingDailyIdea, setIsLoadingDailyIdea] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [isDeletingHistoryId, setIsDeletingHistoryId] = useState<number | null>(
    null
  );
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterError, setPosterError] = useState("");

  const fetchUsage = async () => {
    try {
      const res = await fetch("/api/usage");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load usage.");
      }

      setUsage(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to check usage.");
    } finally {
      setIsLoadingUsage(false);
    }
  };

  const fetchHistory = async (searchValue = historySearch) => {
    try {
      setIsLoadingHistory(true);

      const query = searchValue.trim()
        ? `/api/history?search=${encodeURIComponent(searchValue.trim())}`
        : "/api/history";

      const res = await fetch(query);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load history.");
      }

      setHistory(data);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchDailyIdea = async () => {
    try {
      const res = await fetch("/api/daily-idea");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load daily idea.");
      }

      setDailyIdea(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDailyIdea(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    fetchHistory("");
    fetchDailyIdea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateCampaign = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    if (
      usage &&
      usage.campaignLimit !== -1 &&
      usage.campaignUsageCount >= usage.campaignLimit
    ) {
      setErrorMessage("You have reached your monthly campaign limit.");
      return;
    }

    const currentPrompt = prompt.trim();

    setIsGenerating(true);
    setErrorMessage("");
    setPosterError("");
    setPosterUrl(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate-campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentPrompt,
          businessType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
      setGeneratedPrompt(currentPrompt);
      setPrompt("");
      setCopiedField(null);
      await fetchUsage();
      await fetchHistory();
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Could not generate campaign. Please try again.");
      }

      await fetchUsage();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePoster = async () => {
    if (!result || !generatedPrompt.trim()) return;

    setIsGeneratingPoster(true);
    setPosterError("");
    setPosterUrl(null);

    try {
      const res = await fetch("/api/generate-poster", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessType,
          prompt: generatedPrompt,
          socialCaption: result.socialCaption,
          whatsappPromo: result.whatsappPromo,
          adCopy: result.adCopy,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate poster.");
      }

      setPosterUrl(data.imageUrl);
      await fetchUsage();
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        setPosterError(error.message);
      } else {
        setPosterError("Failed to generate poster.");
      }
    } finally {
      setIsGeneratingPoster(false);
    }
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

  const handleReuseCampaign = (item: CampaignHistoryItem) => {
    setResult({
      socialCaption: item.social_caption,
      whatsappPromo: item.whatsapp_promo,
      adCopy: item.ad_copy,
      marketingTip: item.marketing_tip,
    });
    setCopiedField(null);
    setPosterUrl(null);
    setPosterError("");

    const prefix = item.prompt.includes(":")
      ? item.prompt.split(":")[0].trim()
      : "Local Service Business";

    const promptText = item.prompt.includes(":")
      ? item.prompt.split(":").slice(1).join(":").trim()
      : item.prompt;

    setBusinessType(prefix);
    setGeneratedPrompt(promptText);
  };

  const handleUseDailyIdea = () => {
    if (!dailyIdea) return;
    setPrompt(dailyIdea.idea);
    setResult(null);
    setPosterUrl(null);
    setPosterError("");
  };

  const handleDeleteHistoryItem = async (id: number) => {
    try {
      setIsDeletingHistoryId(id);

      const res = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete campaign.");
      }

      await fetchHistory();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeletingHistoryId(null);
    }
  };

  const handleHistorySearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchHistory(historySearch);
  };

  const campaignLimitReached =
    usage !== null &&
    usage.campaignLimit !== -1 &&
    usage.campaignUsageCount >= usage.campaignLimit;

  const posterGenerationLocked = usage !== null && usage.posterLimit === 0;

  const selectedTemplates = TEMPLATE_MAP[businessType] ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Marketa AI Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Generate ready-to-use marketing campaigns for your business.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
              {isLoadingUsage || !usage ? (
                "Loading usage..."
              ) : (
                <div className="space-y-1 text-right">
                  <p>{usage.planName} Plan</p>
                  <p>
                    Campaigns:{" "}
                    {usage.campaignLimit === -1
                      ? `${usage.campaignUsageCount} / Unlimited`
                      : `${usage.campaignUsageCount} / ${usage.campaignLimit}`}
                  </p>
                  <p>
                    Posters:{" "}
                    {usage.posterLimit === -1
                      ? `${usage.posterUsageCount} / Unlimited`
                      : `${usage.posterUsageCount} / ${usage.posterLimit}`}
                  </p>
                </div>
              )}
            </div>
            <UserButton />
          </div>
        </div>

        {campaignLimitReached && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900">
              You have reached your {usage?.planName ?? "current"} plan campaign
              limit
            </h2>
            <p className="mt-2 text-sm text-amber-800">
              Upgrade your plan to generate more campaigns this month.
            </p>

            <div className="mt-4">
              <Link
                href="/pricing"
                className="inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
              >
                View Pricing
              </Link>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Daily Marketing Idea
              </p>

              {isLoadingDailyIdea ? (
                <>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    Loading today&apos;s idea...
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Marketa AI is preparing your idea for today.
                  </p>
                </>
              ) : dailyIdea ? (
                <>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {dailyIdea.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-slate-600">
                    {dailyIdea.idea}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    No daily idea available right now
                  </h2>
                  <p className="mt-2 text-slate-600">
                    Please refresh and try again.
                  </p>
                </>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={handleUseDailyIdea}
                disabled={!dailyIdea || campaignLimitReached}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Use This Idea
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                What do you want to promote?
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Example: Promote my restaurant weekend burger special.
              </p>

              <form onSubmit={handleGenerateCampaign} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Business Type
                  </label>

                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    disabled={campaignLimitReached || isGenerating}
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option>Salon / Barber</option>
                    <option>Restaurant / Food Business</option>
                    <option>Clothing Store / Boutique</option>
                    <option>Freelancer / Personal Brand</option>
                    <option>Car Dealership</option>
                    <option>Home Services (Electrician, Plumber, etc.)</option>
                    <option>Health & Wellness (Massage, Spa, Fitness)</option>
                    <option>Local Service Business</option>
                  </select>
                </div>

                {usage?.templatesEnabled ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Quick Templates
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTemplates.map((template) => (
                        <button
                          key={template}
                          type="button"
                          onClick={() => setPrompt(template)}
                          className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      Quick templates are available on Starter, Growth, and Pro
                      plans.
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-3 inline-block text-sm font-medium text-slate-900 underline"
                    >
                      Upgrade to unlock templates
                    </Link>
                  </div>
                )}

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    campaignLimitReached
                      ? "You have reached your monthly limit. Upgrade to continue."
                      : "Type what you want to promote here..."
                  }
                  disabled={campaignLimitReached || isGenerating}
                  className="min-h-[160px] w-full rounded-2xl border border-slate-300 px-4 py-4 text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                />

                <button
                  type="submit"
                  disabled={isGenerating || campaignLimitReached}
                  className="rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating
                    ? "Generating..."
                    : campaignLimitReached
                    ? "Monthly limit reached"
                    : "Generate Campaign"}
                </button>
              </form>

              {errorMessage && (
                <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
              )}
            </div>

            {!result && !isGenerating && !campaignLimitReached && (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Your campaign results will appear here
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Type what you want to promote, generate your campaign, and
                  copy the content into Instagram, Facebook, or WhatsApp.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <p className="text-slate-600">
                  Marketa AI is generating your campaign...
                </p>
              </div>
            )}

            {result && (
              <>
                <div className="mb-4 mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Campaign Results
                    </h2>
                    <p className="mt-2 text-slate-600">
                      Copy and use these results in your marketing channels.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <button
                      type="button"
                      onClick={handleGeneratePoster}
                      disabled={
                        isGeneratingPoster ||
                        !generatedPrompt.trim() ||
                        posterGenerationLocked
                      }
                      className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGeneratingPoster ? "Creating Poster..." : "Create Poster"}
                    </button>

                    {posterGenerationLocked && (
                      <p className="text-xs text-slate-500">
                        Poster generation is available on Starter, Growth, and
                        Pro.
                      </p>
                    )}
                  </div>
                </div>

                <section className="grid gap-6 md:grid-cols-2">
                  <ResultCard
                    title="Social Media Caption"
                    content={result.socialCaption}
                    onCopy={() =>
                      handleCopy("socialCaption", result.socialCaption)
                    }
                    copied={copiedField === "socialCaption"}
                  />

                  <ResultCard
                    title="WhatsApp Promotion"
                    content={result.whatsappPromo}
                    onCopy={() =>
                      handleCopy("whatsappPromo", result.whatsappPromo)
                    }
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
                    onCopy={() =>
                      handleCopy("marketingTip", result.marketingTip)
                    }
                    copied={copiedField === "marketingTip"}
                  />
                </section>

                {posterError && (
                  <p className="mt-6 text-sm text-red-600">{posterError}</p>
                )}

                {posterUrl && (
                  <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          Poster Preview
                        </h3>
                        <p className="mt-2 text-sm text-slate-600">
                          Ready-to-post promotional image for your campaign.
                        </p>
                      </div>

                      <a
                        href={posterUrl}
                        download="marketa-poster.png"
                        className="inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                      >
                        Download Poster
                      </a>
                    </div>

                    <img
                      src={posterUrl}
                      alt="Generated marketing poster"
                      className="mx-auto w-full max-w-md rounded-2xl border border-slate-200"
                    />
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setPosterUrl(null);
                      setPosterError("");
                      setGeneratedPrompt("");
                    }}
                    className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Generate Another Campaign
                  </button>
                </div>
              </>
            )}
          </div>

          <aside>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent Campaigns
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {usage?.advancedHistoryEnabled
                  ? "Search, reuse, or delete your saved campaigns."
                  : "Reuse your saved campaigns. Search and delete are available on paid plans."}
              </p>

              {usage?.advancedHistoryEnabled ? (
                <form
                  onSubmit={handleHistorySearchSubmit}
                  className="mt-5 flex gap-2"
                >
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="Search history..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    Search
                  </button>
                </form>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">
                    Advanced history search and delete are available on Starter,
                    Growth, and Pro.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-3 inline-block text-sm font-medium text-slate-900 underline"
                  >
                    Upgrade to unlock advanced history
                  </Link>
                </div>
              )}

              <div className="mt-6 space-y-4">
                {isLoadingHistory ? (
                  <p className="text-sm text-slate-500">Loading history...</p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No matching campaign history yet.
                  </p>
                ) : (
                  history.map((item) => {
                    const businessLabel = item.prompt.includes(":")
                      ? item.prompt.split(":")[0].trim()
                      : "General";

                    const promptLabel = item.prompt.includes(":")
                      ? item.prompt.split(":").slice(1).join(":").trim()
                      : item.prompt;

                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {businessLabel}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-900">
                          {promptLabel}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleString()}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReuseCampaign(item)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            View Campaign
                          </button>

                          {usage?.advancedHistoryEnabled && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy("historyPrompt", item.prompt)
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Copy Prompt
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteHistoryItem(item.id)}
                                disabled={isDeletingHistoryId === item.id}
                                className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isDeletingHistoryId === item.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}