"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import BrandLogo from "@/components/BrandLogo";
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

type WorkspaceIconName =
  | "brand"
  | "chat"
  | "chevron"
  | "close"
  | "help"
  | "logout"
  | "menu"
  | "plus"
  | "search"
  | "settings"
  | "sparkles"
  | "usage";

function WorkspaceIcon({ name }: { name: WorkspaceIconName }) {
  const paths: Record<WorkspaceIconName, ReactNode> = {
    brand: (
      <>
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 18.5z" />
        <path d="M9 3v18M9 8h10" />
      </>
    ),
    chat: (
      <path d="M20 15a4 4 0 0 1-4 4H9l-5 3v-7a4 4 0 0 1-1-2.65V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.4 2.4 0 1 1 3.3 2.23c-.77.34-1.1.82-1.1 1.77M12 17h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.1A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H2V9.6h.1A1.7 1.7 0 0 0 3.6 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8 3.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V2h4v.1A1.7 1.7 0 0 0 15 3.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8c.15.37.36.7.6 1 .29.32.68.5 1.1.6h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.15 3.1L16 7.5l-2.85 1.4L12 12l-1.15-3.1L8 7.5l2.85-1.4z" />
        <path d="m18.5 13 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7zM5.5 13.5l.85 2.15 2.15.85-2.15.85L5.5 19.5l-.85-2.15-2.15-.85 2.15-.85z" />
      </>
    ),
    usage: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0"
    >
      {paths[name]}
    </svg>
  );
}

