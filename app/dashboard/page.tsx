"use client";

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  BUSINESS_TYPES,
  OTHER_BUSINESS_TYPE,
  getEffectiveBusinessType,
  isListedBusinessType,
} from "@/lib/businessTypes";
import {
  PosterTemplate,
  TemplatePosterData,
  renderTemplatePoster,
} from "@/lib/templatePoster";

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

type BusinessProfileSummary = {
  businessName: string;
  businessType: string;
  customBusinessType: string;
  logoUrl: string;
  brandImages: string[];
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
  "Car Wash / Detailing": [
    "Promote a weekend car wash special",
    "Promote our full interior and exterior detailing package",
    "Promote a loyalty deal for returning customers",
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
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-violet-400/30 hover:bg-white/[0.055]">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/40 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
        {content}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const [businessType, setBusinessType] = useState("Local Service Business");
  const [customBusinessType, setCustomBusinessType] = useState("");
  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileSummary | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedBusinessType, setGeneratedBusinessType] = useState("");
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [dailyIdea, setDailyIdea] = useState<DailyIdea | null>(null);
  const [, setIsLoadingDailyIdea] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [isDeletingHistoryId, setIsDeletingHistoryId] = useState<number | null>(
    null
  );
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterError, setPosterError] = useState("");
  const [posterTemplate, setPosterTemplate] =
    useState<PosterTemplate>("bold");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [generatedAttachmentUrl, setGeneratedAttachmentUrl] = useState("");
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveBusinessType = getEffectiveBusinessType(
    businessType,
    customBusinessType
  );

  const fetchBusinessProfile = async () => {
    try {
      const res = await fetch("/api/business-profile");
      if (!res.ok) return;

      const data = await res.json();
      const profile = data.profile;

      setBusinessProfile(profile ?? null);

      if (!profile?.businessType) return;

      if (profile.businessType === OTHER_BUSINESS_TYPE) {
        setBusinessType(OTHER_BUSINESS_TYPE);
        setCustomBusinessType(profile.customBusinessType ?? "");
      } else if (isListedBusinessType(profile.businessType)) {
        setBusinessType(profile.businessType);
        setCustomBusinessType("");
      }
    } catch (error) {
      console.error("Failed to load business profile:", error);
    }
  };

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
      console.warn("Daily idea unavailable:", error);
    } finally {
      setIsLoadingDailyIdea(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    fetchHistory("");
    fetchDailyIdea();
    fetchBusinessProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateCampaign = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    if (!effectiveBusinessType) {
      setErrorMessage("Please tell us what type of business you run.");
      return;
    }

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
          businessType: effectiveBusinessType,
          attachmentUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
      setGeneratedPrompt(currentPrompt);
      setGeneratedBusinessType(effectiveBusinessType);
      setGeneratedAttachmentUrl(attachmentUrl);
      setPrompt("");
      setAttachmentUrl("");
      setAttachmentName("");
      setCopiedField(null);
      await fetchUsage();
      await fetchHistory();
    } catch (error: unknown) {
      console.warn("Campaign generation unavailable:", error);

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
          businessType: generatedBusinessType || effectiveBusinessType,
          prompt: generatedPrompt,
          socialCaption: result.socialCaption,
          whatsappPromo: result.whatsappPromo,
          adCopy: result.adCopy,
          template: posterTemplate,
          brandImageUrl: generatedAttachmentUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate poster.");
      }

      const imageUrl = await renderTemplatePoster(
        data.poster as TemplatePosterData
      );
      setPosterUrl(imageUrl);
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

    if (isListedBusinessType(prefix)) {
      setBusinessType(prefix);
      setCustomBusinessType("");
    } else {
      setBusinessType(OTHER_BUSINESS_TYPE);
      setCustomBusinessType(prefix);
    }

    setGeneratedBusinessType(prefix);
    setGeneratedPrompt(promptText);
  };

  const handleUseDailyIdea = () => {
    if (!dailyIdea) return;
    setPrompt(dailyIdea.idea);
    setResult(null);
    setPosterUrl(null);
    setPosterError("");
    window.requestAnimationFrame(() => {
      document
        .getElementById("campaign-builder")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleAttachmentUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploadingAttachment(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", "photo");

      const res = await fetch("/api/business-profile/assets", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to attach image.");
      }

      setAttachmentUrl(data.url);
      setAttachmentName(file.name);
      setBusinessProfile((current) =>
        current
          ? {
              ...current,
              logoUrl: data.profile?.logoUrl ?? current.logoUrl,
              brandImages:
                data.profile?.brandImages ?? current.brandImages,
            }
          : current
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to attach image."
      );
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const startNewCampaign = () => {
    setResult(null);
    setPosterUrl(null);
    setPosterError("");
    setGeneratedPrompt("");
    setGeneratedBusinessType("");
    setGeneratedAttachmentUrl("");
    setAttachmentUrl("");
    setAttachmentName("");
    setErrorMessage("");
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

  const posterLimitReached =
    usage !== null &&
    usage.posterLimit !== -1 &&
    usage.posterUsageCount >= usage.posterLimit;

  const selectedTemplates = TEMPLATE_MAP[effectiveBusinessType] ?? [];
  const firstName = user?.firstName || user?.username || "there";
  const savedBusinessName = businessProfile?.businessName?.trim();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080d] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-30" />
      <div className="pointer-events-none fixed left-[18%] top-[-18rem] h-[38rem] w-[38rem] rounded-full bg-violet-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-18rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[19rem] shrink-0 flex-col border-r border-white/10 bg-black/20 px-4 py-5 backdrop-blur-xl lg:flex">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 font-bold text-white shadow-lg shadow-violet-950/40">
              M
            </span>
            <div>
              <p className="font-semibold tracking-tight text-white">Marketa AI</p>
              <p className="text-xs text-slate-500">Marketing intelligence</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={startNewCampaign}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
          >
            <span className="text-lg leading-none">＋</span>
            New campaign
          </button>

          <nav className="mt-5 space-y-1">
            <Link
              href="/dashboard/business-profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>◈</span>
              Business profile
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span>◇</span>
              Plans &amp; usage
            </Link>
          </nav>

          <div className="mt-7 flex min-h-0 flex-1 flex-col border-t border-white/10 pt-5">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Campaign history
              </p>
              <span className="text-xs text-slate-600">{history.length}</span>
            </div>

            {usage?.advancedHistoryEnabled && (
              <form onSubmit={handleHistorySearchSubmit} className="mt-3">
                <input
                  type="search"
                  value={historySearch}
                  onChange={(event) => setHistorySearch(event.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
                />
              </form>
            )}

            <div className="mt-3 min-h-0 space-y-1 overflow-y-auto pr-1">
              {isLoadingHistory ? (
                <p className="px-2 py-3 text-xs text-slate-600">Loading history...</p>
              ) : history.length === 0 ? (
                <p className="px-2 py-3 text-xs leading-5 text-slate-600">
                  Your generated campaigns will appear here.
                </p>
              ) : (
                history.map((item) => {
                  const promptLabel = item.prompt.includes(":")
                    ? item.prompt.split(":").slice(1).join(":").trim()
                    : item.prompt;

                  return (
                    <div
                      key={item.id}
                      className="group flex items-start gap-1 rounded-xl hover:bg-white/5"
                    >
                      <button
                        type="button"
                        onClick={() => handleReuseCampaign(item)}
                        className="min-w-0 flex-1 px-3 py-2.5 text-left"
                      >
                        <span className="block truncate text-sm text-slate-300">
                          {promptLabel}
                        </span>
                        <span className="mt-1 block text-[11px] text-slate-600">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </button>
                      {usage?.advancedHistoryEnabled && (
                        <button
                          type="button"
                          onClick={() => handleDeleteHistoryItem(item.id)}
                          disabled={isDeletingHistoryId === item.id}
                          aria-label="Delete campaign"
                          className="mr-2 mt-2 hidden rounded-md px-1.5 py-1 text-xs text-slate-600 transition hover:bg-red-500/10 hover:text-red-300 group-hover:block"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            {usage && (
              <div className="rounded-xl bg-white/[0.04] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">
                    {usage.planName} plan
                  </p>
                  <Link href="/pricing" className="text-xs text-violet-300">
                    Manage
                  </Link>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {usage.campaignUsageCount} /{" "}
                  {usage.campaignLimit === -1 ? "∞" : usage.campaignLimit} campaigns
                  {" · "}
                  {usage.posterUsageCount} /{" "}
                  {usage.posterLimit === -1 ? "∞" : usage.posterLimit} posters
                </p>
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
            <header className="flex items-center justify-between border-b border-white/10 py-4 lg:py-5">
              <div className="lg:hidden">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-sm">
                    M
                  </span>
                  Marketa AI
                </Link>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm text-slate-500">
                  Workspace / {savedBusinessName || effectiveBusinessType}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/business-profile"
                  className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/30 hover:text-white sm:inline-flex"
                >
                  Brand Kit
                </Link>
                <UserButton />
              </div>
            </header>

            <details className="group mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm marker:hidden">
                <span className="text-slate-300">History &amp; usage</span>
                <span className="text-violet-300 group-open:rotate-45">＋</span>
              </summary>
              <div className="max-h-64 space-y-2 overflow-y-auto border-t border-white/10 p-3">
                {history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleReuseCampaign(item)}
                    className="block w-full truncate rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    {item.prompt.includes(":")
                      ? item.prompt.split(":").slice(1).join(":").trim()
                      : item.prompt}
                  </button>
                ))}
              </div>
            </details>

            <div className="flex-1 py-8 sm:py-12">
              {!result && !isGenerating && (
                <section className="mx-auto max-w-3xl text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 text-2xl shadow-[0_0_50px_rgba(139,92,246,0.22)]">
                    ✦
                  </div>
                  <p className="mt-6 text-sm font-medium text-violet-300">
                    Your AI marketing workspace
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    Welcome, {firstName}. What are we creating?
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
                    Turn one idea into a social caption, WhatsApp promotion, ad
                    copy and branded poster—grounded in your saved business profile.
                  </p>

                  {dailyIdea && (
                    <button
                      type="button"
                      onClick={handleUseDailyIdea}
                      disabled={campaignLimitReached}
                      className="group mx-auto mt-8 w-full max-w-2xl rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 p-5 text-left transition hover:border-violet-400/40 hover:bg-violet-500/15 disabled:opacity-50"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                        ✨ Idea for {savedBusinessName || effectiveBusinessType}
                      </span>
                      <span className="mt-2 block font-semibold text-white">
                        {dailyIdea.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-400">
                        {dailyIdea.idea}
                      </span>
                      <span className="mt-4 block text-sm font-medium text-violet-300">
                        Use this idea →
                      </span>
                    </button>
                  )}

                  {!businessProfile?.businessType && (
                    <div className="mx-auto mt-6 max-w-2xl text-left">
                      <label className="text-xs font-medium text-slate-400">
                        Business type
                      </label>
                      <select
                        value={businessType}
                        onChange={(event) => setBusinessType(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#11131b] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50"
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {businessType === OTHER_BUSINESS_TYPE && (
                        <input
                          type="text"
                          value={customBusinessType}
                          onChange={(event) =>
                            setCustomBusinessType(event.target.value)
                          }
                          placeholder="Tell Marketa what type of business you run"
                          className="mt-3 w-full rounded-xl border border-white/10 bg-[#11131b] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
                        />
                      )}
                    </div>
                  )}
                </section>
              )}

              {isGenerating && (
                <div className="mx-auto max-w-4xl space-y-6">
                  <div className="ml-auto max-w-2xl rounded-3xl rounded-br-md bg-violet-600 px-5 py-4 text-sm leading-6 text-white">
                    {prompt || generatedPrompt}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="ai-pulse flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      ✦
                    </span>
                    Marketa is building your campaign...
                  </div>
                </div>
              )}

              {result && (
                <section className="mx-auto max-w-5xl space-y-7">
                  <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
                    <div aria-hidden="true" />
                    <div className="ml-auto w-full max-w-2xl rounded-3xl rounded-br-md bg-gradient-to-br from-violet-600 to-indigo-600 px-5 py-4 shadow-lg shadow-violet-950/30">
                    <p className="whitespace-pre-line text-sm leading-6 text-white">
                      {generatedPrompt}
                    </p>
                    {generatedAttachmentUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-white/20">
                        <Image
                          src={generatedAttachmentUrl}
                          alt="Image attached to campaign prompt"
                          width={640}
                          height={360}
                          unoptimized
                          className="max-h-48 w-full object-cover"
                        />
                      </div>
                    )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      ✦
                    </div>
                    <div className="min-w-0 flex-1 rounded-3xl rounded-tl-md border border-white/10 bg-[#10121a]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
                      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                            Campaign ready ✨
                          </p>
                          <h2 className="mt-2 text-xl font-semibold text-white">
                            Four ready-to-use marketing assets
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={startNewCampaign}
                          className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          New campaign
                        </button>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <ResultCard
                          title="📱 Social media caption"
                          content={result.socialCaption}
                          onCopy={() =>
                            handleCopy("socialCaption", result.socialCaption)
                          }
                          copied={copiedField === "socialCaption"}
                        />
                        <ResultCard
                          title="💬 WhatsApp promotion"
                          content={result.whatsappPromo}
                          onCopy={() =>
                            handleCopy("whatsappPromo", result.whatsappPromo)
                          }
                          copied={copiedField === "whatsappPromo"}
                        />
                        <ResultCard
                          title="🚀 Ad copy"
                          content={result.adCopy}
                          onCopy={() => handleCopy("adCopy", result.adCopy)}
                          copied={copiedField === "adCopy"}
                        />
                        <ResultCard
                          title="💡 Marketing tip"
                          content={result.marketingTip}
                          onCopy={() =>
                            handleCopy("marketingTip", result.marketingTip)
                          }
                          copied={copiedField === "marketingTip"}
                        />
                      </div>

                      <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/[0.07] p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium text-white">
                              Turn this campaign into a poster?
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              Your saved logo, colours and selected image will be applied.
                            </p>
                          </div>
                          {posterLimitReached ? (
                            <Link
                              href="/pricing"
                              className="text-sm font-medium text-violet-300"
                            >
                              Upgrade poster limit →
                            </Link>
                          ) : (
                            <div className="flex gap-2">
                              <select
                                value={posterTemplate}
                                onChange={(event) =>
                                  setPosterTemplate(
                                    event.target.value as PosterTemplate
                                  )
                                }
                                disabled={isGeneratingPoster}
                                aria-label="Poster style"
                                className="rounded-xl border border-white/10 bg-[#151722] px-3 py-2.5 text-sm text-slate-200 outline-none"
                              >
                                <option value="bold">Bold gradient</option>
                                <option value="clean">Clean minimal</option>
                                <option value="photo">Brand photo</option>
                              </select>
                              <button
                                type="button"
                                onClick={handleGeneratePoster}
                                disabled={isGeneratingPoster}
                                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
                              >
                                {isGeneratingPoster ? "Creating..." : "Create poster"}
                              </button>
                            </div>
                          )}
                        </div>
                        {posterError && (
                          <p className="mt-3 text-sm text-red-300">{posterError}</p>
                        )}
                      </div>

                      {posterUrl && (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-medium text-white">Poster ready 🎨</p>
                              <p className="mt-1 text-xs text-slate-500">
                                1080 × 1080 PNG
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={posterUrl}
                                download="marketa-poster.png"
                                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950"
                              >
                                Download
                              </a>
                              <button
                                type="button"
                                onClick={() => window.open(posterUrl, "_blank")}
                                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300"
                              >
                                Full size
                              </button>
                            </div>
                          </div>
                          <Image
                            src={posterUrl}
                            alt="Generated marketing poster"
                            width={1024}
                            height={1024}
                            unoptimized
                            className="mx-auto w-full max-w-xl rounded-xl border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div
              id="campaign-builder"
              className="sticky bottom-0 z-20 pb-5 pt-3 [background:linear-gradient(180deg,transparent,#07080d_28%)]"
            >
              <div className="mx-auto max-w-4xl">
                {campaignLimitReached && (
                  <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                    You have reached your monthly campaign limit.{" "}
                    <Link href="/pricing" className="font-semibold underline">
                      View plans
                    </Link>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                )}

                <form
                  onSubmit={handleGenerateCampaign}
                  className="rounded-3xl border border-white/10 bg-[#12141d]/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl focus-within:border-violet-400/40"
                >
                  {savedBusinessName && (
                    <div className="flex items-center gap-2 px-2 pb-2 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Creating for {savedBusinessName} · {effectiveBusinessType}
                    </div>
                  )}

                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={
                      campaignLimitReached
                        ? "Monthly limit reached"
                        : "Ask Marketa to create your next campaign..."
                    }
                    rows={3}
                    disabled={
                      campaignLimitReached ||
                      isGenerating ||
                      isUploadingAttachment
                    }
                    className="max-h-48 min-h-20 w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
                  />

                  {attachmentUrl && (
                    <div className="mx-2 mb-2 flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 p-2">
                      <Image
                        src={attachmentUrl}
                        alt="Attached business image"
                        width={44}
                        height={44}
                        unoptimized
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-200">
                          {attachmentName}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Marketa will use this image as campaign context
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachmentUrl("");
                          setAttachmentName("");
                        }}
                        aria-label="Remove attachment"
                        className="rounded-lg px-2 py-1 text-slate-500 hover:bg-white/5 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {usage?.templatesEnabled &&
                    selectedTemplates.length > 0 &&
                    !prompt && (
                      <div className="flex gap-2 overflow-x-auto px-2 pb-3">
                        {selectedTemplates.map((template) => (
                          <button
                            key={template}
                            type="button"
                            onClick={() => setPrompt(template)}
                            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-violet-400/30 hover:text-white"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center justify-between border-t border-white/10 px-1 pt-3">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleAttachmentUpload}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={
                          campaignLimitReached ||
                          isGenerating ||
                          isUploadingAttachment
                        }
                        title="Attach a product, service, or brand image"
                        aria-label="Attach a product, service, or brand image"
                        data-tooltip="Attach an image"
                        className="ai-tooltip relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-slate-400 transition hover:scale-105 hover:border-violet-400/40 hover:text-white disabled:opacity-50"
                      >
                        {isUploadingAttachment ? "…" : "+"}
                      </button>
                      <Link
                        href="/dashboard/business-profile"
                        className="hidden text-xs text-slate-500 transition hover:text-violet-300 sm:inline"
                      >
                        Brand Kit
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isGenerating ||
                        campaignLimitReached ||
                        isUploadingAttachment ||
                        !prompt.trim()
                      }
                      className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:from-violet-500 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isGenerating ? "Thinking..." : "Generate"}
                      <span aria-hidden="true">↑</span>
                    </button>
                  </div>
                </form>
                <p className="mt-2 text-center text-[11px] text-slate-600">
                  Marketa uses your profile and attached images to create better,
                  brand-aware results.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