function getHistoryGroup(createdAt: string) {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDay = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate()
  );
  const daysAgo = Math.floor(
    (today.getTime() - itemDay.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (daysAgo <= 0) return "Today";
  if (daysAgo <= 7) return "Previous 7 days";
  if (daysAgo <= 30) return "Previous 30 days";
  return "Older";
}

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
  const [visibleContent, setVisibleContent] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(
        () => setVisibleContent(content),
        0
      );
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let position = 0;
    const chunkSize = Math.max(1, Math.ceil(content.length / 90));
    const timer = window.setInterval(() => {
      position = Math.min(content.length, position + chunkSize);
      setVisibleContent(content.slice(0, position));
      if (position >= content.length) window.clearInterval(timer);
    }, 18);

    return () => window.clearInterval(timer);
  }, [content]);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.055] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
        {visibleContent}
        {visibleContent.length < content.length ? (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-cyan-300 align-middle" />
        ) : null}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHistorySearchOpen, setIsHistorySearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [isGenerating, result, posterUrl]);

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
    setPrompt("");
    setResult(null);
    setPosterUrl(null);
    setPosterError("");
    setGeneratedPrompt("");
    setGeneratedBusinessType("");
    setGeneratedAttachmentUrl("");
    setAttachmentUrl("");
    setAttachmentName("");
    setErrorMessage("");
    setIsSidebarOpen(false);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
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
  const accountName = user?.fullName || user?.username || "Your account";
  const accountEmail =
    user?.primaryEmailAddress?.emailAddress || "Manage your Marketa account";
  const accountInitial = accountName.charAt(0).toUpperCase();
  const conversationTitle = generatedPrompt || prompt || "New campaign";
  const historyGroups = [
    "Today",
    "Previous 7 days",
    "Previous 30 days",
    "Older",
  ]
    .map((label) => ({
      label,
      items: history.filter((item) => getHistoryGroup(item.created_at) === label),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main className="relative h-dvh overflow-hidden bg-[#070a10] text-white">
      <div className="pointer-events-none fixed inset-0 ai-grid opacity-30" />
      <div className="pointer-events-none fixed left-[18%] top-[-18rem] h-[38rem] w-[38rem] rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-18rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative flex h-full min-h-0">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[19rem] shrink-0 flex-col border-r border-white/10 bg-[#090b11]/98 px-3 py-4 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="medium" />
              <div>
                <p className="font-semibold tracking-tight text-white">Marketa AI</p>
                <p className="text-[11px] text-slate-500">Marketing intelligence</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white lg:hidden"
            >
              <WorkspaceIcon name="close" />
            </button>
          </div>

          <nav aria-label="Workspace" className="mt-6 space-y-1">
            <button
              type="button"
              onClick={startNewCampaign}
              className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600/90 to-cyan-500/80 px-3 py-2.5 text-left text-sm font-medium text-white shadow-lg shadow-blue-950/20 transition hover:brightness-110"
            >
              <WorkspaceIcon name="plus" />
              New campaign
            </button>
            {usage?.advancedHistoryEnabled ? (
              <button
                type="button"
                onClick={() => setIsHistorySearchOpen((current) => !current)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <WorkspaceIcon name="search" />
                Search campaigns
              </button>
            ) : (
              <Link
                href="/pricing"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <WorkspaceIcon name="search" />
                Search campaigns
                <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-600">
                  Upgrade
                </span>
              </Link>
            )}
            <Link
              href="/dashboard/business-profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <WorkspaceIcon name="brand" />
              Brand kit
            </Link>
            <Link
              href="/dashboard/billing"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <WorkspaceIcon name="usage" />
              Plans &amp; usage
            </Link>
          </nav>

          {isHistorySearchOpen && usage?.advancedHistoryEnabled && (
            <form onSubmit={handleHistorySearchSubmit} className="mt-3 px-1">
              <label htmlFor="campaign-history-search" className="sr-only">
                Search campaign history
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-white/[0.04] px-3 focus-within:border-cyan-400/50">
                <WorkspaceIcon name="search" />
                <input
                  id="campaign-history-search"
                  type="search"
                  autoFocus
                  value={historySearch}
                  onChange={(event) => setHistorySearch(event.target.value)}
                  placeholder="Search history"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </form>
          )}

          <div className="mt-5 flex min-h-0 flex-1 flex-col border-t border-white/10 pt-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-xs font-medium text-slate-500">Campaigns</p>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-600">
                {history.length}
              </span>
            </div>

            <div className="mt-2 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {isLoadingHistory ? (
                <p className="px-2 py-3 text-xs text-slate-600">Loading campaigns...</p>
              ) : history.length === 0 ? (
                <div className="mx-1 mt-2 rounded-xl border border-dashed border-white/10 px-3 py-4">
                  <p className="text-xs font-medium text-slate-400">No campaigns yet</p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Your conversations with Marketa will live here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {historyGroups.map((group) => (
                    <div key={group.label}>
                      <p className="px-2 py-1 text-[11px] font-medium text-slate-600">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const promptLabel = item.prompt.includes(":")
                            ? item.prompt.split(":").slice(1).join(":").trim()
                            : item.prompt;

                          return (
                            <div
                              key={item.id}
                              className="group flex items-center rounded-xl transition hover:bg-white/5"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  handleReuseCampaign(item);
                                  setIsSidebarOpen(false);
                                }}
                                className="flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
                              >
                                <WorkspaceIcon name="chat" />
                                <span className="truncate text-[13px] text-slate-400 group-hover:text-slate-200">
                                  {promptLabel}
                                </span>
                              </button>
                              {usage?.advancedHistoryEnabled && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteHistoryItem(item.id)}
                                  disabled={isDeletingHistoryId === item.id}
                                  aria-label={`Delete ${promptLabel}`}
                                  className="mr-2 rounded-lg px-2 py-1 text-xs text-slate-600 opacity-0 transition hover:bg-red-500/10 hover:text-red-300 focus:opacity-100 group-hover:opacity-100"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3">
            <details className="group/account relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-2 py-2.5 transition marker:hidden hover:bg-white/[0.05]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white shadow-lg shadow-violet-950/30">
                  {accountInitial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-200">
                    {accountName}
                  </span>
                  <span className="block truncate text-[11px] text-slate-600">
                    {usage?.planName || "Free"} plan
                  </span>
                </span>
                <span className="rotate-[-90deg] text-slate-600 transition group-open/account:rotate-90">
                  <WorkspaceIcon name="chevron" />
                </span>
              </summary>

              <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-white/10 bg-[#11141d] p-2 shadow-2xl shadow-black/60">
                <div className="border-b border-white/10 px-3 pb-3 pt-2">
                  <p className="truncate text-sm font-medium text-white">{accountName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">{accountEmail}</p>
                  {usage && (
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">
                      {usage.campaignUsageCount} / {usage.campaignLimit === -1 ? "∞" : usage.campaignLimit} campaigns
                      {" · "}
                      {usage.posterUsageCount} / {usage.posterLimit === -1 ? "∞" : usage.posterLimit} posters
                    </p>
                  )}
                </div>
                <Link
                  href="/dashboard/business-profile"
                  className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <WorkspaceIcon name="brand" />
                  Business profile &amp; brand kit
                </Link>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <WorkspaceIcon name="usage" />
                  Plan &amp; usage
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <WorkspaceIcon name="help" />
                  Help &amp; support
                </Link>
                <button
                  type="button"
                  onClick={() => openUserProfile()}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <WorkspaceIcon name="settings" />
                  Account settings
                </button>
                <button
                  type="button"
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <WorkspaceIcon name="logout" />
                  Sign out
                </button>
              </div>
            </details>
          </div>
        </aside>

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex h-full min-h-0 w-full flex-col px-3 sm:px-5 xl:px-7 2xl:px-9">
            <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open navigation"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-400/30 hover:text-white lg:hidden"
                >
                  <WorkspaceIcon name="menu" />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200 sm:text-base">
                    {conversationTitle}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-600 sm:text-xs">
                    {savedBusinessName || effectiveBusinessType} · AI campaign workspace
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400 sm:inline-flex">
                  {usage?.planName || "Free"} plan
                </span>
                <Link
                  href="/dashboard/business-profile"
                  aria-label="Open brand kit"
                  className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                >
                  <WorkspaceIcon name="brand" />
                  <span className="hidden sm:inline">Brand kit</span>
                </Link>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6 pr-1 sm:py-8">
              {!result && !isGenerating && (
                <section className="mx-auto w-full max-w-4xl text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-2xl shadow-[0_0_50px_rgba(34,211,238,0.18)]">
                    ✦
                  </div>
                  <p className="mt-6 text-sm font-medium text-cyan-300">
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
                      className="group mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-blue-500/10 to-cyan-400/5 p-5 text-left transition hover:border-cyan-400/40 hover:bg-cyan-500/10 disabled:opacity-50"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                        ✨ Idea for {savedBusinessName || effectiveBusinessType}
                      </span>
                      <span className="mt-2 block font-semibold text-white">
                        {dailyIdea.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-slate-400">
                        {dailyIdea.idea}
                      </span>
                      <span className="mt-4 block text-sm font-medium text-cyan-300">
                        Use this idea →
                      </span>
                    </button>
                  )}

                  {!businessProfile?.businessType && (
                    <div className="mx-auto mt-6 max-w-3xl text-left">
                      <label className="text-xs font-medium text-slate-400">
                        Business type
                      </label>
                      <select
                        value={businessType}
                        onChange={(event) => setBusinessType(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#11131b] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
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
                          className="mt-3 w-full rounded-xl border border-white/10 bg-[#11131b] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                        />
                      )}
                    </div>
                  )}
                </section>
              )}

              {isGenerating && (
                <div className="mx-auto w-full max-w-[1180px] space-y-6">
                  <div className="ml-auto max-w-2xl rounded-3xl rounded-br-md bg-gradient-to-br from-blue-600 to-cyan-600 px-5 py-4 text-sm leading-6 text-white">
                    {prompt || generatedPrompt}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="ai-pulse flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                      ✦
                    </span>
                    Marketa is building your campaign...
                  </div>
                </div>
              )}

              {result && (
                <section className="mx-auto w-full max-w-[1400px] space-y-7">
                  <div className="grid sm:grid-cols-[2.25rem_minmax(0,1fr)] sm:gap-3">
                    <div aria-hidden="true" className="hidden sm:block" />
                    <div className="ml-auto w-full max-w-2xl rounded-3xl rounded-br-md bg-gradient-to-br from-blue-600 to-cyan-600 px-4 py-4 shadow-lg shadow-blue-950/30 sm:px-5">
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

                  <div className="flex gap-0 sm:gap-3">
                    <div className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300 sm:flex">
                      ✦
                    </div>
                    <div className="min-w-0 flex-1 rounded-3xl border border-white/10 bg-[#10121a]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:rounded-tl-md sm:p-7">
                      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
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

                      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/[0.06] p-4">
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
                              className="text-sm font-medium text-cyan-300"
                            >
                              Upgrade poster limit →
                            </Link>
                          ) : (
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                              <select
                                value={posterTemplate}
                                onChange={(event) =>
                                  setPosterTemplate(
                                    event.target.value as PosterTemplate
                                  )
                                }
                                disabled={isGeneratingPoster}
                                aria-label="Poster style"
                                className="w-full rounded-xl border border-white/10 bg-[#151722] px-3 py-2.5 text-sm text-slate-200 outline-none sm:w-auto"
                              >
                                <option value="bold">Bold gradient</option>
                                <option value="clean">Clean minimal</option>
                                <option value="photo">Brand photo</option>
                              </select>
                              <button
                                type="button"
                                onClick={handleGeneratePoster}
                                disabled={isGeneratingPoster}
                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 sm:w-auto"
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
                            <div className="flex flex-wrap gap-2">
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
              <div ref={conversationEndRef} aria-hidden="true" />
            </div>

            <div
              id="campaign-builder"
              className="z-20 shrink-0 pb-4 pt-2 [background:linear-gradient(180deg,transparent,#070a10_24%)]"
            >
              <div className="mx-auto w-full max-w-[1180px]">
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
                  className="rounded-3xl border border-white/10 bg-[#101722]/95 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl focus-within:border-cyan-400/40"
                >
                  {savedBusinessName && (
                    <div className="flex items-center gap-2 px-2 pb-2 text-xs text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Creating for {savedBusinessName} · {effectiveBusinessType}
                    </div>
                  )}

                  <textarea
                    ref={promptInputRef}
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
                    <div className="mx-2 mb-2 flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-2">
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
                            className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-400/30 hover:text-white"
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
                        className="ai-tooltip relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-slate-400 transition hover:scale-105 hover:border-cyan-400/40 hover:text-white disabled:opacity-50"
                      >
                        {isUploadingAttachment ? "…" : "+"}
                      </button>
                      <Link
                        href="/dashboard/business-profile"
                        className="hidden text-xs text-slate-500 transition hover:text-cyan-300 sm:inline"
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
                      className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-medium text-white shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
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
